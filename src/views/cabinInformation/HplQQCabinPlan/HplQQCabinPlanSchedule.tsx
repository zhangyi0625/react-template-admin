import React, { useCallback, useEffect, useState } from 'react';
import { App, Divider, type TableProps } from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import DragModal from '@/components/modal/DragModal';
import {
  getHplQQCabinPlanShippingScheduleByPage,
  postHplQQCabinPlanShippingSchedule,
} from '@/services/cabinInformation/hplQQCabinPlan/hplQQCabinPlanApi';
import type {
  HplQQCabinPlanSearchResultType,
  HplQQCabinPlanShippingScheduleSearchParams,
} from '@/services/cabinInformation/hplQQCabinPlan/hplQQCabinPlanModel';
import { getShippingAccountDetail } from '@/services/marketManage/shippingAccount/shippingAccountApi';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';
import { formatTime } from '@/utils/format';

export type HplQQCabinPlanScheduleType = {
  params: {
    visible: boolean;
    currentRow: HplQQCabinPlanSearchResultType | null;
  };
  onOk: (params: { vesselIds: string[]; type: 'VESSEL' }) => void;
  onCancel: () => void;
};

type HplQQCabinPlanScheduleBaseInfoType = {
  label: string;
  key: string;
  value: string | void;
};

const HplQQCabinPlanSchedule: React.FC<HplQQCabinPlanScheduleType> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const [shippingAccount, setShippingAccount] = useState<{
    username: string;
  }>();

  const [searchScheduleParams, setSearchScheduleParams] =
    useState<HplQQCabinPlanShippingScheduleSearchParams>({
      page: 1,
      pageSize: 9999,
      filter: undefined,
    });

  const [seleted, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    loadShippingAccount();
  }, [visible]);

  const loadShippingAccount = async () => {
    try {
      const resp = await getShippingAccountDetail(
        currentRow?.booking.accountId as string
      );
      setShippingAccount(resp || {});
      setSearchScheduleParams({
        ...searchScheduleParams,
        filter: {
          porCode: getValueByKey('por')?.unlocode ?? '',
          fndCode: getValueByKey('fnd')?.unlocode ?? '',
          query_etd: formatTime(new Date().toISOString(), 'Y-M-D') ?? '',
        },
      });
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const getValueByKey = useCallback(
    (key: string) => {
      return (currentRow as any)?.[key] ?? '';
    },
    [currentRow]
  );

  const baseOptions: HplQQCabinPlanScheduleBaseInfoType[] = [
    {
      label: '起运港',
      key: 'por',
      value: () => {
        let value = getValueByKey('por') as LocationItem;
        return value.name + '-' + value.localName;
      },
    },
    {
      label: '目的港',
      key: 'fnd',
      value: () => {
        let value = getValueByKey('por') as LocationItem;
        return value.name + '-' + value.localName;
      },
    },
    {
      label: '航线代码',
      key: 'carrierCode',
      value: getValueByKey('carrierCode'),
    },
    {
      label: '箱型箱量',
      key: 'ctnType',
      value: () => {
        let booking = getValueByKey(
          'booking'
        ) as HplQQCabinPlanSearchResultType['booking'];
        return booking.ctnType + '*' + booking.ctnNum;
      },
    },
    {
      label: '每箱重量',
      key: 'ctnWeight',
      value: getValueByKey('booking')?.ctnWeight,
    },
    {
      label: '集装箱所有权',
      key: 'ctnOwner',
      value: getValueByKey('booking')?.ctnOwner
        ? '赫伯罗特集装箱'
        : '发货人自备箱',
    },
    {
      label: '订舱账号',
      key: 'accountId',
      value: shippingAccount?.username ?? '',
    },
    {
      label: '客户参考号',
      key: 'customerRefNo',
      value: getValueByKey('booking')?.customerRefNo,
    },
    {
      label: '通知邮箱',
      key: 'email',
      value: getValueByKey('booking')?.email,
    },
    {
      label: '合约号',
      key: 'contractNo',
      value: () => {
        let booking = getValueByKey(
          'booking'
        ) as HplQQCabinPlanSearchResultType['booking'];
        return (
          booking?.contractNo +
          ',' +
          booking?.routingPartyOne +
          '/' +
          booking?.routingPartyTwo
        );
      },
    },
    {
      label: '货物品名',
      key: 'commodityName',
      value: getValueByKey('booking')?.commodityName,
    },
    {
      label: '商品编码',
      key: 'goodsNo',
      value: getValueByKey('booking')?.goodsNo,
    },
  ];

  const isValidDate = (date: string) => {
    return !isNaN(new Date(date).getTime());
  };

  const columns: TableProps['columns'] = [
    {
      title: 'ETD',
      align: 'center',
      width: 180,
      render: (value) => {
        return formatTime(value.etd, 'Y-M-D');
      },
    },
    {
      title: '船名航次',
      align: 'center',
      width: 220,
      render(value) {
        return (
          <div>
            {value.vesselName} / {value.voyNo}
          </div>
        );
      },
    },
    {
      title: '航线代码',
      align: 'center',
      width: 120,
      dataIndex: 'carrierRoute',
    },
    {
      title: '中转',
      align: 'center',
      width: 120,
      dataIndex: 'transitSum',
    },
    {
      title: '航程',
      align: 'center',
      width: 120,
      dataIndex: 'voyDays',
    },
  ];

  const onUpdateSearch = async (
    info?: HplQQCabinPlanShippingScheduleSearchParams['filter'] | unknown
  ) => {
    const query_etd =
      (info as HplQQCabinPlanShippingScheduleSearchParams['filter'])
        ?.query_etd ?? '';
    setSearchScheduleParams({
      ...searchScheduleParams,
      filter: info as
        | HplQQCabinPlanShippingScheduleSearchParams['filter']
        | undefined,
    });
    try {
      await postHplQQCabinPlanShippingSchedule({
        porCode: getValueByKey('por')?.unlocode as string,
        fndCode: getValueByKey('fnd')?.unlocode as string,
        query_etd: formatTime(query_etd, 'Y-M-D') ?? '',
      });
    } catch {}
  };

  const handleOk = () => {
    if (!seleted.length) {
      message.error('至少选择一条船期！');
      return;
    }
    onOk({
      vesselIds: seleted,
      type: 'VESSEL',
    });
  };

  return (
    <DragModal
      width={{ xl: 850, xxl: 1000 }}
      open={visible}
      title="详情信息"
      onCancel={onCancel}
      loading={loading}
      onOk={handleOk}
    >
      <div className="grid grid-cols-3 gap-y-[20px]">
        {baseOptions.map((item) => (
          <div key={item.key}>
            <span className="text-sm text-gray-500">{item.label}：</span>
            <span className="text-sm">
              {typeof item.value === 'function'
                ? (item.value as () => string)() ?? ''
                : item.value ?? ''}
            </span>
          </div>
        ))}
      </div>
      <Divider />
      <div className="flex items-center mb-[20px]">
        <p className="text-sm text-gray-500">执行方式：</p>
        {getValueByKey('taskMode')?.type === 'DAY' ? (
          <p>
            {formatTime(getValueByKey('taskMode')?.startDate, 'Y-M-D')}至
            {formatTime(getValueByKey('taskMode')?.endDate, 'Y-M-D')}
          </p>
        ) : (
          <p>
            指定ETD,{' '}
            {formatTime(
              !isValidDate(getValueByKey('taskMode')?.etd)
                ? Number(getValueByKey('taskMode')?.etd)
                : getValueByKey('taskMode')?.etd,
              'Y-M-D'
            )}{' '}
            {getValueByKey('taskMode')?.vesselName ?? '-'} /
            {getValueByKey('taskMode')?.voyNo ?? '-'}
          </p>
        )}
      </div>
      <SearchForm
        columns={[
          {
            label: '',
            name: 'query_etd',
            formType: 'date-picker',
            span: 8,
            selectFetch: false,
            hiddenItem: false,
            customPlaceholder: '选择船期日期',
          },
        ]}
        gutterWidth={24}
        labelPosition="left"
        btnSeparate={false}
        iconHidden={false}
        isShowReset={false}
        searchBtnText="更新船期"
        isShowExpend={false}
        onUpdateSearch={onUpdateSearch}
      />
      <SearchTable
        size="small"
        columns={columns}
        style={{ marginTop: '10px' }}
        pageIndexKey="pageIndex"
        pageSizeKey="pageSize"
        scroll={{ x: 'max-content', y: 358 }}
        rowKey="id"
        totalKey="total"
        fetchResultKey="entries"
        isPagination={true}
        fetchData={getHplQQCabinPlanShippingScheduleByPage}
        searchFilter={searchScheduleParams}
        isSelection={true}
        selectionParentType="radio"
        onUpdatePagination={() => {}}
        onUpdateSelection={(ids) => {
          setSelected(ids);
        }}
      />
    </DragModal>
  );
};

export default HplQQCabinPlanSchedule;

import React, { useEffect, useState } from 'react';
import {
  Button,
  Drawer,
  Space,
  TablePaginationConfig,
  TableProps,
  Tabs,
  TabsProps,
} from 'antd';
import clsx from 'clsx';
import { CloseOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { getCabinResultByPage } from '@/services/orderManage/cabinResult/cabinResultApi';
import { RelevanceOrderOptions } from '../../CabinResult/config';
import type {
  FastBookingOrderSearchFilter,
  FastBookingOrderSearchParams,
} from '@/services/orderManage/fastBooking/fastBookingModel';
import type { CabinResultCtnType } from '@/services/orderManage/cabinResult/cabinResultModel';
import { formatTime } from '@/utils/format';

export type FastBooingResultDrawerProps = {
  params: {
    visible: boolean;
    row: Pick<
      FastBookingOrderSearchFilter,
      'affiliateId' | 'porId' | 'orderId'
    > | null;
  };
  onOk: (ids: string[], type: boolean) => void;
  onCancel: () => void;
};

const FastBooingResultDrawer: React.FC<FastBooingResultDrawerProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, row } = params;

  const [selected, setSelected] = useState<string[]>([]);

  const [immediate, setImmediate] = useState<boolean>(true);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<FastBookingOrderSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: {
        affiliateId: null,
      },
    });

  const items: TabsProps['items'] = [
    {
      key: '0',
      label: '未关联',
    },
    {
      key: '1',
      label: '已关联',
    },
  ];
  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('0');

  const columns: TableProps['columns'] = [
    {
      title: '目的港名称',
      align: 'center',
      width: 200,
      dataIndex: 'fndName',
    },
    {
      dataIndex: 'bookingAccount',
      title: '订舱账号',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'bookingNo',
      title: '订舱号',
      align: 'center',
      width: 120,
    },
    {
      title: 'ETD',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.etd, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '箱型/箱量/票',
      align: 'center',
      width: 150,
      render(value) {
        let ctnTypeArr: CabinResultCtnType[] = [];
        let inventories = JSON.parse(value.inventories ?? {});
        for (let i in inventories) {
          ctnTypeArr.push({
            ctnType: i,
            count: inventories[i],
          });
        }
        return ctnTypeArr.map((item, index) => (
          <div key={index}>
            {item.ctnType} * {item.count}
          </div>
        ));
      },
    },
    {
      title: '船名航次',
      align: 'center',
      width: 180,
      render(value) {
        return (
          <div>
            {value.vesselName} / {value.voyNo}
          </div>
        );
      },
    },
    {
      title: '价格',
      align: 'center',
      width: 200,
      render(value) {
        let price = JSON.parse(value.price ?? {});
        return value.price ? (
          <div>
            Base:{price.bas?.value} / Total:{price.total?.value}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      title: '备注',
      width: 130,
      align: 'center',
      dataIndex: 'remark',
    },
  ];

  useEffect(() => {
    setSelected([]);
    setImmediate(true);
    if (!visible) return;
    else {
      setSearchDefaultForm({
        pageIndex: 1,
        pageSize: 10,
        filter: {
          affiliateId: row?.affiliateId,
          porId: row?.porId,
          orderId: defaultActiveKey === '1' ? row?.orderId : null,
          status: Number(defaultActiveKey),
        },
      });
      setImmediate(false);
    }
  }, [visible]);

  const onChange = (key: string) => {
    setDefaultActiveKey(key);
    setSearchDefaultForm({
      ...searchDefaultForm,
      filter: {
        orderId: key === '1' ? row?.orderId : null,
        status: Number(key),
      },
    });
  };

  const onUpdateSearch = (
    info?: Pick<FastBookingOrderSearchParams, 'filter'> | unknown,
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
    );
    setSearchDefaultForm({
      ...searchDefaultForm,
      filter: {
        ...filteredObj,
        affiliateId: row?.affiliateId,
        porId: row?.porId,
      },
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
    setImmediate(false);
  };

  return (
    <>
      <Drawer
        title="关联拍舱结果"
        width={700}
        open={visible}
        closeIcon={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
        }
        onClose={onCancel}
        className={clsx('drawer-footer', 'text-right')}
        footer={
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              onClick={() => onOk(selected, defaultActiveKey === '0')}
            >
              确定
            </Button>
          </Space>
        }
      >
        <Tabs
          defaultActiveKey={defaultActiveKey}
          items={items}
          onChange={onChange}
        />
        <SearchForm
          columns={RelevanceOrderOptions}
          gutterWidth={24}
          labelPosition="left"
          btnSeparate={false}
          iconHidden={false}
          isShowReset={false}
          isShowExpend={false}
          onUpdateSearch={onUpdateSearch}
        />
        <SearchTable
          size="small"
          columns={columns}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: 418 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          fetchData={getCabinResultByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          immediate={immediate}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelected(options)}
        />
      </Drawer>
    </>
  );
};

export default FastBooingResultDrawer;

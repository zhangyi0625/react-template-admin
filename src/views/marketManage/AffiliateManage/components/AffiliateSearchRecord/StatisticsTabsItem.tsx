import React, { useCallback, useImperativeHandle, useState } from 'react';
import { SearchTable } from 'customer-search-form-table';
import { Button, DatePicker, Radio, Space, type TableProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getStaffSearchStatistic } from '@/services/marketManage/staffManage/staffManageApi';
import type { StaffSearchStatisticParams } from '@/services/marketManage/staffManage/staffManageModel';
import { formatTime } from '@/utils/format';
import { ComboPermission } from '@/enums/setting';
import dayjs, { Dayjs } from 'dayjs';

export type StatisticsTabsItemProps = {
  affiliateId: string;
};

export type StatisticsTabsItemRef = {
  onRefresh: () => void;
};

const StatisticsTabsItem = React.forwardRef<
  StatisticsTabsItemRef,
  StatisticsTabsItemProps
>(({ affiliateId }, ref) => {
  const [searchDefaultForm, setSearchDefaultForm] =
    useState<StaffSearchStatisticParams>({
      affiliateId: affiliateId,
      module: 'REALTIME_RATE',
      createdStart:
        formatTime(new Date().getTime() - 7 * 24 * 60 * 60 * 1000, 'Y-M-D') ??
        '',
      createdEnd: formatTime(new Date() as unknown as string, 'Y-M-D') ?? '',
    });

  const moduleKeysOptions: { label?: string; value: string; link: string }[] = [
    {
      value: 'REALTIME_RATE',
      link: '/dataBoard/cabinQueryRecord',
    },
    {
      value: 'RATE_SUBSCRIBE',
      link: '/marketManage/subscriptionManage',
    },
    {
      value: 'CARGO_TRACE',
      link: '/dataBoard/queryRecord',
    },
    {
      value: 'CARRIER_SCHEDULE',
      link: '/dataBoard/queryRecord',
    },
    {
      value: 'US_CLEARANCE',
      link: '/dataBoard/queryRecord',
    },
    {
      value: 'US_HTS_CODE',
      link: '/dataBoard/queryRecord',
    },
  ];

  const [dateRange, setDateRange] = useState<Dayjs[]>([
    dayjs(formatTime(new Date().getTime() - 7 * 24 * 60 * 60 * 1000, 'Y-M-D')),
    dayjs(formatTime(new Date() as unknown as string, 'Y-M-D')),
  ]);

  const [dateType, setDateType] = useState('WEEK');

  const { RangePicker } = DatePicker;

  const navigate = useNavigate();

  // useEffect(() => {
  //   init();
  // }, []);

  useImperativeHandle(ref, () => ({
    onRefresh: () => init(),
  }));

  const init = () => {
    setSearchDefaultForm({
      affiliateId: affiliateId,
      module: 'REALTIME_RATE',
      createdStart:
        formatTime(new Date().getTime() - 7 * 24 * 60 * 60 * 1000, 'Y-M-D') ??
        '',
      createdEnd: formatTime(new Date() as unknown as string, 'Y-M-D') ?? '',
    });
  };

  const columns: TableProps['columns'] = [
    {
      title: '真实姓名',
      dataIndex: 'customerName',
      width: 100,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      width: 100,
      align: 'center',
    },
    {
      title: '查询总次数',
      dataIndex: 'queryCount',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              color="default"
              variant="outlined"
              size="small"
              style={{
                fontSize: '12px',
                fontWeight: 500,
              }}
              onClick={() => jumpToRecord(_)}
            >
              查看
            </Button>
          </Space>
        );
      },
    },
  ];

  const jumpToRecord = (record: {
    customerName: string;
    customerId: string;
  }) => {
    let url =
      moduleKeysOptions.find((i) => i.value === searchDefaultForm?.module)
        ?.link ?? '';
    navigate(
      `${url}?customerId=${record.customerId}&customerName=${record.customerName}&module=${searchDefaultForm?.module}`,
    );
  };

  const getModuleKeys = useCallback(() => {
    return moduleKeysOptions.map((i) => {
      if (ComboPermission[i.value as keyof typeof ComboPermission])
        return {
          ...i,
          label:
            ComboPermission[i.value as unknown as keyof typeof ComboPermission],
        };
    });
  }, []);

  const radioChange = (e: import('antd').RadioChangeEvent) => {
    setDateType(e.target.value);
    setSearchDefaultForm({
      ...searchDefaultForm,
      createdStart:
        formatTime(
          new Date().getTime() -
            (e.target.value === 'WEEK' ? 7 : 30) * 24 * 60 * 60 * 1000,
          'Y-M-D',
        ) ?? '',
      createdEnd: formatTime(new Date() as unknown as string, 'Y-M-D') ?? '',
    } as StaffSearchStatisticParams);
    setDateRange([
      dayjs(
        formatTime(
          new Date().getTime() -
            (dateType === 'WEEK' ? 7 : 30) * 24 * 60 * 60 * 1000,
          'Y-M-D',
        ),
      ),
      dayjs(formatTime(new Date() as unknown as string, 'Y-M-D')),
    ]);
  };

  const dateChange = (value: Dayjs[]) => {
    setDateRange(value);
    setSearchDefaultForm({
      ...searchDefaultForm,
      createdStart: formatTime(value[0] as unknown as string, 'Y-M-D'),
      createdEnd: formatTime(value[1] as unknown as string, 'Y-M-D'),
    } as StaffSearchStatisticParams);
  };
  return (
    <>
      <Radio.Group
        onChange={(e) =>
          setSearchDefaultForm({
            ...searchDefaultForm,
            module: e.target.value,
          } as StaffSearchStatisticParams)
        }
        optionType="button"
        buttonStyle="solid"
        defaultValue="REALTIME_RATE"
        value={searchDefaultForm?.module}
      >
        {getModuleKeys().map((item) => (
          <Radio.Button key={item?.value} value={item?.value}>
            {item?.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <Space style={{ marginTop: '20px' }}>
        <Radio.Group
          onChange={radioChange}
          optionType="button"
          buttonStyle="solid"
          defaultValue={dateType}
          value={dateType}
        >
          <Radio.Button value="WEEK">近7日</Radio.Button>
          <Radio.Button value="MONTH">近30日</Radio.Button>
        </Radio.Group>
        <RangePicker
          value={dateRange as [Dayjs, Dayjs]}
          onChange={(dates) => dates && dateChange(dates as Dayjs[])}
          style={{ width: '100%' }}
          format={'YY-MM-DD HH:mm:ss'}
        />
      </Space>
      <SearchTable
        size="small"
        columns={columns}
        style={{ marginTop: '8px' }}
        pageIndexKey="pageIndex"
        pageSizeKey="pageSize"
        scroll={{ x: 'max-content', y: 378 }}
        rowKey="customerId"
        totalKey="total"
        fetchResultKey="data"
        isPagination={false}
        fetchData={getStaffSearchStatistic}
        searchFilter={searchDefaultForm}
        isSelection={false}
        onUpdatePagination={() => {}}
      />
    </>
  );
});

export default StatisticsTabsItem;

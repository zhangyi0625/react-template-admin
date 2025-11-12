import React, { useEffect, useImperativeHandle, useState } from 'react';
import { SearchTable } from 'customer-search-form-table';
import { Button, Radio, Space, type TableProps } from 'antd';
import { getStaffSearchStatistic } from '@/services/marketManage/staffManage/staffManageApi';

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
  const [searchDefaultForm, setSearchDefaultForm] = useState<{
    affiliateId: string;
    type: 'WEEK' | 'MONTH';
  }>();

  useEffect(() => {
    init();
  }, []);

  useImperativeHandle(ref, () => ({
    onRefresh: () => init(),
  }));

  const init = () => {
    setSearchDefaultForm({
      affiliateId: affiliateId,
      type: 'WEEK',
    });
  };

  const columns: TableProps['columns'] = [
    {
      title: '真实姓名',
      dataIndex: 'name',
      width: 100,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 100,
      align: 'center',
    },
    {
      title: '查询总次数',
      dataIndex: 'number',
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
            >
              查看
            </Button>
          </Space>
        );
      },
    },
  ];

  const radioChange = (e: import('antd').RadioChangeEvent) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      type: e.target.value,
    } as {
      affiliateId: string;
      type: 'WEEK' | 'MONTH';
    });
  };
  return (
    <>
      <Radio.Group
        onChange={radioChange}
        optionType="button"
        buttonStyle="solid"
        defaultValue="WEEK"
        value={searchDefaultForm?.type}
      >
        <Radio.Button value="WEEK">7天</Radio.Button>
        <Radio.Button value="MONTH">30天</Radio.Button>
      </Radio.Group>
      <SearchTable
        size="small"
        columns={columns}
        style={{ marginTop: '8px' }}
        pageIndexKey="pageIndex"
        pageSizeKey="pageSize"
        scroll={{ x: 'max-content', y: 378 }}
        rowKey="customerId"
        // immediate={tableLoading}
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

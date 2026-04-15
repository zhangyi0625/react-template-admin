import { useState } from 'react';
import {
  Card,
  ConfigProvider,
  type TableProps,
  type TablePaginationConfig,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { LevelManageSearchColumns, LevelOptions } from './config';
import { getLevelManageByPage } from '@/services/marketManage/levelManage/levelManageApi';
import type { LevelManageParams } from '@/services/marketManage/levelManage/levelManageModel';
import { randomNum } from '@/utils/tool';
import useParentSize from '@/hooks/useParentSize';
import { formatTime } from '@/utils/format';
import { updateSearchFilter } from '@/utils/filter';

const LevelManage: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<LevelManageParams>(
    {
      pageIndex: 1,
      pageSize: 10,
    },
  );

  const columns: TableProps['columns'] = [
    {
      title: '客户名称',
      dataIndex: 'affiliateName',
      width: 120,
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'customerName',
      width: 120,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      width: 120,
      align: 'center',
    },
    {
      title: '等级类型',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <div>
            {
              LevelOptions?.find(
                (item) => item.value === String(value.gradeLevel),
              )?.label
            }
          </div>
        );
      },
    },
    {
      title: '等级有效期',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.validTo, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 100,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      width: 180,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 220,
      align: 'center',
    },
  ];

  const onUpdateSearch = (info?: LevelManageParams | unknown) => {
    updateSearchFilter(
      searchDefaultForm,
      setSearchDefaultForm,
      ['pageIndex', 'pageSize'],
      info,
    );
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={LevelManageSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 17 },
                sm: { span: 7 },
              },
              wrapperCol: {
                xs: { span: 4 },
                sm: { span: 20 },
              },
            }}
            iconHidden={true}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <SearchTable
          size="small"
          columns={columns}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 128 }}
          rowKey={(_) => randomNum().toString()}
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getLevelManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default LevelManage;

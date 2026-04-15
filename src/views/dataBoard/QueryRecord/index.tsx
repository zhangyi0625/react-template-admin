import { useEffect, useState } from 'react';
import {
  Card,
  ConfigProvider,
  Tabs,
  type TabsProps,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { QueryRecordSearchColumns } from '../config';
import { ComboPermission } from '@/enums/setting';
import { useSearchParams } from 'react-router-dom';
import useParentSize from '@/hooks/useParentSize';
import { getQueryRecordListByPage } from '@/services/dataBoard/queryRecord/queryRecordApt';
import type {
  QueryRecordSearchFilterParams,
  QueryRecordSearchParams,
} from '@/services/dataBoard/queryRecord/queryRecordModel';
import { safeJsonParse } from '@/utils/tool';
import { updateSearchFilter } from '@/utils/filter';

const QueryRecord: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchParams] = useSearchParams();

  const [immediate, setImmediate] = useState<boolean>(true);

  const [formMaps, setFormMaps] = useState(QueryRecordSearchColumns);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<QueryRecordSearchParams>({
      pageIndex: 1,
      pageSize: 20,
      filter: {
        module: 'CARGO_TRACE',
      },
    });

  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('CARGO_TRACE');

  useEffect(() => {
    setTableLoading(true);
    formMaps.map((item) => {
      if (item.name === 'customerId' && item.apiByUrlParams) {
        item.defaultValue = searchParams.get('customerName');
        Reflect.set(
          item.apiByUrlParams,
          'keyword',
          searchParams.get('customerName'),
        );
        setDefaultActiveKey(searchParams.get('module') as string);
        setSearchDefaultForm({
          ...searchDefaultForm,
          filter: {
            ...searchDefaultForm.filter,
            customerId: searchParams.get('customerId') as string,
          } as QueryRecordSearchFilterParams,
        });
      }
    });
    setFormMaps([...formMaps]);
    setTimeout(() => {
      setTableLoading(false);
      setImmediate(false);
    }, 500);
  }, [searchParams]);

  const getTableColumnsByModule = () => {
    const tableColumns: TableProps['columns'] = [
      {
        title: '口岸',
        align: 'center',
        hidden: defaultActiveKey !== 'CARGO_TRACE',
        render(value) {
          return <div>{safeJsonParse(value?.queryParam)?.place}</div>;
        },
      },
      {
        title: '提单号/箱号',
        align: 'center',
        hidden: defaultActiveKey !== 'CARGO_TRACE',
        width: 120,
        render(value) {
          return <div>{safeJsonParse(value?.queryParam)?.number}</div>;
        },
      },
      {
        title: '船名',
        align: 'center',
        hidden: defaultActiveKey !== 'CARRIER_SCHEDULE',
        render(value) {
          return <div>{safeJsonParse(value?.queryParam)?.vessel}</div>;
        },
      },
      {
        title: '航次',
        align: 'center',
        hidden: defaultActiveKey !== 'CARRIER_SCHEDULE',
        render(value) {
          return <div>{safeJsonParse(value?.queryParam)?.voyage}</div>;
        },
      },
      {
        title: 'MBL号',
        align: 'center',
        hidden: defaultActiveKey !== 'US_CLEARANCE',
        render(value) {
          return <div>{safeJsonParse(value?.queryParam)?.mbl}</div>;
        },
      },
    ];
    return tableColumns as TableProps['columns'];
  };

  const columns: TableProps['columns'] = [
    {
      title: '客户名称',
      dataIndex: 'affiliateName',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'customerName',
      align: 'center',
    },
    ...(getTableColumnsByModule() ?? []),
    {
      title: '消费类型',
      align: 'center',
      render(value) {
        return (
          <div>
            {value.limitType === 'DAY' ? '按套餐内扣除' : '按套餐外扣除'}
          </div>
        );
      },
    },
    {
      title: '操作时间',
      dataIndex: 'created',
      align: 'center',
    },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: 'CARGO_TRACE',
      label: ComboPermission.CARGO_TRACE,
    },
    {
      key: 'CARRIER_SCHEDULE',
      label: ComboPermission.CARRIER_SCHEDULE,
    },
    {
      key: 'US_CLEARANCE',
      label: ComboPermission.US_CLEARANCE,
    },
    {
      key: 'HSCODE_QUERY',
      label: ComboPermission.HSCODE_QUERY,
    },
  ];

  const onUpdateSearch = (info?: QueryRecordSearchFilterParams | unknown) => {
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

  const tabChange = (key: string) => {
    setTableLoading(true);
    setDefaultActiveKey(key);
    setSearchDefaultForm({
      ...searchDefaultForm,
      filter: {
        ...searchDefaultForm.filter,
        module: key,
      } as QueryRecordSearchFilterParams,
    });
    setTableLoading(false);
  };
  return (
    <>
      <ConfigProvider>
        {!immediate && (
          <Card>
            <Tabs
              defaultActiveKey={defaultActiveKey}
              items={tabItems}
              onChange={tabChange}
            />
            <SearchForm
              columns={formMaps}
              gutterWidth={24}
              labelPosition="left"
              btnSeparate={false}
              iconHidden={false}
              isShowReset={true}
              isShowExpend={false}
              onUpdateSearch={onUpdateSearch}
            />
          </Card>
        )}
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
          scroll={{ x: 'max-content', y: height - 118 }}
          rowKey={'id'}
          immediate={immediate}
          loading={tableLoading}
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getQueryRecordListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default QueryRecord;

import { useEffect, useState } from 'react';
import {
  Card,
  ConfigProvider,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { CabinQueryRecordSearchColumns } from '../config';
import useParentSize from '@/hooks/useParentSize';
import { getCabinQueryRecordListByPage } from '@/services/dataBoard/cabinQueryRecord/cabinQueryRecordApi';
import type {
  CabinQueryRecordSearchFilterParams,
  CabinQueryRecordSearchParams,
} from '@/services/dataBoard/cabinQueryRecord/cabinQueryRecordModel';
import { getSystemAreaOptions } from '@/services/system/basicData/basicDataApi';
import type { SystemAreaOptionsType } from '@/services/system/basicData/basicDataModel';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const CabinQueryRecord: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<CabinQueryRecordSearchParams>({
      pageIndex: 1,
      pageSize: 20,
      filter: undefined,
    });

  const [areaOptions, setAreaOptions] = useState<SystemAreaOptionsType[]>([]);

  const columns: TableProps['columns'] = [
    {
      title: '用户名',
      dataIndex: 'customerName',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      align: 'center',
      width: 150,
    },
    {
      title: '航线',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div>
            {areaOptions.find((item) => item.code === value.route)?.name}
          </div>
        );
      },
    },
    {
      title: '起运港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value?.por?.localName ?? '-'}</p>
            <p>{value?.por?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '目的港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value?.fnd?.localName ?? '-'}</p>
            <p>{value?.fnd?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '开航起止日期',
      align: 'center',
      width: 150,
      render(value) {
        return value?.etdStart || value?.etdEnd ? (
          <div>
            {formatTime(value?.etdStart, 'M-D')} 至
            {formatTime(value?.etdEnd, 'M-D')}
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      title: '命中率',
      dataIndex: 'found',
      align: 'center',
      width: 100,
    },
    {
      title: '运价类型',
      dataIndex: 'searchTypeNote',
      align: 'center',
      width: 120,
    },
    {
      title: '消费类型',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value?.isBase ? '按套餐内扣除' : '按套餐外扣除'}</div>;
      },
    },
    {
      title: '查询时间',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{formatTime(value.created, 'Y/M/D h:m:s')}</div>;
      },
    },
  ];

  useEffect(() => {
    loadAreaOptions();
  }, []);

  const loadAreaOptions = async () => {
    try {
      const resp = await getSystemAreaOptions({ parentId: 0 });
      setAreaOptions(resp);
    } catch {
      setAreaOptions([]);
    }
  };

  const onUpdateSearch = (
    info?: CabinQueryRecordSearchFilterParams | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined
      )
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize'],
      true
    );
    setSearchDefaultForm({
      ...pageInfo,
      filter: { ...filteredObj },
    });
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
            columns={CabinQueryRecordSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            iconHidden={false}
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
          scroll={{ x: 'max-content', y: height - 118 }}
          rowKey={'id'}
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getCabinQueryRecordListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default CabinQueryRecord;

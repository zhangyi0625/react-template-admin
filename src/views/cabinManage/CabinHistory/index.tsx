import { useEffect, useState } from 'react';
import { Card, ConfigProvider, TablePaginationConfig, TableProps } from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { SelectCabinHistoryOptions } from './config';
import type { CabinHistoryParams } from '@/services/cabinManage/cabinManageModel';
import { getCabinHistoryList } from '@/services/cabinManage/cabinManageApi';
import { formatTime } from '@/utils/format';
import { filterKeys } from '@/utils/tool';
import useParentSize from '@/hooks/useParentSize';
import useCacheData from '@/hooks/useCacheData';
import type { PortManageType } from '@/services/essential/portManage/portManageApi';

const cacheEssentialKeys = ['routeData', 'porPortData', 'fndPortData'];

const CabinHistory: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchColumns, setSearchColumns] = useState(SelectCabinHistoryOptions);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<CabinHistoryParams>({
      page: 1,
      limit: 10,
      router: null,
    });

  const [immediate, setImmediate] = useState<boolean>(false);

  const { essential, formMaps } = useCacheData({
    cacheEssentialKeys: cacheEssentialKeys,
    formMap: searchColumns,
  });

  useEffect(() => {
    setImmediate(true);
    init();
  }, [essential]);

  const init = () => {
    let { porPortData = [], fndPortData = [] } = essential;
    let por = porPortData.map((item: PortManageType) => {
      return {
        value: item.code,
        label: item.enName + '-' + item.cnName,
      };
    });
    let fnd = fndPortData.map((item: PortManageType) => {
      return {
        value: item.code,
        label: item.enName + '-' + item.cnName,
      };
    });
    formMaps.map((item) => {
      if (item.name === 'porCode' || item.name === 'fndCode')
        item.options = item.name === 'porCode' ? por : fnd;
    });
    setSearchColumns([...formMaps]);
    setImmediate(false);
  };

  const columns: TableProps['columns'] = [
    {
      title: '船公司',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'center',
    },
    {
      title: '起运港',
      key: 'porCode',
      align: 'center',
      render(value) {
        return <div>{value.porCode}</div>;
      },
    },
    {
      title: '目的港',
      key: 'fndCode',
      align: 'center',
      render(value) {
        return <div>{value.fndCode}</div>;
      },
    },
    {
      title: '船司航线',
      key: 'carrierRouter',
      align: 'center',
      render(value) {
        return <div>{value.carrierRouter}</div>;
      },
    },
    {
      title: '细分航线',
      key: 'router',
      align: 'center',
      render(value) {
        return <div>{value.router}</div>;
      },
    },
    {
      title: 'ETD',
      key: 'etd',
      align: 'center',
      render(value) {
        return <div>{formatTime(value.etd, 'Y-M-D')}</div>;
      },
    },
    {
      title: '放舱时间',
      key: 'stowageTime',
      align: 'center',
      render(value) {
        return (
          <div>
            {value.stowageTime} {value.stowageWeek}
          </div>
        );
      },
    },
  ];

  const onUpdateSearch = (info?: CabinHistoryParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    );
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true);
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={SelectCabinHistoryOptions}
            gutterWidth={24}
            iconHidden={true}
            labelPosition="left"
            btnSeparate={true}
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
          size="middle"
          totalKey="count"
          fetchResultKey="list"
          isPagination={true}
          columns={columns}
          pageIndexKey="page"
          pageSizeKey="limit"
          bordered
          rowKey="id"
          scroll={{ x: 'max-content', y: height - 158 }}
          immediate={immediate}
          fetchData={getCabinHistoryList}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default CabinHistory;

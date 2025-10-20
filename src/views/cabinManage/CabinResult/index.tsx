import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import type { CabinResultParams } from '@/services/cabinManage/cabinManageModel';
import { getCabinResultList } from '@/services/cabinManage/cabinManageApi';
import { formatTime } from '@/utils/format';
import { filterKeys } from '@/utils/tool';
import { SelectCabinResultOptions } from './config';
import { ExportOutlined } from '@ant-design/icons';
import useParentSize from '@/hooks/useParentSize';
import useCacheData from '@/hooks/useCacheData';
import type { PortManageType } from '@/services/essential/portManage/portManageApi';

const cacheEssentialKeys = [
  'customerData',
  'porPortData',
  'fndPortData',
  'carrierData',
];

const CabinResult: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchColumns, setSearchColumns] = useState(SelectCabinResultOptions);

  const [searchDefaultForm, setSearchDefaultForm] = useState<CabinResultParams>(
    {
      page: 1,
      limit: 10,
    }
  );

  const { essential, formMaps } = useCacheData({
    cacheEssentialKeys: cacheEssentialKeys,
    formMap: searchColumns,
    promiseFilter: {
      carrierData: {
        enabled: 1,
      },
    },
  });

  const [immediate, setImmediate] = useState<boolean>(true);

  useEffect(() => {
    setImmediate(true);
    init();
  }, [essential]);

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
      key: 'carrierRoute',
      align: 'center',
      render(value) {
        return <div>{value.carrierRoute}</div>;
      },
    },
    {
      title: '细分航线',
      key: 'routeName',
      align: 'center',
      render(value) {
        return <div>{value.routeName}</div>;
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
      key: 'cabinTime',
      align: 'center',
      render(value) {
        return <div>{value.cabinTime}</div>;
      },
    },
  ];

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

  const onUpdateSearch = (info?: CabinResultParams | unknown) => {
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

  const exportResult = () => {};
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={searchColumns}
            gutterWidth={24}
            labelPosition="left"
            iconHidden={true}
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
        <Space className="mb-[8px]">
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={exportResult}
          >
            导出订舱结果
          </Button>
        </Space>
        <SearchTable
          size="large"
          columns={columns}
          bordered
          rowKey="id"
          totalKey="count"
          pageIndexKey="page"
          pageSizeKey="limit"
          fetchResultKey="list"
          isPagination={true}
          immediate={immediate}
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getCabinResultList}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default CabinResult;

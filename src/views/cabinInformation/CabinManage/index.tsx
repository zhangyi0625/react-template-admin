import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CabinManageSearchColumns } from './config';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import type {
  CabinManageSearchFilterParams,
  CabinManageSearchParams,
} from '@/services/cabinInformation/cabinManage/cabinManageModel';
import { useNavigate } from 'react-router-dom';
import {
  getCabinManageListByPage,
  deleteCabinManage,
} from '@/services/cabinInformation/cabinManage/cabinManageApi';
import useParentSize from '@/hooks/useParentSize';
import useCacheData from '@/hooks/useCacheData';
import { filterKeys } from '@/utils/tool';
import { ExportTableDataByXLSX } from '@/utils/export';
import { formatTime } from '@/utils/format';

const CabinManage: React.FC = () => {
  const { message } = App.useApp();

  const navigate = useNavigate();

  const { parentRef, height } = useParentSize();

  const [formMaps, setFormMaps] = useState(CabinManageSearchColumns);

  const [downLoading, setDownLoading] = useState<boolean>(false);

  const [selected, setSelected] = useState<string[]>([]);

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData', 'routeData'],
  });

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<CabinManageSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
      sort: {
        id: '-1',
      },
    });

  useEffect(() => {
    formMaps.map((item) => {
      if (item.name === 'route') item.options = essential['routeData'];
    });
    setFormMaps([...formMaps]);
  }, [essential]);

  const columns: TableProps['columns'] = [
    {
      title: '公司名称',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            {value?.productType === 'CARRIER' ? `${value.carrierCode}直营` : ''}
          </div>
        );
      },
    },
    {
      title: '操作用户',
      key: 'cabinName',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            {value?.productType === 'CUSTOMER' ? value.customerName : '-'}
          </div>
        );
      },
    },
    {
      title: '船公司',
      dataIndex: 'carrierCode',
      key: 'carrierCode',
      width: 100,
      align: 'center',
    },
    {
      title: '起运港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value.por?.localName ?? '-'}</p>
            <p>{value.por?.name ?? '-'}</p>
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
            <p>{value.fnd?.localName ?? '-'}</p>
            <p>{value.fnd?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '航线',
      key: 'createTime',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{formatTime(value.createTime, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: 'ETD',
      key: 'etd',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{formatTime(value.etd, 'Y-M-D')}</div>;
      },
    },
    {
      title: 'ETA',
      key: 'eta',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{formatTime(value.eta, 'Y-M-D')}</div>;
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
      title: '有效起始时间',
      key: 'validFrom',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{formatTime(value.validFrom, 'Y-M-D')}</div>;
      },
    },
    {
      title: '有效截止',
      key: 'validTo',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{formatTime(value.validTo, 'Y-M-D')}</div>;
      },
    },
    {
      title: '上传时间',
      key: 'createTime',
      align: 'center',
      width: 200,
      render(value) {
        return <div>{formatTime(value.createTime, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '附加信息',
      key: 'remark',
      align: 'center',
      width: 150,
      dataIndex: 'remark',
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
              type="default"
              variant="outlined"
              onClick={() => navigate(`/cabinInformation/cabinManage/${_.id}`)}
            >
              查看
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (info?: CabinManageSearchFilterParams | unknown) => {
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

  const downloadData = async () => {
    setDownLoading(true);
    try {
      const resp = await getCabinManageListByPage({
        ...searchDefaultForm,
        pageIndex: 1,
        pageSize: 9999,
      });
      ExportTableDataByXLSX(
        resp.entries,
        columns.splice(0, columns.length - 1),
        '舱位管理导出列表'
      );
      setDownLoading(false);
    } catch {
      message.error('导出列表异常，请联系相关人员～');
      setDownLoading(false);
    }
  };

  const bactchDeleteCabinmanage = async () => {
    if (!selected.length) {
      message.error('请选择要批量下线的舱位');
      return;
    }
    try {
      await deleteCabinManage(selected);
      message.success('批量下线成功');
      setSelected([]);
    } catch {
      // message.error('批量下线异常，请联系相关人员～');
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={formMaps}
            gutterWidth={24}
            labelPosition="left"
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 17 },
                sm: { span: 7 },
              },
              wrapperCol: {
                xs: { span: 2 },
                sm: { span: 22 },
              },
            }}
            btnSeparate={false}
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
        <Space size={8}>
          <Button color="red" variant="solid" onClick={bactchDeleteCabinmanage}>
            批量下线
          </Button>
          <Button
            color="blue"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={downloadData}
            loading={downLoading}
          >
            导出列表
          </Button>
        </Space>
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '10px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getCabinManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(ids: string[]) => setSelected(ids)}
        />
      </Card>
    </>
  );
};

export default CabinManage;

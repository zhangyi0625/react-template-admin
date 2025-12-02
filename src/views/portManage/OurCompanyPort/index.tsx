import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TablePaginationConfig,
  type TableProps,
  Tag,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import type {
  OurCompanyPortSearchFilterParams,
  OurCompanyPortSearchParams,
  OurCompanyPortType,
} from '@/services/portManage/ourCompanyPort/ourCompanyPortModel';
import { OurCompanyPortSearchColumns, PortTagsOptions } from '../config';
import {
  addOurCompanyPort,
  putOurCompanyPort,
  deleteOurCompanyPort,
  getOurCompanyPortListByPage,
} from '@/services/portManage/ourCompanyPort/ourCompanyPortApi';
import AddOurCompanyPort from './AddOurCompanyPort';
import useParentSize from '@/hooks/useParentSize';
import { filterKeys } from '@/utils/tool';
import useCacheData from '@/hooks/useCacheData';

const OurCompanyPort: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const { essential } = useCacheData({
    cacheEssentialKeys: ['routeData', 'countryData'],
    formMap: OurCompanyPortSearchColumns,
  });

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<OurCompanyPortSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: OurCompanyPortType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  useEffect(() => {}, [essential]);

  const columns: TableProps['columns'] = [
    {
      title: '五字码[国际/国内]',
      dataIndex: 'localCode',
      width: 200,
      align: 'center',
    },
    {
      title: '名称',
      width: 200,
      align: 'center',
      render(value) {
        return (
          <div>
            {value.localName} - {value.name}
          </div>
        );
      },
    },
    {
      title: '航线',
      dataIndex: 'parentAreaName',
      width: 100,
      align: 'center',
    },
    {
      title: '航线细分',
      dataIndex: 'areaName',
      width: 150,
      align: 'center',
    },
    {
      title: '所属国家',
      dataIndex: 'countryLocalName',
      width: 150,
      align: 'center',
    },
    {
      title: '热门港口',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{value.popularity ? '热门' : ''}</div>;
      },
    },
    {
      title: '标签',
      width: 250,
      align: 'center',
      render(value) {
        let tagMaps = value.tags?.split(',') || [];
        return (
          <Space>
            {(PortTagsOptions || []).map((item) => (
              <Tag
                key={item.value}
                hidden={!tagMaps.includes(item.value)}
                color="blue"
              >
                {item.label}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 180,
      render(_) {
        return (
          <Space>
            <Button
              size="middle"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              编辑
            </Button>
            <Button
              size="middle"
              variant="solid"
              color="danger"
              onClick={() => deletePort(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const onUpdateSearch = (
    info?: OurCompanyPortSearchFilterParams | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined
      )
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize', 'sort'],
      true
    );
    setSearchDefaultForm({
      ...pageInfo,
      filter: { ...filteredObj },
    });
  };

  const deletePort = (id: string) => {
    modal.confirm({
      title: '删除我司港口',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该我司港口吗？数据删除后将无法恢复！',
      onOk() {
        deleteOurCompanyPort(id).then(() => {
          message.success('删除成功～');
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onEditOk = async (editRow: OurCompanyPortType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addOurCompanyPort(editRow);
      } else {
        // 编辑数据
        await putOurCompanyPort(editRow);
      }
      message.success(!editRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, currentRow: null });
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={OurCompanyPortSearchColumns}
            gutterWidth={24}
            labelPosition="left"
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
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增我司港口
          </Button>
        </Space>
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getOurCompanyPortListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddOurCompanyPort
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default OurCompanyPort;

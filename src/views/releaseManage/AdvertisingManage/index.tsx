import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { AdvertisingManageSearchColumns } from './config';
import {
  createAdvertisingManage,
  deleteAdvertisingManage,
  getAdvertisingManageListByPage,
  updateAdvertisingManage,
} from '@/services/releaseManage/advertisingManage/advertisingManageApi';
import AdvertisingModal from './AdvertisingModal';
import useParentSize from '@/hooks/useParentSize';
import type {
  AdvertisingManageSearchParams,
  AdvertisingManageType,
} from '@/services/releaseManage/advertisingManage/advertisingManageModel';
import { filterKeys } from '@/utils/tool';

const AdvertisingManage: React.FC = () => {
  const { modal, message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<AdvertisingManageSearchParams>({
      page: 1,
      limit: 10,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: AdvertisingManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '广告标题',
      dataIndex: 'title',
      align: 'center',
      width: 120,
    },
    {
      title: '广告起效时间',
      dataIndex: 'startDate',
      align: 'center',
      width: 150,
    },
    {
      title: '广告失效时间',
      dataIndex: 'endDate',
      align: 'center',
      width: 150,
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      align: 'center',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      width: 180,
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setParams({ visible: true, currentRow: _ });
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteBatch(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除广告',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该广告吗？数据删除后将无法恢复！',
      onOk() {
        deleteAdvertisingManage(id).then(() => {
          message.success('删除成功～');
          // 刷新表格数据
          onUpdateSearch();
        });
      },
    });
  };

  const onEditOk = async (routeRow: AdvertisingManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await createAdvertisingManage(routeRow);
      } else {
        // 编辑数据
        await updateAdvertisingManage(routeRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!params.currentRow ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      onUpdateSearch();
    } catch (error) {}
  };

  const onUpdateSearch = (info?: AdvertisingManageSearchParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
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
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={AdvertisingManageSearchColumns}
            gutterWidth={24}
            iconHidden={true}
            labelPosition="left"
            btnSeparate={false}
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
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          rowKey="id"
          isPagination={true}
          fetchResultKey="list"
          totalKey="count"
          pageIndexKey="page"
          pageSizeKey="limit"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getAdvertisingManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AdvertisingModal
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default AdvertisingManage;

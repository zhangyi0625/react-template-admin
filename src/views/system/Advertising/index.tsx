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
import { ExclamationCircleFilled } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { AdvertisingManageSearchColumns } from './config';
import useParentSize from '@/hooks/useParentSize';
import {
  addAdvertisingManage,
  deleteAdvertisingManage,
  deleteBatchAdvertisingManage,
  editAdvertisingManage,
  getAdvertisingManageByPage,
} from '@/services/system/advertising/advertisingApi';
import type {
  AdvertisingManageSearchParams,
  AdvertisingManageType,
} from '@/services/system/advertising/advertisingModel';
import AdvertisingModal from './AdvertisingModal';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const AdvertisingManage: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<AdvertisingManageSearchParams>({
      page: 1,
      limit: 10,
      filter: {
        status: true,
      },
      sort: 'update_time',
      order: 'desc',
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: AdvertisingManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const tableColumns: TableProps['columns'] = [
    {
      title: '广告标题',
      dataIndex: 'title',
      width: 120,
      align: 'left',
    },
    {
      title: '起效日期',
      width: 120,
      align: 'left',
      render(value) {
        return <div>{formatTime(value.startDate, 'Y-M-D')}</div>;
      },
    },
    {
      title: '失效日期',
      width: 120,
      align: 'left',
      render(value) {
        return <div>{formatTime(value.endDate, 'Y-M-D')}</div>;
      },
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      width: 120,
      align: 'left',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 120,
      align: 'left',
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render(_) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              编辑
            </Button>
            <Button
              variant="link"
              onClick={() => deleteItem(_.id)}
              color="danger"
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (
    info?: AdvertisingManageSearchParams['filter'] | unknown,
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'sort', 'order'],
      true,
    );
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

  const onEditOk = async (currentRow: AdvertisingManageType) => {
    try {
      if (!params.currentRow) {
        // 新增数据
        await addAdvertisingManage(currentRow);
      } else {
        // 编辑数据
        await editAdvertisingManage(currentRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      // message.success(!currentRow.id ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      onUpdateSearch();
    } catch (error) {}
  };

  const deleteItem = async (id: string | string[], type?: string) => {
    modal.confirm({
      title: `${type ? '批量' : ''}删除广告`,
      icon: <ExclamationCircleFilled />,
      content: `确定${type ? '批量' : ''}删除广告吗？数据删除后将无法恢复！`,
      onOk() {
        // 调用删除接口，删除成功后刷新页面数据
        (type
          ? deleteBatchAdvertisingManage({ ids: id as string[] })
          : deleteAdvertisingManage(id as string)
        ).then(() => {
          message.success(`${type ? '批量' : ''}删除成功`);
          onUpdateSearch();
        });
      },
    });
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={AdvertisingManageSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            iconHidden={false}
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
        <Space>
          <Button
            type="primary"
            onClick={() => setParams({ ...params, visible: true })}
          >
            新增
          </Button>
        </Space>
        <SearchTable
          style={{ marginTop: '10px' }}
          size="middle"
          pageIndexKey="page"
          pageSizeKey="limit"
          totalKey={'count'}
          fetchResultKey={'list'}
          isPagination={true}
          columns={tableColumns}
          rowKey={'id'}
          scroll={{ x: 'max-content', y: height - 298 }}
          fetchData={getAdvertisingManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      <AdvertisingModal
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ ...params, visible: false })}
      />
    </>
  );
};

export default AdvertisingManage;

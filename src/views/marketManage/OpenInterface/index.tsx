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
import useParentSize from '@/hooks/useParentSize';
import type {
  OpenInterfaceParams,
  OpenInterfaceType,
} from '@/services/marketManage/openInterface/openInterfaceModel';
import { OpenInterfaceSearchColumns } from './config';
import {
  addOpenInterface,
  getOpenInterfaceManageByPage,
} from '@/services/marketManage/openInterface/openInterfaceApi';
import { deleteSubscription } from '@/services/marketManage/subscriptionManage/subscriptionManageApi';
import AddOpenInterfaceModal from './AddOpenInterfaceModal';
import { useNavigate } from 'react-router-dom';
import { filterKeys } from '@/utils/tool';

const OpenInterface: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const navigate = useNavigate();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<OpenInterfaceParams>({
      pageIndex: 1,
      pageSize: 10,
    });

  const [visible, setVisible] = useState<boolean>(false);

  const columns: TableProps['columns'] = [
    {
      title: '接入名称',
      dataIndex: 'name',
      width: 120,
      align: 'center',
    },
    {
      title: '客户名称',
      dataIndex: 'affiliateName',
      width: 150,
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'customerName',
      width: 120,
      align: 'center',
    },
    {
      title: 'API Key',
      dataIndex: 'key',
      width: 220,
      align: 'center',
    },
    {
      title: '是否有效',
      width: 100,
      align: 'center',
      render(value) {
        return <div>{value.valid ? '有效' : '无效'}</div>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      width: 180,
      align: 'center',
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              type="default"
              variant="outlined"
              onClick={() => navigate(`/marketManage/openInterface/${_.id}`)}
              className="ml-[10px]"
            >
              查看
            </Button>
            <Button
              color="danger"
              variant="solid"
              onClick={() => delOpenInterface(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const delOpenInterface = (id: string) => {
    modal.confirm({
      title: '删除开放接口',
      icon: <ExclamationCircleFilled />,
      content: '确定删除这条开放接口吗？数据删除后将无法恢复！',
      onOk() {
        deleteSubscription(id).then(() => {
          // 刷新表格数据
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onUpdateSearch = (info?: OpenInterfaceParams | unknown) => {
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

  const onEdit = async (info: OpenInterfaceType) => {
    try {
      await addOpenInterface(info);
      message.success('新增接口成功～');
      setVisible(false);
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch {
      setVisible(false);
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={OpenInterfaceSearchColumns}
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
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setVisible(true)}
          >
            新增接口
          </Button>
        </Space>
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '10px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 128 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getOpenInterfaceManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddOpenInterfaceModal
        visible={visible}
        currentRow={null}
        onCancel={() => setVisible(false)}
        onOk={onEdit}
      />
    </>
  );
};

export default OpenInterface;

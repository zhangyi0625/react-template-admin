import { useState } from 'react';
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  Switch,
  type TableProps,
  type TablePaginationConfig,
  App,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import modal from 'antd/es/modal';
import { SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import {
  deletePacketList,
  editPacketList,
  getPacketListByPage,
  getPacketRecord,
  getPacketRecordDetail,
  updatePacketStatus,
} from '@/services/otherSetting/packetManage/packetManageApi';
import type {
  PacketManageParams,
  PacketManageType,
} from '@/services/otherSetting/packetManage/packetManageModel';
// import PacketAwardDetail from './PacketAwardDetail';
import AddPacketManage from './AddPacketManage';
import { formatTime } from '@/utils/format';
import { ExportTableDataByXLSX } from '@/views/customerInformation/ShippingAccount/export';
import { PacketRecordColumms } from './config';

const PacketManage: React.FC = () => {
  const { message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [params, setParams] = useState<{
    visible: boolean;
    editRow: PacketManageType | null;
  }>({
    visible: false,
    editRow: null,
  });

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<PacketManageParams>({
      pageIndex: 1,
      pageSize: 10,
    });

  const columns: TableProps['columns'] = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      width: 150,
      align: 'center',
      hidden: true,
    },
    {
      title: '活动起止日期',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            {formatTime(value.startDate, 'Y-M-D') +
              ' 至 ' +
              formatTime(value.endDate, 'Y-M-D')}
          </div>
        );
      },
    },
    {
      title: '发放人群',
      key: 'type',
      align: 'center',
      width: 120,
      render(value) {
        return <div>{value.type === 'SUBSCRIBE' ? '新注册用户' : ''}</div>;
      },
    },
    {
      title: '状态',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <Switch
            value={Boolean(value.status)}
            checkedChildren="已开启"
            unCheckedChildren="已关闭"
            onChange={(e) => switchChange(e, value)}
          />
        );
      },
    },
    {
      title: '活动描述',
      dataIndex: 'desc',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={10}>
            <Button
              color="orange"
              variant="solid"
              onClick={() => openPacketDetail(_.id)}
            >
              奖励详情
            </Button>
            <Button
              type="primary"
              variant="solid"
              onClick={() => setParams({ visible: true, editRow: _ })}
            >
              编辑
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
              color="danger"
              variant="outlined"
            >
              删除
            </Button>
            <Button
              type="default"
              variant="outlined"
              onClick={() => exportPacketData(_.id)}
            >
              已领列表
            </Button>
          </Space>
        );
      },
    },
  ];

  const switchChange = (e: boolean, row: PacketManageType) => {
    updatePacketStatus(row.id as string, Number(e)).then(() => {
      message.success('修改成功～');
      setSearchDefaultForm({ ...searchDefaultForm });
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除活动红包',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该活动红包吗？数据删除后将无法恢复！',
      onOk() {
        deletePacketList(id).then(() => {
          message.success('删除成功～');
          // 刷新表格数据
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onEditOk = async (editRow: PacketManageType) => {
    try {
      if (params.editRow == null) {
        // 新增数据
        await editPacketList(editRow);
      } else {
        // 编辑数据
        await editPacketList(editRow);
      }
      message.success(!editRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, editRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, editRow: null });
    }
  };

  const openPacketDetail = async (id: string) => {
    const resp = await getPacketRecordDetail(id);
    console.log(resp, 'resp');
  };

  const exportPacketData = async (id: string) => {
    const resp = await getPacketRecord(id);
    ExportTableDataByXLSX(resp, PacketRecordColumms, '活动红包奖励列表');
  };
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          {/* 操作按钮 */}
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setParams({ visible: true, editRow: null })}
            >
              新增活动红包
            </Button>
          </Space>
          <SearchTable
            size="middle"
            columns={columns}
            style={{ marginTop: '8px' }}
            pageIndexKey="pageIndex"
            pageSizeKey="pageSize"
            bordered
            scroll={{ x: 'max-content', y: height - 158 }}
            rowKey="id"
            totalKey="total"
            fetchResultKey="entries"
            isPagination={true}
            fetchData={getPacketListByPage}
            searchFilter={searchDefaultForm}
            isSelection={false}
            onUpdatePagination={onUpdatePagination}
          />
        </Card>
      </ConfigProvider>
      <AddPacketManage
        open={params}
        onCancel={() => setParams({ visible: false, editRow: null })}
        onOk={onEditOk}
      />
      {/* <PacketAwardDetail /> */}
    </>
  );
};

export default PacketManage;

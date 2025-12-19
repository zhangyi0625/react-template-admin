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
import { SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import {
  addServiceCharge,
  deleteServiceChargeManageDetail,
  getServiceChargeManageByList,
  updateServiceCharge,
  updateServiceChargeItems,
} from '@/services/otherSetting/serviceChargeManage/serviceChargeManageApi';
import type {
  ServiceChargeFeeItems,
  ServiceChargeManageEditType,
} from '@/services/otherSetting/serviceChargeManage/serviceChargeManageModel';
import type { DefaultPaging } from '@/types/global';
import ServiceChargeManageModal from './ServiceChargeManageModel';
import ServiceChargeManageDetail from './ServiceChargeManageDetail';
import { filterKeys } from '@/utils/tool';

const ServiceChargeManage: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<DefaultPaging>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [params, setParams] = useState<{
    visible: boolean;
    editRow: ServiceChargeManageEditType | null;
    view: boolean;
  }>({
    visible: false,
    editRow: null,
    view: false,
  });

  const columns: TableProps['columns'] = [
    {
      title: '规则名称',
      dataIndex: 'name',
      width: 150,
      align: 'center',
    },
    {
      title: '分类',
      width: 150,
      align: 'center',
      render(value) {
        return value.services === 'BOOKING' ? '现舱' : '预定';
      },
    },
    {
      title: '分组名',
      width: 150,
      align: 'center',
      dataIndex: 'plan',
    },
    {
      title: '状态',
      width: 150,
      align: 'center',
      render(value) {
        return value.valid ? '有效' : '无效';
      },
    },
    {
      title: '优先级',
      width: 150,
      align: 'center',
      dataIndex: 'priority',
    },
    {
      title: '有效起止时间',
      width: 250,
      align: 'center',
      render(value) {
        return (
          value.validFrom &&
          value.validTo && (
            <div>
              {value.validFrom ?? ''} 至 {value.validTo ?? ''}
            </div>
          )
        );
      },
    },
    {
      title: '创建时间',
      width: 250,
      align: 'center',
      dataIndex: 'created',
    },
    {
      title: '备注',
      width: 150,
      align: 'center',
      dataIndex: 'remarks',
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={10}>
            <Button
              type="default"
              variant="solid"
              onClick={() =>
                setParams({
                  visible: true,
                  editRow: filterKeys(_, ['id'], true),
                  view: true,
                })
              }
            >
              费用明细
            </Button>
            <Button
              type="primary"
              variant="solid"
              onClick={() =>
                setParams({ visible: true, editRow: _, view: false })
              }
            >
              修改
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
              color="danger"
              variant="outlined"
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
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除服务费保证金规则',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该规则吗？数据删除后将无法恢复！',
      onOk() {
        deleteServiceChargeManageDetail(id).then(() => {
          message.success('删除成功～');
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onEditOk = async (editRow: ServiceChargeManageEditType) => {
    try {
      if (params.editRow == null) {
        await addServiceCharge(editRow);
      } else {
        await updateServiceCharge(editRow, params.editRow.id as string);
      }
      message.success(!editRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, editRow: null, view: false });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, editRow: null });
    }
  };

  const editServiceChargeManageDetail = async (
    array: ServiceChargeFeeItems[]
  ) => {
    try {
      await updateServiceChargeItems(array, params.editRow?.id || '');
      message.success('修改成功～');
      setParams({ visible: false, editRow: null, view: true });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch {}
  };
  return (
    <>
      <ConfigProvider>
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          <Space>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() =>
                setParams({ visible: true, editRow: null, view: false })
              }
            >
              新增规则
            </Button>
          </Space>
          <SearchTable
            size="middle"
            columns={columns}
            style={{ marginTop: '8px' }}
            pageIndexKey="pageIndex"
            pageSizeKey="pageSize"
            scroll={{ x: 'max-content', y: height - 158 }}
            rowKey="id"
            totalKey="total"
            fetchResultKey="entries"
            isPagination={true}
            fetchData={getServiceChargeManageByList}
            searchFilter={searchDefaultForm}
            isSelection={false}
            onUpdatePagination={onUpdatePagination}
          />
        </Card>
      </ConfigProvider>
      {params.view ? (
        <ServiceChargeManageDetail
          params={{ ...params, id: params.editRow?.id || '' }}
          onCancel={() => setParams({ ...params, visible: false })}
          onOk={editServiceChargeManageDetail}
        />
      ) : (
        <ServiceChargeManageModal
          params={params}
          onCancel={() => setParams({ ...params, visible: false })}
          onOk={onEditOk}
        />
      )}
    </>
  );
};

export default ServiceChargeManage;

import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  Switch,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import {
  MemberUnitManageMemberLevelOptions,
  MemberUnitManageSearchColumns,
  MemberUnitManageUnitLevelOptions,
} from './config';
import {
  addMemberUnitManage,
  deleteMemberUnitManage,
  getMemberUnitManageListByPage,
  updateMemberUnitManage,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageApi';
import MemberUnitModal from './MemberUnitModal';
import MemberUnitDetail from './MemberUnitDetail';
import type {
  MemberUnitManageSearchParams,
  MemberUnitManageType,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import useParentSize from '@/hooks/useParentSize';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const MemberUnitManage: React.FC = () => {
  const { modal, message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<MemberUnitManageSearchParams>({
      page: 1,
      limit: 10,
      sort: 'update_time',
      order: 'desc',
    });

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: MemberUnitManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      align: 'center',
    },
    {
      title: '单位类型',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <div>
            {MemberUnitManageUnitLevelOptions?.find(
              (i) => i.value === value.unitLevel,
            )?.label ?? '-'}
          </div>
        );
      },
    },
    {
      title: '等级',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <div>
            {MemberUnitManageMemberLevelOptions?.find(
              (i) => i.value === value.memberLevel,
            )?.label ?? '-'}
          </div>
        );
      },
    },
    {
      title: '会员到期日期',
      width: 150,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.memberExpiryDate, 'Y-M-D')}</div>;
      },
    },
    {
      title: '在会员名录展示',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <Switch
            checked={value.isShow}
            onChange={(checked) => onSwitchChange(value, checked)}
          />
        );
      },
    },
    {
      title: '社会统一社会信用代码',
      width: 180,
      align: 'center',
      dataIndex: 'socialCode',
    },
    {
      title: '联系电话',
      width: 150,
      align: 'center',
      dataIndex: 'contactPhone',
    },
    {
      title: '地址',
      width: 180,
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: '创建日期',
      width: 180,
      align: 'center',
      dataIndex: 'createTime',
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
                setParams({ visible: false, currentRow: _ });
                setDrawerVisible(true);
              }}
            >
              详情
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

  const onUpdateSearch = (info?: MemberUnitManageSearchParams | unknown) => {
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

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除会员单位',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该会员单位吗？数据删除后将无法恢复！',
      onOk() {
        deleteMemberUnitManage(id).then(() => {
          // 刷新表格数据
          onUpdateSearch();
        });
      },
    });
  };

  const onSwitchChange = async (
    value: MemberUnitManageType,
    checked: boolean,
  ) => {
    try {
      await updateMemberUnitManage({
        ...value,
        isShow: checked,
      } as MemberUnitManageType);
      message.success('修改成功');
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      message.error('操作失败');
    }
  };

  const onEditOk = async (routeRow: MemberUnitManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addMemberUnitManage(routeRow);
      } else {
        // 编辑数据
        await updateMemberUnitManage(routeRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!params.currentRow ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      onUpdateSearch();
    } catch (error) {}
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
            columns={MemberUnitManageSearchColumns}
            gutterWidth={24}
            iconHidden={true}
            labelPosition="left"
            btnSeparate={false}
            isShowReset={true}
            isShowExpend={false}
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 22 },
                sm: { span: 8 },
              },
              wrapperCol: {
                xs: { span: 2 },
                sm: { span: 16 },
              },
            }}
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
            新增会员单位
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
          fetchData={getMemberUnitManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <MemberUnitModal
        params={params}
        onCancel={() => setParams({ ...params, visible: false })}
        onOk={onEditOk}
      />
      <MemberUnitDetail
        visible={drawerVisible}
        currentRow={params.currentRow}
        onCancel={() => setDrawerVisible(false)}
      />
    </>
  );
};

export default MemberUnitManage;

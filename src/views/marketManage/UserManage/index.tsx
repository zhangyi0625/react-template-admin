import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TableProps,
  type TablePaginationConfig,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CardUserIcon from '@/assets/svg/icon/card-user.svg';
import MemberUserIcon from '@/assets/svg/icon/member-user.svg';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import type {
  StaffManageParams,
  StaffManageType,
} from '@/services/marketManage/staffManage/staffManageModel';
import { UserLevelOptions, UserManageSearchColumns } from './config';
import {
  addStaffFollowRecord,
  addStaffManage,
  getStaffManageByPage,
  postStaffSearchStatistic,
} from '@/services/marketManage/staffManage/staffManageApi';
import AddUser from './AddUser';
import FollowUpModal from './FollowUpModal';
import useParentSize from '@/hooks/useParentSize';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';
import { useNavigate } from 'react-router-dom';

const UserManage: React.FC = () => {
  const { message } = App.useApp();

  const navigate = useNavigate();

  const API = process.env.RS_CONSOLE_API;

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<StaffManageParams>(
    {
      pageIndex: 1,
      pageSize: 10,
      filter: {},
      sort: { id: -1 },
    }
  );

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: StaffManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const [userId, setUserId] = useState<string | null>(null);

  const [followUpModalVisible, setFollowUpModalVisible] =
    useState<boolean>(false);

  useEffect(() => {});

  const columns: TableProps['columns'] = [
    {
      title: '用户姓名',
      dataIndex: 'name',
      width: 200,
      align: 'center',
    },
    {
      title: '用户分类',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <div className="flex items-center justify-center">
            {value.level >= 5 && (
              <img
                src={
                  value.level === 5 || value.level === 7
                    ? CardUserIcon
                    : MemberUserIcon
                }
                className="mr-[6px]"
                width={14}
                height={14}
                alt=""
              />
            )}
            {
              UserLevelOptions?.find((item) => item.value === value.level)
                ?.label
            }
          </div>
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 180,
      align: 'center',
    },
    {
      title: '公司名称',
      width: 220,
      align: 'center',
      render(value) {
        return (
          <div>
            {value.affiliateName}
            {value.affiliateStated && (
              <span
                className="ml-[6px] cursor-pointer underline text-normal-blue"
                onClick={() =>
                  navigate(`/marketManage/affiliateManage/${value.affiliateId}`)
                }
              >
                查看
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: '注册时间',
      width: 150,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.created, 'Y/M/D')}</div>;
      },
    },
    {
      title: '最近使用时间',
      width: 150,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.lastActive, 'Y/M/D')}</div>;
      },
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              type="default"
              variant="outlined"
              onClick={() =>
                navigate(`/marketManage/affiliateManage/${_.affiliateId}`)
              }
            >
              查看
            </Button>
            <Button
              color="blue"
              variant="outlined"
              onClick={() => {
                setUserId(_.id), setFollowUpModalVisible(true);
              }}
            >
              跟进
            </Button>
            <Button
              color="gold"
              variant="outlined"
              onClick={() => openEitherWindow(_.id)}
              hidden={!_.permissions && _.permissions.indexOf('YHA3') === -1}
            >
              登陆
            </Button>
          </Space>
        );
      },
    },
  ];

  const openEitherWindow = async (id: string) => {
    try {
      const resp = await postStaffSearchStatistic(id);
      resp.token &&
        window.open(
          `${API}/customer/index.html#/cabinBooking?token=${resp.token}`
        );
    } catch {
      message.error('登录失败，联系第三方人员客户～');
    }
  };

  const onUpdateSearch = (info?: StaffManageParams | unknown) => {
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

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const onEditOk = async (editRow: StaffManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addStaffManage(editRow);
      } else {
        // 编辑数据
        // await updateAffiliateManage(editRow, editRow.id as string);
      }
      message.success(!editRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, editRow: null });
    }
  };

  const followUpModalOk = async (params: { content: string }) => {
    try {
      await addStaffFollowRecord(userId as string, params);
      message.success('跟进成功～');
      setFollowUpModalVisible(false);
    } catch {
      setFollowUpModalVisible(false);
    }
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
        <Card>
          <SearchForm
            columns={UserManageSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={true}
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
            // color="blue"
            // variant="outlined"
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增用户
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
          fetchData={getStaffManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddUser
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
      <FollowUpModal
        followUpModalVisible={followUpModalVisible}
        onCancel={() => setFollowUpModalVisible(false)}
        onOk={followUpModalOk}
      />
    </>
  );
};

export default UserManage;

import { useRef, useState } from 'react';
import styles from '../../AffiliateManage.module.scss';
import { App, Button, Space, TableProps } from 'antd';
import { ExclamationCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import { SearchTable } from 'customer-search-form-table';
import {
  addStaffJoinAffiliate,
  deleteStaffInAffiliate,
  getStaffManageByPage,
} from '@/services/marketManage/staffManage/staffManageApi';
import type {
  StaffJoinAffiliateType,
  StaffManageParams,
} from '@/services/marketManage/staffManage/staffManageModel';
import AffiliateUserDrawer, {
  AffiliateUserDrawerRef,
} from './AffiliateUserDrawer';

type AffiliateUserProps = {
  affiliateId: string;
};

const AffiliateUser: React.FC<AffiliateUserProps> = ({ affiliateId }) => {
  const { message, modal } = App.useApp();

  const AffiliateUserDrawerRef = useRef<AffiliateUserDrawerRef>(null);

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: StaffJoinAffiliateType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const [searchDefaultForm, setSearchDefaultForm] = useState<StaffManageParams>(
    {
      pageIndex: 1,
      pageSize: 10,
      filter: {
        affiliateId: affiliateId,
      },
      projection: 'AFFILIATE_CUSTOMER',
    }
  );

  const columns: TableProps['columns'] = [
    {
      title: '真实姓名',
      width: 100,
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      width: 100,
      align: 'center',
      dataIndex: 'phone',
    },
    {
      title: '公司管理员',
      width: 100,
      align: 'center',
      render(value) {
        return <div>{value.permissions.indexOf('AFA') !== -1 ? '是' : ''}</div>;
      },
    },
    {
      title: '子账号权益',
      width: 100,
      align: 'center',
      render(value) {
        return <div>{value.level === 9 ? '是' : ''}</div>;
      },
    },
    {
      title: '订舱权限',
      width: 100,
      align: 'center',
      render(value) {
        return <div>{value.permissions.indexOf('BKG') !== -1 ? '是' : ''}</div>;
      },
    },
    {
      title: '预定权限',
      width: 100,
      align: 'center',
      render(value) {
        return <div>{value.permissions.indexOf('PBK') !== -1 ? '是' : ''}</div>;
      },
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
              color="red"
              variant="outlined"
              onClick={() => onDelete(_.id)}
              size="small"
              style={{
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              删除
            </Button>
            <Button
              color="blue"
              variant="outlined"
              // onClick={() => navigate(`/marketManage/affiliateManage/${_.id}`)}
              size="small"
              style={{
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              查看
            </Button>
          </Space>
        );
      },
    },
  ];
  const addAffilateUser = () => {
    setParams({ visible: true, currentRow: null });
    setTimeout(() => {
      AffiliateUserDrawerRef.current?.onRefreshUserData();
    }, 500);
  };

  const onConfirm = (params: { customerIds: string[] }) => {
    addStaffJoinAffiliate({
      affiliateId: affiliateId,
      customerIds: params.customerIds,
    }).then(() => {
      message.success('添加成功～');
      setParams({ visible: false, currentRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    });
  };

  const onDelete = (id: string) => {
    modal.confirm({
      title: '删除用户',
      icon: <ExclamationCircleFilled />,
      content: '确定从该企业移除用户吗？数据删除后将无法恢复！',
      onOk() {
        deleteStaffInAffiliate(id).then(() => {
          message.success('删除成功');
          // 刷新表格数据
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };
  return (
    <>
      <div className="bg-white rounded-[6px] px-[20px] py-[15px] w-full">
        <div className="flex items-center justify-between">
          <p className={styles['basic-title']} style={{ margin: 0 }}>
            企业用户
          </p>
          <Button
            color="primary"
            variant="filled"
            icon={<PlusCircleFilled />}
            onClick={addAffilateUser}
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            新增企业用户
          </Button>
        </div>
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: 178 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={false}
          fetchData={getStaffManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={() => {}}
        />
        <AffiliateUserDrawer
          ref={AffiliateUserDrawerRef}
          params={params}
          onCancel={() => setParams({ visible: false, currentRow: null })}
          onConfirm={onConfirm}
        />
      </div>
    </>
  );
};

export default AffiliateUser;

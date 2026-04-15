import React, { useImperativeHandle, useState } from 'react';
import {
  Button,
  Drawer,
  Space,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import clsx from 'clsx';
import type {
  StaffJoinAffiliateType,
  StaffManageParams,
} from '@/services/marketManage/staffManage/staffManageModel';
import { CloseOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { getStaffManageByPage } from '@/services/marketManage/staffManage/staffManageApi';
import { AffiliateUserDrawerColumns } from '../../config';
import { updateSearchFilter } from '@/utils/filter';

export type AffiliateUserDrawerProps = {
  params: {
    visible: boolean;
    currentRow: StaffJoinAffiliateType | null;
  };
  onCancel: () => void;
  onConfirm: (params: { customerIds: string[] }) => void;
};

export type AffiliateUserDrawerRef = {
  onRefreshUserData: () => void;
};

const AffiliateUserDrawer = React.forwardRef<
  AffiliateUserDrawerRef,
  AffiliateUserDrawerProps
>(({ params, onCancel, onConfirm }, ref) => {
  const [searchDefaultForm, setSearchDefaultForm] = useState<StaffManageParams>(
    {
      pageIndex: 1,
      pageSize: 20,
      filter: {},
      projection: 'SMALL',
    },
  );

  const [selected, setSelected] = useState<string[]>([]);

  const [immediate, setImmediate] = useState<boolean>(true);

  const columns: TableProps['columns'] = [
    {
      title: '用户姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
    },
  ];

  useImperativeHandle(ref, () => ({
    onRefreshUserData: () => {
      setImmediate(false);
    },
  }));

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const onClose = () => {
    setImmediate(true);
    setSelected([]);
    onCancel();
  };

  const onUpdateSearch = (info?: StaffManageParams['filter'] | unknown) => {
    updateSearchFilter(
      searchDefaultForm,
      setSearchDefaultForm,
      ['pageIndex', 'pageSize', 'projection'],
      info,
    );
  };

  return (
    <>
      <Drawer
        title="新增企业用户"
        width={600}
        open={params.visible}
        closeIcon={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        }
        onClose={onClose}
        className={clsx('drawer-footer', 'text-right')}
        footer={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button
              type="primary"
              onClick={() =>
                onConfirm({
                  customerIds: selected,
                })
              }
            >
              确定
            </Button>
          </Space>
        }
      >
        <SearchForm
          columns={AffiliateUserDrawerColumns}
          gutterWidth={24}
          labelPosition="left"
          btnSeparate={false}
          iconHidden={true}
          isShowReset={false}
          isShowExpend={false}
          onUpdateSearch={onUpdateSearch}
        />
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: 478 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          immediate={immediate}
          fetchData={getStaffManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          multipleSelected={selected}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelected(options)}
        />
      </Drawer>
    </>
  );
});

export default AffiliateUserDrawer;

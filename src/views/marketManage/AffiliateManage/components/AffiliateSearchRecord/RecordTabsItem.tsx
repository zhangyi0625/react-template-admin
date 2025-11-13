import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { SelectProps, TableProps } from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { ComboPermission } from '@/enums/setting';
import { getStaffComboPermissionRecord } from '@/services/marketManage/staffManage/staffManageApi';
import type { ComboPermissionRecordParams } from '@/services/marketManage/staffManage/staffManageModel';

export type RecordTabsItemProps = {
  type: 'affiliate' | 'staff';
  customerId: string | null;
  affiliateId: string | null;
};

export type RecordTabsItemRef = {
  onRefresh: () => void;
};

const RecordTabsItem = React.forwardRef<RecordTabsItemRef, RecordTabsItemProps>(
  ({ type, customerId, affiliateId }, ref) => {
    const [searchDefaultForm, setSearchDefaultForm] = useState<{
      filter: ComboPermissionRecordParams;
    }>();

    useEffect(() => {
      init();
    }, []);

    useImperativeHandle(ref, () => ({
      onRefresh: () => init(),
    }));

    const init = () => {
      setSearchDefaultForm({
        filter: {
          affiliateId: type === 'affiliate' ? affiliateId : null,
          module: '',
          customerId: type === 'staff' ? customerId : null,
        },
      });
    };

    const columns: TableProps['columns'] = [
      {
        title: '操作人',
        width: 100,
        align: 'center',
        render(value) {
          return (
            <div>
              {type === 'staff' ? value.customerName : value.affiliateName}
            </div>
          );
        },
      },
      {
        title: '权限类型',
        width: 100,
        align: 'center',
        render(value: { module: keyof typeof ComboPermission }) {
          return <div>{ComboPermission[value.module]}</div>;
        },
      },
      {
        title: '变更内容',
        width: 180,
        align: 'center',
        dataIndex: 'content',
      },
      {
        title: '操作时间',
        width: 120,
        align: 'center',
        dataIndex: 'created',
      },
    ];

    const onUpdateSearch = (info?: unknown) => {
      const filteredObj = Object.fromEntries(
        Object.entries(info ?? {}).filter(
          ([, value]) => !!value && value !== undefined
        )
      );
      setSearchDefaultForm({
        filter: {
          ...searchDefaultForm?.filter,
          ...filteredObj,
        } as ComboPermissionRecordParams,
      });
    };

    const getOptions = () => {
      const selectOptions: SelectProps['options'] = [];
      Object.keys(ComboPermission).forEach((key) => {
        selectOptions.push({
          label: ComboPermission[key as keyof typeof ComboPermission],
          value: key,
        });
      });
      return selectOptions;
    };
    return (
      <>
        <SearchForm
          columns={[
            {
              label: '权限类型',
              name: 'module',
              formType: 'normalSelect',
              options: getOptions(),
              span: 12,
              selectFetch: false,
              hiddenItem: false,
            },
          ]}
          gutterWidth={24}
          labelPosition="left"
          btnSeparate={false}
          iconHidden={false}
          isShowReset={true}
          isShowExpend={false}
          onUpdateSearch={onUpdateSearch}
        />
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: 378 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={false}
          fetchData={getStaffComboPermissionRecord}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={() => {}}
        />
      </>
    );
  }
);

export default RecordTabsItem;

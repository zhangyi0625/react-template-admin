import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { SelectProps, TableProps } from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { ComboPermission } from '@/enums/setting';
import { getStaffComboPermissionRecord } from '@/services/marketManage/staffManage/staffManageApi';

export type RecordTabsItemProps = {
  affiliateId: string;
};

export type RecordTabsItemRef = {
  onRefresh: () => void;
};

const RecordTabsItem = React.forwardRef<RecordTabsItemRef, RecordTabsItemProps>(
  ({ affiliateId }, ref) => {
    const [searchDefaultForm, setSearchDefaultForm] = useState<{
      filter: {
        module: string;
        affiliateId: string;
      };
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
          affiliateId: affiliateId,
          module: '',
        },
      });
    };

    const columns: TableProps['columns'] = [
      {
        title: '操作人',
        dataIndex: 'affiliateName',
        width: 100,
        align: 'center',
      },
      {
        title: '权限类型',
        width: 100,
        align: 'center',
        render(value: { module: keyof typeof ComboPermission }) {
          return <div>{ComboPermission[value.module]}</div>;
        },
      },
    ];

    const onUpdateSearch = (
      info?: { module: string; affiliateId: string } | unknown
    ) => {
      const filteredObj = Object.fromEntries(
        Object.entries(info ?? {}).filter(
          ([, value]) => !!value && value !== undefined
        )
      );
      setSearchDefaultForm({
        filter: { ...filteredObj, affiliateId: affiliateId } as {
          module: string;
          affiliateId: string;
        },
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

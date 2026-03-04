import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Switch,
  type TableProps,
} from 'antd';
import { SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import {
  getEquityRightsBase,
  getEquityRightsExtra,
  postEquityRightsExtraPriceUpdate,
} from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsApi';
import type { DefaultPaging } from '@/types/global';
import QueryRightsSettingModal from './QueryRightsSettingModal';
import type { EquityRightsExtraPriceUpdateType } from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsModel';
import { ComboPermission, LevelSetting } from '@/enums/setting';
import { isNumber } from 'lodash-es';

const QueryRightsSetting: React.FC = () => {
  const { message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [defaultActiveTabKey, setDefaultActiveTabKey] =
    useState('packageBenefit');

  const [searchFilter, setSearchFilter] = useState<DefaultPaging>({
    pageIndex: 1,
    pageSize: 20,
  });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: EquityRightsExtraPriceUpdateType | null;
  }>({ visible: false, currentRow: null });

  const loadComboPermissionByLevel = (): TableProps['columns'] => {
    let keys = Object.keys(LevelSetting).filter(
      (key) => key !== 'L9' && key !== 'L10' && key !== 'L21',
    );
    const filterComboPermission: TableProps['columns'] = keys.map((key) => ({
      title: LevelSetting[key as keyof typeof LevelSetting],
      align: 'center',
      render(value) {
        let isRATE_SUBSCRIBE = value.module === 'RATE_SUBSCRIBE';
        let filterKeys = ['RATE_SUBSCRIBE', 'TRUCK_TRAJECTORY', 'US_CLEARANCE'];
        return defaultActiveTabKey === 'packageBenefit' ? (
          <div>
            {isNumber(value[`${key}Limit`]) ? value[`${key}Limit`] : '未限制'}
            {isNumber(value[`${key}Limit`]) && (
              <span>{isRATE_SUBSCRIBE ? '条' : ' / 天'}</span>
            )}
          </div>
        ) : (
          <div>
            {isNumber(value[`${key}Price`]) ? value[`${key}Price`] : '禁用'}
            {isNumber(value[`${key}Price`]) && (
              <span>
                {filterKeys.includes(value.module) ? ' / 条' : ' / 次'}
              </span>
            )}
          </div>
        );
      },
    }));
    return filterComboPermission;
  };

  const columns: TableProps['columns'] = [
    {
      title: '功能',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            {ComboPermission[value.module as keyof typeof ComboPermission]}
          </div>
        );
      },
    },
    {
      title: '限制查询次数',
      width: 150,
      align: 'center',
      hidden: defaultActiveTabKey === 'additionalPurchase',
      render(value) {
        return (
          <Switch
            value={Boolean(value.isLimit)}
            checkedChildren="限制"
            unCheckedChildren="不限制"
            disabled={true}
          />
        );
      },
    },
    ...(loadComboPermissionByLevel() ?? []),
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 120,
      hidden: defaultActiveTabKey === 'packageBenefit',
      render(value) {
        return (
          <Button
            variant="outlined"
            color="blue"
            onClick={() => {
              setParams({ visible: true, currentRow: value });
            }}
          >
            编辑
          </Button>
        );
      },
    },
  ];

  const tabChange = (key: string) => {
    setDefaultActiveTabKey(key);
    setSearchFilter({
      ...searchFilter,
    });
  };

  const onEditOk = async (editRow: EquityRightsExtraPriceUpdateType) => {
    try {
      await postEquityRightsExtraPriceUpdate(editRow);
      message.success('修改成功～');
      setParams({ visible: false, currentRow: null });
      setSearchFilter({ ...searchFilter });
    } catch (error) {
      // setParams({ visible: false, editRow: null });
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          ref={parentRef}
          tabList={[
            { key: 'packageBenefit', tab: '套餐内权益' },
            { key: 'additionalPurchase', tab: '额外购买费用' },
          ]}
          defaultActiveTabKey={defaultActiveTabKey}
          onTabChange={tabChange}
          tabProps={{
            size: 'middle',
          }}
        >
          <SearchTable
            size="small"
            columns={columns}
            style={{ marginTop: '10px' }}
            pageIndexKey="pageIndex"
            pageSizeKey="pageSize"
            scroll={{ x: 'max-content', y: height - 158 }}
            rowKey="id"
            totalKey="total"
            fetchResultKey="data"
            isPagination={false}
            fetchData={
              defaultActiveTabKey === 'packageBenefit'
                ? getEquityRightsBase
                : getEquityRightsExtra
            }
            searchFilter={searchFilter}
            isSelection={false}
            onUpdatePagination={() => {}}
          />
        </Card>
      </ConfigProvider>
      <QueryRightsSettingModal
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default QueryRightsSetting;

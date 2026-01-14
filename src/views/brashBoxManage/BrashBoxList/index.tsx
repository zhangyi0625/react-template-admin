import useParentSize from '@/hooks/useParentSize';
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
  Tabs,
  TabsProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { BrashBoxListSearchColumns } from '../config';
import { useState } from 'react';
import { filterKeys } from '@/utils/tool';
import { CabinResultParams } from '@/services/cabinManage/cabinManageModel';
import { getAffilateAccountList } from '@/services/todayPlan/todayPlanApi';
import BrashBoxModal from './BrashBoxModal';
import BrashBoxSetTime from './BrashBoxSetTime';
import { getBrashBoxManagePage } from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';

const BrashBoxList: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<any>({
    page: 1,
    limit: 10,
  });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: CabinResultParams | null;
    type: 'edit' | 'setTime';
  }>({
    visible: false,
    currentRow: null,
    type: 'edit',
  });

  const components: TabsProps['items'] = [
    {
      label: '未刷箱',
      key: '1',
    },
    {
      label: '刷箱中',
      key: '2',
    },
    {
      label: '刷箱成功',
      key: '3',
    },
    {
      label: '刷箱失败',
      key: '4',
    },
  ];

  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('1');

  const tableColumns: TableProps['columns'] = [
    {
      title: '用户手机号',
      key: 'phone',
      dataIndex: 'phone',
      align: 'left',
      width: 80,
    },
    {
      title: '提单号',
      key: 'no',
      dataIndex: 'no',
      align: 'left',
      width: 80,
    },
    {
      title: '船名',
      key: 'vesselName',
      dataIndex: 'vesselName',
      align: 'left',
      width: 80,
    },
    {
      title: '航次',
      key: 'voyNo',
      dataIndex: 'voyNo',
      align: 'left',
      width: 80,
    },
    {
      title: '船公司',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'left',
      width: 80,
    },
    {
      title: '方式',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'left',
      hidden: defaultActiveKey !== '2',
      width: 80,
    },
    {
      title: '状态',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'left',
      hidden: defaultActiveKey !== '2',
      width: 80,
    },
    {
      title: '箱型数量',
      align: 'left',
      width: 80,
      render(value) {
        return <div>{'40GP * 2'}</div>;
      },
    },
    {
      title: '下次自动刷取时间',
      align: 'left',
      width: 80,
      hidden: defaultActiveKey !== '2',
      render(value) {
        return <div>{'2025-12-38 12:00:00'}</div>;
      },
    },
    {
      title: '上次执行时间',
      align: 'left',
      width: 80,
      hidden: defaultActiveKey !== '2',
      render(value) {
        return <div>{'2025-12-38 11:00:00'}</div>;
      },
    },
    {
      title: '货代一代',
      key: 'name',
      dataIndex: 'name',
      align: 'left',
      width: 80,
    },
    {
      title: '操作次数',
      align: 'left',
      width: 80,
      hidden: defaultActiveKey !== '2',
      render(value) {
        return <div>{'vavranu@kihpuse.tm'}</div>;
      },
    },
    {
      title: '剩余次数',
      align: 'left',
      hidden: defaultActiveKey !== '2',
      width: 80,
      render(value) {
        return <div>{'vavranu@kihpuse.tm'}</div>;
      },
    },
    {
      title: '操作账号',
      align: 'left',
      width: 80,
      render(value) {
        return <div>{'vavranu@kihpuse.tm'}</div>;
      },
    },
    {
      title: '操作',
      key: 'customer',
      align: 'left',
      width: 100,
      render(_) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() =>
                setParams({ visible: true, currentRow: _, type: 'edit' })
              }
              hidden={defaultActiveKey !== '1'}
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={() =>
                setParams({ visible: true, currentRow: _, type: 'setTime' })
              }
              hidden={defaultActiveKey !== '5'}
            >
              编辑并恢复
            </Button>
          </Space>
        );
      },
    },
  ];

  const onChange = (type: string) => {
    setDefaultActiveKey(type);
    setSearchDefaultForm({
      ...searchDefaultForm,
    });
  };

  const onUpdateSearch = (info?: CabinResultParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    );
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true);
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };

  const onEditOk = () => {};
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={BrashBoxListSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            iconHidden={false}
            btnSeparate={false}
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
        <Tabs
          activeKey={defaultActiveKey}
          items={components}
          onChange={onChange}
        />
        <Space className="">
          {defaultActiveKey === '1' && (
            <Button
              type="primary"
              onClick={() =>
                setParams({ ...params, visible: true, type: 'edit' })
              }
            >
              新增
            </Button>
          )}
          {defaultActiveKey === '1' && (
            <Button type="primary" onClick={() => {}}>
              导入
            </Button>
          )}
          {defaultActiveKey === '1' && (
            <Button
              type="primary"
              onClick={() =>
                setParams({ ...params, visible: true, type: 'setTime' })
              }
            >
              设置时间
            </Button>
          )}
          {defaultActiveKey === '1' && (
            <Button type="primary" onClick={() => {}}>
              刷箱
            </Button>
          )}
          {defaultActiveKey === '1' && (
            <Button variant="solid" color="danger" onClick={() => {}}>
              删除
            </Button>
          )}
          {defaultActiveKey === '2' && (
            <Button type="primary" onClick={() => {}}>
              启动
            </Button>
          )}
          {defaultActiveKey === '2' && (
            <Button
              variant="solid"
              color="orange"
              style={{ backgroundColor: '#FAAD14 !important' }}
              onClick={() => {}}
            >
              停止
            </Button>
          )}
          {!(defaultActiveKey === '2' || defaultActiveKey === '5') && (
            <Button type="default" onClick={() => {}}>
              导出
            </Button>
          )}
        </Space>
        <SearchTable
          style={{ marginTop: '10px' }}
          size="middle"
          pageIndexKey="page"
          pageSizeKey="limit"
          totalKey={'count'}
          fetchResultKey={'list'}
          isPagination={true}
          columns={tableColumns}
          rowKey={(record) => record.id}
          scroll={{ x: 'max-content', y: height - 298 }}
          fetchData={getBrashBoxManagePage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      {params.type === 'edit' ? (
        <BrashBoxModal
          params={params}
          onCancel={() => setParams({ ...params, visible: false })}
          onOk={onEditOk}
        />
      ) : (
        <BrashBoxSetTime
          params={params}
          onCancel={() => setParams({ ...params, visible: false })}
          onOk={onEditOk}
        />
      )}
    </>
  );
};

export default BrashBoxList;

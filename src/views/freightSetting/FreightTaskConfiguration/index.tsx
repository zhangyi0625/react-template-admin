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
import { SearchForm, SearchTable } from 'customer-search-form-table';
import {
  FreightTaskConfigurationSearchColumns,
  FreightTaskConfigurationSource,
} from '../config';
import useParentSize from '@/hooks/useParentSize';
import type {
  FreightTaskConfigurationSearchFilterParams,
  FreightTaskConfigurationSearchParams,
  FreightTaskConfigurationType,
} from '@/services/freightSetting/freightTaskConfiguration/freightTaskConfigurationModel';
import {
  getFreightTaskConfigurationListByPage,
  addFreightTaskConfiguration,
  putFreightTaskConfiguration,
  deleteFreightTaskConfiguration,
} from '@/services/freightSetting/freightTaskConfiguration/freightTaskConfigurationApi';
import AddFreightTaskConfiguration from './AddFreightTaskConfiguration';
import { filterKeys } from '@/utils/tool';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';

const FreightTaskConfiguration: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<FreightTaskConfigurationSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: {
        isEnabled: 0,
      },
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: FreightTaskConfigurationType | null;
  }>({ visible: false, currentRow: null });

  const columns: TableProps['columns'] = [
    {
      dataIndex: 'carrierCode',
      title: '船公司',
      align: 'center',
      width: 100,
    },
    {
      title: '起运港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value?.por?.localName ?? '-'}</p>
            <p>{value?.por?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '目的港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value?.fnd?.localName ?? '-'}</p>
            <p>{value?.fnd?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      dataIndex: 'transClause',
      title: '运输条款',
      align: 'center',
      width: 100,
    },
    {
      title: '来源',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <div>
            {
              FreightTaskConfigurationSource?.find(
                (item) => item.value === value.source
              )?.label
            }
          </div>
        );
      },
    },
    {
      dataIndex: 'modifyTime',
      title: '成功执行时间',
      align: 'center',
      width: 180,
    },
    {
      title: '状态',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{value.isEnabled ? '启用' : '关闭'}</div>;
      },
    },
    {
      title: 'etd相距天数',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div>{value.etdOffsetDay ? value.etdOffsetDay + '天' : '-'}</div>
        );
      },
    },
    {
      dataIndex: 'username',
      title: '船司账号',
      align: 'center',
      width: 180,
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
              type="default"
              variant="outlined"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              修改
            </Button>
            <Button
              color="danger"
              variant="solid"
              onClick={() => deleteItem(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除运价任务',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该运价任务吗？数据删除后将无法恢复！',
      onOk() {
        deleteFreightTaskConfiguration(id).then(() => {
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onUpdateSearch = (
    info?: FreightTaskConfigurationSearchFilterParams | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined
      )
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize'],
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

  const onEditOk = async (customerRow: FreightTaskConfigurationType) => {
    try {
      if (params.currentRow == null) {
        await addFreightTaskConfiguration(customerRow);
      } else {
        await putFreightTaskConfiguration(customerRow);
      }
      message.success(!params.currentRow ? '添加成功~' : '修改成功~');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null });
      onUpdateSearch({ searchDefaultForm });
    } catch (error) {}
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={FreightTaskConfigurationSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
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
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增运价任务
          </Button>
        </Space>
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '10px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getFreightTaskConfigurationListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddFreightTaskConfiguration
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, currentRow: null })}
      />
    </>
  );
};

export default FreightTaskConfiguration;

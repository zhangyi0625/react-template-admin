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
import { SearchForm, SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import type {
  ShipownerEncyclopediaType,
  ShippingCompanyZoneParams,
  ShippingCompanyZoneType,
} from '@/services/websiteInfo/websiteInfoModel';
import AddShippingCompanyZone from './AddShippingCompanyZone';
import ShipownerEncyclopedia from './ShipownerEncyclopedia';
import {
  addShippingCompanyZone,
  deleteShippingCompanyZone,
  getShipownerEncyclopedia,
  getShippingCompanyZoneByPage,
  updateShipownerEncyclopedia,
  updateShippingCompanyZone,
} from '@/services/websiteInfo/websiteInfoApi';
import { ShippingCompanyZoneColumns } from './config';
import { filterKeys } from '@/utils/tool';

const ShippingCompanyZone: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ShippingCompanyZoneParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: {},
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: ShippingCompanyZoneType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const [encyclopediaParams, setEncyclopediaParams] = useState<{
    visible: boolean;
    currentRow: ShipownerEncyclopediaType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '船司代码',
      width: 80,
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: '船司名称',
      dataIndex: 'name',
      width: 120,
      align: 'center',
    },
    {
      title: '船司简称',
      dataIndex: 'shortName',
      width: 120,
      align: 'center',
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={12}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              编辑
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
              color="danger"
              variant="outlined"
            >
              删除
            </Button>
            <Button
              color="default"
              variant="outlined"
              onClick={() => loadEncyclopediaInfo(_.id)}
            >
              船司百科
            </Button>
          </Space>
        );
      },
    },
  ];

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除船司',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该船司吗？数据删除后将无法恢复！',
      onOk() {
        deleteShippingCompanyZone(id).then(() => {
          message.success('删除成功～');
          // 刷新表格数据
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onUpdateSearch = (info?: ShippingCompanyZoneParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => value !== undefined)
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize'],
      true
    );

    setSearchDefaultForm({
      ...pageInfo,
      filter: JSON.stringify(filteredObj),
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };

  const onEditOk = async (currentRow: ShippingCompanyZoneType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addShippingCompanyZone(currentRow);
      } else {
        // 编辑数据
        await updateShippingCompanyZone(currentRow, currentRow.id as string);
      }
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null });
      message.success(!currentRow?.id ? '添加成功～' : '修改成功～');
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      setParams({ visible: false, currentRow: null });
    }
  };

  const loadEncyclopediaInfo = async (id: string) => {
    const resp = await getShipownerEncyclopedia(id);
    setEncyclopediaParams({ visible: true, currentRow: resp });
  };

  const editOkShipownerEncyclopedia = async (
    info: ShipownerEncyclopediaType
  ) => {
    try {
      await updateShipownerEncyclopedia(info, info.id);
      message.success('修改成功～');
      setEncyclopediaParams({ visible: false, currentRow: null });
    } catch (error) {
      setEncyclopediaParams({ visible: false, currentRow: null });
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
            columns={ShippingCompanyZoneColumns}
            gutterWidth={24}
            iconHidden={true}
            labelPosition="left"
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
        {/* 操作按钮 */}
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          bordered
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getShippingCompanyZoneByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddShippingCompanyZone
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, currentRow: null })}
      />
      <ShipownerEncyclopedia
        params={encyclopediaParams}
        onCancel={() =>
          setEncyclopediaParams({ visible: false, currentRow: null })
        }
        onOk={editOkShipownerEncyclopedia}
      />
    </>
  );
};

export default ShippingCompanyZone;

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
import {
  addShippingCompanyPort,
  deleteShippingCompanyPort,
  getShippingCompanyPortListByPage,
  putShippingCompanyPort,
} from '@/services/portManage/shippingCompanyPort/shippingCompanyPortApi';
import type {
  ShippingCompanyPortSearchFilterParams,
  ShippingCompanyPortSearchParams,
  ShippingCompanyPortType,
} from '@/services/portManage/shippingCompanyPort/shippingCompanyPortModel';
import { ShippingCompanyPortSearchColumns } from '../config';
import AddShippingCompanyPort from './AddShippingCompanyPort';
import { filterKeys } from '@/utils/tool';

const ShippingCompanyPort: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ShippingCompanyPortSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: ShippingCompanyPortType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '船司',
      dataIndex: 'carrier',
      width: 100,
      align: 'center',
    },
    {
      title: '船司港口代码',
      width: 150,
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: '船司港口名',
      dataIndex: 'name',
      width: 150,
      align: 'center',
    },
    {
      title: '对应我司港口',
      width: 250,
      align: 'center',
      render(value) {
        return (
          value.locationId && (
            <div>
              {value.locationLocalName} - {value.locationName},{value.unlocode}
            </div>
          )
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 180,
      render(_) {
        return (
          <Space>
            <Button
              size="middle"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              设置
            </Button>
            <Button
              size="middle"
              variant="solid"
              color="danger"
              onClick={() => deletePort(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const onUpdateSearch = (
    info?: ShippingCompanyPortSearchFilterParams | unknown
  ) => {
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

  const deletePort = (id: string) => {
    modal.confirm({
      title: '删除船司港口',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该船司港口吗？数据删除后将无法恢复！',
      onOk() {
        deleteShippingCompanyPort(id).then(() => {
          message.success('删除成功～');
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onEditOk = async (editRow: ShippingCompanyPortType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addShippingCompanyPort(editRow);
      } else {
        // 编辑数据
        await putShippingCompanyPort(editRow);
      }
      message.success(!editRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, currentRow: null });
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={ShippingCompanyPortSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 16 },
                sm: { span: 8 },
              },
              wrapperCol: {
                xs: { span: 2 },
                sm: { span: 22 },
              },
            }}
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
            新增船司港口
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
          fetchData={getShippingCompanyPortListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddShippingCompanyPort
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default ShippingCompanyPort;

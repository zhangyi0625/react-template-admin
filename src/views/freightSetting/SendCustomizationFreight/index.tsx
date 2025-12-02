import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { SendCustomizationFreightSearchColumns } from '../config';
import {
  addSendCustomizationFreight,
  deleteSendCustomizationFreight,
  getSendCustomizationFreightListByPage,
  putSendCustomizationFreight,
} from '@/services/freightSetting/sendCustomizationFreight/sendCustomizationFreightApi';
import useParentSize from '@/hooks/useParentSize';
import type {
  SendCustomizationFreightSearchFilterParams,
  SendCustomizationFreightSearchParams,
  SendCustomizationFreightType,
} from '@/services/freightSetting/sendCustomizationFreight/sendCustomizationFreightModel';
import AddSendCustomizationFreight from './AddSendCustomizationFreight';
import { filterKeys } from '@/utils/tool';
import useCacheData from '@/hooks/useCacheData';

const SendCustomizationFreight: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<SendCustomizationFreightSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData'],
    formMap: SendCustomizationFreightSearchColumns,
  });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: SendCustomizationFreightType | null;
  }>({ visible: false, currentRow: null });

  useEffect(() => {}, [essential]);

  const columns: TableProps['columns'] = [
    {
      dataIndex: 'affiliateName',
      title: '公司名称',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'customerName',
      title: '用户名称',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'email',
      title: '发送邮箱',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'execTime',
      title: '设置发送时间',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'updated',
      title: '更新时间',
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
      title: '删除定制运价',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该定制运价吗？数据删除后将无法恢复！',
      onOk() {
        deleteSendCustomizationFreight(id).then(() => {
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onUpdateSearch = (
    info?: SendCustomizationFreightSearchFilterParams | unknown
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

  const onEditOk = async (customerRow: SendCustomizationFreightType) => {
    try {
      if (params.currentRow == null) {
        await addSendCustomizationFreight(customerRow);
      } else {
        await putSendCustomizationFreight(customerRow);
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
            columns={SendCustomizationFreightSearchColumns}
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
            新增定制运价
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
          fetchData={getSendCustomizationFreightListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddSendCustomizationFreight
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default SendCustomizationFreight;

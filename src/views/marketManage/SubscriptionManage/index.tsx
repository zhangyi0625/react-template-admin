import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { useSearchParams } from 'react-router-dom';
import { SubscriptionManageSearchColumns } from './config';
import type {
  SubscriptionManageFilterParams,
  SubscriptionManageParams,
} from '@/services/marketManage/subscriptionManage/subscriptionManageModel';
import {
  deleteSubscription,
  getSubscriptionManageByPage,
  updateSubscriptionEnable,
  updateSubscriptionSuspend,
} from '@/services/marketManage/subscriptionManage/subscriptionManageApi';
import { filterKeys } from '@/utils/tool';
import useParentSize from '@/hooks/useParentSize';
import { formatTime } from '@/utils/format';

const SubscriptionManage: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [formMaps, setFormMaps] = useState(SubscriptionManageSearchColumns);

  const [immediate, setImmediate] = useState<boolean>(true);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<SubscriptionManageParams>({
      pageIndex: 1,
      pageSize: 10,
    });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    formMaps.map((item) => {
      if (item.name === 'customerId' && item.apiByUrlParams) {
        item.defaultValue = searchParams.get('customerName');
        Reflect.set(
          item.apiByUrlParams,
          'keyword',
          searchParams.get('customerName'),
        );
        setSearchDefaultForm({
          ...searchDefaultForm,
          filter: {
            ...searchDefaultForm.filter,
            customerId: searchParams.get('customerId') as string,
          } as SubscriptionManageFilterParams,
        });
      }
    });
    setFormMaps([...formMaps]);
    setTimeout(() => {
      setImmediate(false);
    }, 500);
  }, [searchParams]);

  const columns: TableProps['columns'] = [
    {
      title: '公司名称',
      dataIndex: 'affiliateName',
      width: 100,
      align: 'center',
    },
    {
      title: '操作用户',
      dataIndex: 'customerName',
      width: 100,
      align: 'center',
    },
    {
      title: '起运港',
      width: 200,
      align: 'center',
      render(value) {
        return (
          <div>
            <p>{value.por?.localName}</p>
            <p>
              {value.por?.name},{value.por?.countryCode}
            </p>
          </div>
        );
      },
    },
    {
      title: '目的港',
      width: 200,
      align: 'center',
      render(value) {
        return (
          <div>
            <p>{value.fnd?.localName}</p>
            <p>
              {value.fnd?.name},{value.fnd?.countryCode}
            </p>
          </div>
        );
      },
    },
    {
      title: '箱型',
      dataIndex: 'containerType',
      width: 100,
      align: 'center',
    },
    {
      title: '船司',
      dataIndex: 'carrier',
      width: 100,
      align: 'center',
    },
    {
      title: '订阅状态',
      width: 100,
      align: 'center',
      render(value) {
        return <div>{!value.isDisable ? '订阅中' : '暂停订阅'}</div>;
      },
    },
    {
      title: '订阅时间',
      width: 150,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.notified, 'Y/M/D')}</div>;
      },
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              color="red"
              variant="filled"
              onClick={() => delSubscription(_.id)}
            >
              删除
            </Button>
            <Button
              color="blue"
              variant="filled"
              onClick={() => changeStatus(_.id, _.isDisable)}
              className="ml-[10px]"
            >
              {_.isDisable ? '开启' : '暂停'}
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (info?: SubscriptionManageParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined,
      ),
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize'],
      true,
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

  const delSubscription = (id: string) => {
    modal.confirm({
      title: '删除订阅',
      icon: <ExclamationCircleFilled />,
      content: '确定删除这条订阅吗？数据删除后将无法恢复！',
      onOk() {
        deleteSubscription(id).then(() => {
          // 刷新表格数据
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const changeStatus = async (id: string, status: number) => {
    try {
      !status
        ? await updateSubscriptionSuspend(id)
        : updateSubscriptionEnable(id);
      message.success(!status ? '已暂停订阅～' : '已开启订阅～');
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch {
      setSearchDefaultForm({ ...searchDefaultForm });
    }
  };
  return (
    <>
      <ConfigProvider>
        {!immediate && (
          <Card>
            <SearchForm
              columns={formMaps}
              gutterWidth={24}
              labelPosition="left"
              btnSeparate={false}
              defaultFormItemLayout={{
                labelCol: {
                  xs: { span: 17 },
                  sm: { span: 7 },
                },
                wrapperCol: {
                  xs: { span: 4 },
                  sm: { span: 20 },
                },
              }}
              iconHidden={true}
              isShowReset={true}
              isShowExpend={false}
              onUpdateSearch={onUpdateSearch}
            />
          </Card>
        )}
      </ConfigProvider>
      {!immediate && (
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          <SearchTable
            size="small"
            columns={columns}
            style={{ marginTop: '8px' }}
            pageIndexKey="pageIndex"
            pageSizeKey="pageSize"
            scroll={{ x: 'max-content', y: height - 128 }}
            rowKey="id"
            totalKey="total"
            fetchResultKey="entries"
            isPagination={true}
            fetchData={getSubscriptionManageByPage}
            searchFilter={searchDefaultForm}
            isSelection={false}
            onUpdatePagination={onUpdatePagination}
          />
        </Card>
      )}
    </>
  );
};

export default SubscriptionManage;

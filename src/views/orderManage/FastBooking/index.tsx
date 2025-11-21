import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TableProps,
  type TablePaginationConfig,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import {
  downFastOrder,
  downOrderResult,
  getFastBooingByPage,
} from '@/services/orderManage/fastBooking/fastBookingApi';
import useParentSize from '@/hooks/useParentSize';
import type { RegularBookingSearchParams } from '@/services/orderManage/regularBooking/regularBookingModel';
import { filterKeys } from '@/utils/tool';
import { FastBookingSearchColumns, FastBookingStatus } from './config';
import { formatTime } from '@/utils/format';

const FastBooking: React.FC = () => {
  const navigate = useNavigate();

  const { message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<RegularBookingSearchParams>({
      pageIndex: 1,
      pageSize: 20,
      filter: {
        genres: 'FASTBOOKING',
      },
    });

  const [selected, setSelected] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const columns: TableProps['columns'] = [
    {
      dataIndex: 'no',
      title: '订单号',
      align: 'center',
    },
    {
      dataIndex: 'affiliateName',
      title: '公司名称',
      align: 'center',
    },
    {
      dataIndex: 'customerName',
      title: '用户名',
      align: 'center',
    },
    {
      title: '订单状态',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <div>
            {
              FastBookingStatus?.find((item) => item.value === value.status)
                ?.label
            }
          </div>
        );
      },
    },
    {
      title: '船公司',
      align: 'center',
      width: 80,
      render(value) {
        return <div>{value.content.carrier[0]}</div>;
      },
    },
    {
      title: '起运港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value.content?.por?.localName ?? '-'}</p>
            <p>{value.content?.por?.name ?? '-'}</p>
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
            <p>{value.content?.fnd?.localName ?? '-'}</p>
            <p>{value.content?.fnd?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '开航起止日期',
      align: 'center',
      render(value) {
        return (
          <div>
            {formatTime(value.content?.etdStart, 'M-D')} 至
            {formatTime(value.content?.etdEnd, 'M-D')}
          </div>
        );
      },
    },
    {
      title: '订单修改时间',
      align: 'center',
      render(value) {
        return <div>{formatTime(value.updated, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '箱型/箱量/票',
      width: 250,
      align: 'center',
      render(value) {
        return value.content?.items.map((item: any, index: number) => (
          <div key={index}>
            {item.containerType} * {item.containerQuantity}
            {item.orderNum ? (
              <span className="mx-[8px]">{item.orderNum} 票</span>
            ) : null}
          </div>
        ));
      },
    },
    {
      title: '价格上限',
      width: 250,
      align: 'center',
      render(value) {
        return value.content?.items.map((item: any, index: number) => (
          <div key={index}>
            {item.containerType}
            {item.priceLimit.TOTAL && item.rose >= 0 ? (
              <span>
                $ {item.priceLimit.TOTAL['USD']}
                <span className="mx-[10px]">拍一手价,允许涨幅{item.rose}</span>
                <span></span>
              </span>
            ) : item.rose === 0 && !item.priceLimit.TOTAL ? (
              <span>一手价</span>
            ) : (
              <span>拍一手价，允许涨幅{item.rose}</span>
            )}
          </div>
        ));
      },
    },
    {
      dataIndex: 'deadline',
      title: '预计放舱时间',
      align: 'center',
    },
    {
      title: '订舱通道',
      align: 'center',
      width: 120,
      render(value) {
        return (
          <div>
            {value.status === 'PENDING'
              ? '-'
              : value.api
              ? 'API极虎'
              : '自有订舱'}
          </div>
        );
      },
    },
    {
      title: '备注',
      width: 130,
      align: 'center',
      render(value) {
        return <div>{value.content?.remark}</div>;
      },
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      render(_) {
        return (
          <Space>
            <Button
              size="middle"
              onClick={() => navigate(`/orderManage/fastBooking/${_.id}`)}
            >
              查看
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (info?: RegularBookingSearchParams | unknown) => {
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

  const exportTableData = async (type: string) => {
    if (selected.length === 0) {
      message.error('请至少选择一条要导出的订单');
      return;
    }
    setLoading(true);
    try {
      const resp =
        type === 'table'
          ? await downFastOrder({ ids: selected.join(',') })
          : await downOrderResult({ ids: selected.join(',') });
      const content = resp.data;
      const blob = new Blob([content], {
        type: 'application/vnd.ms-excel',
      });
      const elink = document.createElement('a');
      elink.download = `(${type} !== 'table' ? 拍舱结果 : '光速预定列表').xlsx`;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
    } catch {
      setLoading(false);
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={FastBookingSearchColumns}
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
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={loading}
            onClick={() => exportTableData('table')}
          >
            导出列表
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={loading}
            onClick={() => exportTableData('result')}
          >
            导出订单结果
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
          fetchData={getFastBooingByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options) => setSelected(options)}
        />
      </Card>
    </>
  );
};

export default FastBooking;

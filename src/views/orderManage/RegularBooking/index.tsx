import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RegularBookingDetailSearchColumns } from './config';
import { RootState } from '@/stores/store';
import useParentSize from '@/hooks/useParentSize';
import type { RegularBookingSearchParams } from '@/services/orderManage/regularBooking/regularBookingModel';
import { getRegularBookingByPage } from '@/services/orderManage/regularBooking/regularBookingApi';
import { formatTime } from '@/utils/format';
import { filterKeys, getPublicSettingByKey } from '@/utils/tool';

const RegularBooking: React.FC = () => {
  const navigate = useNavigate();

  const { parentRef, height } = useParentSize();

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<RegularBookingSearchParams>({
      pageIndex: 1,
      pageSize: 20,
    });

  const [formMaps, setFormMaps] = useState(RegularBookingDetailSearchColumns);

  const columns: TableProps['columns'] = [
    {
      dataIndex: 'orderNo',
      title: '订单号',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'affiliateName',
      title: '公司名称',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'customerName',
      title: '用户名',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'phone',
      title: '手机号',
      align: 'center',
      width: 120,
    },
    {
      title: '订单分类',
      align: 'center',
      width: 100,
      render(value) {
        return publicData['serviceType'][value.type];
      },
    },
    {
      title: '舱位分类',
      align: 'center',
      width: 100,
      render(value) {
        return publicData['productChannel'][value.productChannel];
      },
    },
    {
      title: '订单状态',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <div>
            <p>{publicData['frtOrderStatus'][value.status]}</p>
            <p>
              {value.status === 'CLOSURE' ? (
                <span
                  style={{
                    color:
                      value.refundStatus && value.refundStatus === 'SUCCESS'
                        ? 'yellowgreen'
                        : 'brown',
                  }}
                >
                  {!value.refundStatus
                    ? ''
                    : value.refundStatus === 'SUCCESS'
                    ? '退款成功'
                    : '退款失败'}
                </span>
              ) : null}
            </p>
          </div>
        );
      },
    },
    {
      title: '取消状态',
      align: 'center',
      width: 100,
      render(value) {
        return publicData['frtOrderCancel'][value.cancelStatus];
      },
    },
    {
      title: '起运港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value.por?.localName ?? '-'}</p>
            <p>{value.por?.name ?? '-'}</p>
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
            <p>{value.fnd?.localName ?? '-'}</p>
            <p>{value.fnd?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.createTime, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      render(_) {
        return (
          <Space size={0}>
            <Button
              size="middle"
              onClick={() => navigate(`/orderManage/regularBooking/${_.id}`)}
            >
              查看
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    formMaps.map((item) => {
      if (item.formType === 'normalSelect' && item.publicSettingKey) {
        item.options = getPublicSettingByKey(item.publicSettingKey, publicData);
      }
    });
    setFormMaps([...formMaps]);
  }, []);

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
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={RegularBookingDetailSearchColumns}
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
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '10px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 128 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getRegularBookingByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default RegularBooking;

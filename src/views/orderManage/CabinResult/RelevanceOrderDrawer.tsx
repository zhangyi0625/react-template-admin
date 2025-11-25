import { memo, useEffect, useState } from 'react';
import {
  Drawer,
  Space,
  Button,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { RegularBookingSearchParams } from '@/services/orderManage/regularBooking/regularBookingModel';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { getFastBooingByPage } from '@/services/orderManage/fastBooking/fastBookingApi';
import { RelevanceOrderOptions } from './config';
import { formatTime } from '@/utils/format';

export type RelevanceOrderDrawerType = {
  relevance: {
    visible: boolean;
    affiliateId: string | null;
  };
  onOk: (e: string[]) => void;
  onCancel: () => void;
};

const RelevanceOrderDrawer: React.FC<RelevanceOrderDrawerType> = memo(
  ({ relevance, onCancel, onOk }) => {
    const { visible, affiliateId } = relevance;

    const [selected, setSelected] = useState<string[]>([]);

    const [immediate, setImmediate] = useState<boolean>(true);

    const [searchDefaultForm, setSearchDefaultForm] =
      useState<RegularBookingSearchParams>({
        pageIndex: 1,
        pageSize: 10,
        filter: {
          affiliateId: null,
        },
      });

    useEffect(() => {
      setImmediate(true);
      if (!visible) return;
      else {
        setSearchDefaultForm({
          pageIndex: 1,
          pageSize: 10,
          filter: { affiliateId: affiliateId as string },
        });
        setImmediate(false);
      }
    }, [visible]);

    const columns: TableProps['columns'] = [
      {
        dataIndex: 'no',
        title: '订单号',
        align: 'center',
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
        title: '箱型/箱量/票',
        width: 250,
        align: 'center',
        render(text) {
          return (
            text.content?.items &&
            text.content?.items.map((item: any, index: number) => (
              <div key={index}>
                {item.containerType} * {item.containerQuantity}
                {item.orderNum ? (
                  <span className="mx-[8px]">{item.orderNum} 票</span>
                ) : null}
              </div>
            ))
          );
        },
      },
      {
        title: '价格上限',
        width: 250,
        align: 'center',
        render(text) {
          return (
            text.content?.items &&
            text.content?.items.map((item: any, index: number) => (
              <div key={index}>
                {item.containerType}
                {item.priceLimit.TOTAL && item.rose >= 0 ? (
                  <span>
                    $ {item.priceLimit.TOTAL['USD']}
                    <span className="mx-[10px]">
                      拍一手价,允许涨幅{item.rose}
                    </span>
                    <span></span>
                  </span>
                ) : item.rose === 0 && !item.priceLimit.TOTAL ? (
                  <span>一手价</span>
                ) : (
                  <span>拍一手价，允许涨幅{item.rose}</span>
                )}
              </div>
            ))
          );
        },
      },
      {
        title: '备注',
        key: 'remark',
        width: 130,
        align: 'center',
        render(text) {
          return <div>{text.content?.remark}</div>;
        },
      },
    ];

    const onUpdatePagination = (pagination: TablePaginationConfig) => {
      setSearchDefaultForm({
        ...searchDefaultForm,
        pageIndex: pagination.current as number,
        pageSize: pagination.pageSize as number,
      });
      setImmediate(false);
    };

    const onUpdateSearch = (
      info?: Pick<RegularBookingSearchParams, 'filter'> | unknown
    ) => {
      const filteredObj = Object.fromEntries(
        Object.entries(info ?? {}).filter(([, value]) => !!value)
      );
      setSearchDefaultForm({
        ...searchDefaultForm,
        filter: {
          ...filteredObj,
          affiliateId: affiliateId,
        },
      });
    };

    return (
      <Drawer
        title="关联订单"
        width={700}
        open={visible}
        closeIcon={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
        }
        onClose={onCancel}
        classNames={{ footer: 'text-right' }}
        footer={
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={() => onOk(selected)}>
              确定
            </Button>
          </Space>
        }
      >
        <SearchForm
          columns={RelevanceOrderOptions}
          gutterWidth={24}
          labelPosition="left"
          btnSeparate={false}
          iconHidden={false}
          isShowReset={false}
          isShowExpend={false}
          onUpdateSearch={onUpdateSearch}
        />
        <SearchTable
          size="small"
          columns={columns}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: 488 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          fetchData={getFastBooingByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          immediate={immediate}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelected(options)}
        />
      </Drawer>
    );
  }
);

export default RelevanceOrderDrawer;

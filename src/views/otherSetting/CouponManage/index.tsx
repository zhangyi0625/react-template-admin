import { useCallback, useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  SelectProps,
  Space,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import {
  addCouponManage,
  deleteCouponManage,
  getCouponManageByList,
  putCouponProvider,
  updateCouponManage,
} from '@/services/otherSetting/couponManage/couponManageApi';
import type {
  CouponManageEditType,
  CouponProvideType,
} from '@/services/otherSetting/couponManage/couponManageModel';
import type { DefaultPaging } from '@/types/global';
import CouponManageModal from './components/CouponManageModal';
import CouponProvideDetailModal from './CouponProvideDetailModal';
import CouponProviderDrawer from './CouponProviderDrawer';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { formatTime } from '@/utils/format';
import useCacheData from '@/hooks/useCacheData';
import { replaceObjectName } from '@/utils/tool';
import { getSystemAreaOptions } from '@/services/system/basicData/basicDataApi';

type ValueTxtRulesType = {
  type: 'orderTypes' | 'productChannels' | 'porIds' | 'routes';
  returnTxt: (value: CouponManageEditType) => string;
};

const CouponManage: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<DefaultPaging>({
    pageIndex: 1,
    pageSize: 10,
  });

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const [routeData, setRouteData] = useState<SelectProps['options']>([]);

  const { essential } = useCacheData({
    cacheEssentialKeys: ['portData'],
    promiseFilter: {
      portData: {
        keyword: '',
        tag: 'POR',
      },
    },
  });

  const [providerParams, setProviderParams] = useState<{
    visible: boolean;
    id: string;
  }>({
    visible: false,
    id: '',
  });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: CouponManageEditType | null;
    view: boolean;
  }>({
    visible: false,
    currentRow: null,
    view: false,
  });

  useEffect(() => {}, [essential]);

  useEffect(() => {
    loadRouteData();
  }, []);

  const loadRouteData = async () => {
    const resp = await getSystemAreaOptions({ parentId: 0 });
    const newArr = replaceObjectName(
      resp,
      ['code', 'name'],
      ['value', 'label']
    ) as SelectProps['options'];
    setRouteData(newArr);
  };

  const valueTxtRules: ValueTxtRulesType[] = [
    {
      type: 'orderTypes',
      returnTxt: (value: CouponManageEditType) => {
        return value.orderTypes === 'BOOKING' ? '现舱订单' : '预定订单';
      },
    },
    {
      type: 'productChannels',
      returnTxt: (value: CouponManageEditType) => {
        return value.productChannels === 'CARRIER' ? '船公司舱位' : '庄家舱位';
      },
    },
    {
      type: 'porIds',
      returnTxt: (value: CouponManageEditType) => {
        return (
          essential['portData']?.find(
            (item: { id: string }) => item.id.toString() === value.porIds
          )?.localName ?? '' + '出口'
        );
      },
    },
    {
      type: 'routes',
      returnTxt: (value: CouponManageEditType) => {
        return (
          (routeData || []).find((item) => item.value === value.routes)?.name +
          '航线'
        );
      },
    },
  ];

  const useFinished = useCallback((item: CouponManageEditType) => {
    if (
      item.distribute.type === 'LINK' ||
      item.distribute.type === 'TRIGGER_EVENT'
    ) {
      return item.distributeNum &&
        item.distributeNum >= (item.distribute.totalNum ?? 0)
        ? true
        : false;
    }
  }, []);

  const useExpired = useCallback((item: CouponManageEditType) => {
    if (
      item.distribute.type === 'LINK' ||
      item.distribute.type === 'TRIGGER_EVENT'
    ) {
      return (
        item.distribute.taskValidTo &&
        new Date().getTime() > new Date(item.distribute.taskValidTo).getTime()
      );
    }
  }, []);

  const getValueTxt = (value: CouponManageEditType, setMap: string[]) => {
    valueTxtRules.map((item) => {
      if (value[item.type] && item.returnTxt(value)) {
        setMap.push(item.returnTxt(value));
      }
    });
  };

  const columns: TableProps['columns'] = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
      width: 150,
      align: 'center',
    },
    {
      title: '类型',
      width: 200,
      align: 'center',
      render(value) {
        return value.discount.type === 'CTN' ? (
          <div>每柜减{value.discount.amount}</div>
        ) : (
          <div>
            满{value.discount.threshold}减{value.discount.amount}
          </div>
        );
      },
    },
    {
      title: '应用范围',
      width: 100,
      align: 'center',
      render(value) {
        return <div>{publicData?.couponApplyRange[value.applyRange]}</div>;
      },
    },
    {
      title: '使用人群',
      width: 100,
      align: 'center',
      render(value) {
        let customerLevel = publicData?.customerLevel || [];
        return !value.customerLevel ? (
          '不限'
        ) : (
          <div>{customerLevel[value.customerLevel]}</div>
        );
      },
    },
    {
      title: '使用条件',
      width: 200,
      align: 'center',
      render(value) {
        let valueTxt: string[] = [];
        getValueTxt(value, valueTxt);
        return !valueTxt.length ? '全品类' : '仅限' + valueTxt.join('、');
      },
    },
    {
      title: '使用有效时间',
      width: 180,
      align: 'center',
      render(value) {
        return value.validRule.type === 'ABSOLUTE' ? (
          <div>{formatTime(value.validRule.validTo, 'Y-M-D')}</div>
        ) : (
          <div>自领取后的{value.validRule.validDay}日</div>
        );
      },
    },
    {
      title: '发放形式',
      width: 220,
      align: 'center',
      render(value) {
        return value.distribute.type === 'CUSTOMER_LIST' ? (
          <div>
            部分人群即时发放
            <span
              className="text-blue-500 cursor-pointer font-semibold ml-[6px]"
              onClick={() => setProviderParams({ visible: true, id: value.id })}
            >
              +添加
            </span>
          </div>
        ) : value.distribute.type === 'LINK' ? (
          <div>
            链接领取发放
            {!useExpired(value) && !useFinished(value) && (
              <span
                className="text-blue-500 cursor-pointer"
                // onClick={() =>
                //   setParams({ visible: true, currentRow: params.currentRow })
                // }
              >
                复制链接
              </span>
            )}
            {useExpired(value) && (
              <span className="text-red-500 ml-[6px]">已到期</span>
            )}
            {useFinished(value) && (
              <span className="text-red-500 ml-[6px]">已领完</span>
            )}
          </div>
        ) : (
          <div>
            {publicData?.couponTriggerEvent[value.distribute.event]}后发放
            {useExpired(value) && (
              <span className="text-red-500 ml-[6px]">已到期</span>
            )}
          </div>
        );
      },
    },
    {
      title: '优惠券描述',
      dataIndex: 'desc',
      align: 'center',
      width: 180,
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={10}>
            <Button
              type="default"
              variant="solid"
              onClick={() =>
                setParams({ visible: true, currentRow: _, view: true })
              }
            >
              发放详情
            </Button>
            <Button
              type="primary"
              variant="solid"
              onClick={() =>
                setParams({ visible: true, currentRow: _, view: false })
              }
            >
              修改
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
              color="danger"
              variant="outlined"
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
      title: '删除优惠券',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该优惠券吗？数据删除后将无法恢复！',
      onOk() {
        deleteCouponManage(id).then(() => {
          message.success('删除成功～');
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const onEditOk = async (currentRow: CouponManageEditType) => {
    try {
      if (params.currentRow == null) {
        await addCouponManage(currentRow);
      } else {
        await updateCouponManage(currentRow, params.currentRow.id as string);
      }
      message.success(!currentRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, currentRow: null });
    }
  };

  const onProviderCoupon = async (param: CouponProvideType) => {
    try {
      await putCouponProvider(param, providerParams.id);
      message.success('发放成功～');
      setProviderParams({ visible: false, id: '' });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, currentRow: null });
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setParams({ visible: true, currentRow: null, view: false })
              }
            >
              新增优惠券
            </Button>
          </Space>
          <SearchTable
            size="middle"
            columns={columns}
            style={{ marginTop: '8px' }}
            pageIndexKey="pageIndex"
            pageSizeKey="pageSize"
            scroll={{ x: 'max-content', y: height - 158 }}
            rowKey="id"
            totalKey="total"
            fetchResultKey="entries"
            isPagination={true}
            fetchData={getCouponManageByList}
            searchFilter={searchDefaultForm}
            isSelection={false}
            onUpdatePagination={onUpdatePagination}
          />
        </Card>
      </ConfigProvider>
      <CouponProviderDrawer
        params={providerParams}
        onCancel={() =>
          setProviderParams({ ...providerParams, visible: false })
        }
        onOk={onProviderCoupon}
      />
      {!params.view ? (
        <CouponManageModal
          params={params}
          routeData={routeData}
          onCancel={() =>
            setParams({ visible: false, currentRow: null, view: false })
          }
          onOk={onEditOk}
        />
      ) : (
        <CouponProvideDetailModal
          params={params}
          onCancel={() =>
            setParams({ visible: false, currentRow: null, view: false })
          }
        />
      )}
    </>
  );
};

export default CouponManage;

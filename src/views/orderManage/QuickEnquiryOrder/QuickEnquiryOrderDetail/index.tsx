import React, { useEffect, useState } from 'react';
import {
  App,
  Button,
  Divider,
  Form,
  Input,
  Spin,
  Tabs,
  type TabsProps,
} from 'antd';
import { IconArrival } from '@/assets/icon';
import {
  getQuickEnquiryOrderEvents,
  getQuickEnquiryOrderRecords,
  postQuickEnquiryOrderNotifyMsg,
  putQuickEnquiryOrderCancel,
} from '@/services/orderManage/quickEnquiryOrder/quickEnquiryOrderApi';
import type {
  QuickEnquiryOrderDetailType,
  QuickEnquiryOrderEventItemType,
} from '@/services/orderManage/quickEnquiryOrder/quickEnquiryOrderModel';
import QuickEnquiryOrderEvents from './QuickEnquiryOrderEvents';
import QuickEnquiryOrderModal from './QuickEnquiryOrderModal';
import { QuickEnquiryOrderStatusOptions } from '../config';
import { safeJsonParse } from '@/utils/tool';

export type QuickEnquiryOrderDetailProps = {};

type QuickEnquiryOrderBaseOptionsType = {
  label: string;
  key: string;
  getContent: (detail: QuickEnquiryOrderDetailType) => React.ReactNode | string;
};

const QuickEnquiryOrderDetail: React.FC<
  QuickEnquiryOrderDetailProps
> = ({}) => {
  const { message, modal } = App.useApp();

  const [form] = Form.useForm();

  const [defaultActiveKey, setDefaultActiveKey] = useState('replyUser');

  const [detail, setDetail] = useState<QuickEnquiryOrderDetailType>();

  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState<QuickEnquiryOrderEventItemType[]>([]);

  const [replayModal, setReplayModal] = useState<{
    visible: boolean;
    content: string;
  }>({ visible: false, content: '' });

  const QuickEnquiryOrderDetailTabs: TabsProps['items'] = [
    {
      label: '回复用户',
      key: 'replyUser',
      children: (
        <>
          <Form form={form}>
            <Form.Item
              name="content"
              rules={[{ required: true, message: '请输入客服消息' }]}
            >
              <Input.TextArea
                placeholder="请输入回复的内容"
                style={{ height: 120 }}
              />
            </Form.Item>
            <Button
              type="primary"
              style={{ float: 'right' }}
              onClick={() => {
                form.validateFields().then(() => {
                  postQuickEnquiryOrderNotifyMsg(
                    form.getFieldsValue(),
                    detail?.no ?? '',
                  ).then(() => {
                    message.success('发送客服消息成功');
                    form.resetFields();
                    refreshRecords();
                  });
                });
              }}
            >
              发送
            </Button>
          </Form>
        </>
      ),
    },

    {
      label: '报价记录',
      key: 'quoteRecord',
      // children: <QuickEnquiryOrderDetailBaseInfo />,
    },
  ];

  const baseOptions: QuickEnquiryOrderBaseOptionsType[] = [
    {
      label: '箱型箱量',
      key: 'containers',
      getContent: (detail) => {
        return Object.keys(detail?.containers ?? {}).map((key) => (
          <span
            key={key}
            className="mr-[4px]"
          >{`${key} * ${detail?.containers[key]}`}</span>
        ));
      },
    },
    {
      label: '品名',
      key: 'commodity',
      getContent: (detail) => detail?.commodity ?? '-',
    },
    {
      label: '毛/体',
      key: 'cargoWeight',
      getContent: (detail) => {
        return `${detail?.cargoWeight ?? '-'}kg/${
          detail?.cargoVolume ?? '-'
        }m³`;
      },
    },
    {
      label: '运输方式',
      key: 'transportType',
      getContent: (detail) =>
        detail?.transportType === 'SEABORNE' ? '海运' : '-',
    },
    {
      label: '优先关注',
      key: 'highlightsDesc',
      getContent: (detail) => detail?.highlightsDesc ?? '-',
    },
    {
      label: '预计货好时间',
      key: 'delivery',
      getContent: (detail) => detail?.delivery ?? '-',
    },
    {
      label: '预计开航时间',
      key: 'etd',
      getContent: (detail) => detail?.etd ?? '-',
    },
    {
      label: '找舱截至时间',
      key: 'validTo',
      getContent: (detail) => detail?.validTo ?? '-',
    },
    {
      label: '船公司',
      key: 'carriers',
      getContent: (detail) => detail?.carriers ?? '-',
    },
    {
      label: '订单创建时间',
      key: 'created',
      getContent: (detail) => detail?.created ?? '-',
    },
    {
      label: '预期总价',
      key: 'desiredTotalPrice',
      getContent: (detail) => detail?.desiredTotalPrice ?? '-',
    },
    {
      label: '特殊要求',
      key: 'remark',
      getContent: (detail) => detail?.remark ?? '-',
    },
    {
      label: '所属公司',
      key: 'affiliateName',
      getContent: (detail) => detail?.affiliateName ?? '-',
    },
    {
      label: '操作人',
      key: 'customerName',
      getContent: (detail) => detail?.customerName ?? '-',
    },
    {
      label: '联系人',
      key: 'name',
      getContent: (detail) => detail?.contact.name ?? '-',
    },
    {
      label: '联系电话',
      key: 'phone',
      getContent: (detail) => detail?.contact.phone ?? '-',
    },
    {
      label: 'qq号',
      key: 'qq',
      getContent: (detail) => detail?.contact.qq ?? '-',
    },
    {
      label: 'wx号',
      key: 'wx',
      getContent: (detail) => detail?.contact.wx ?? '-',
    },
    {
      label: '固定电话',
      key: 'telephone',
      getContent: (detail) => detail?.contact.telephone ?? '-',
    },
    {
      label: '邮箱',
      key: 'email',
      getContent: (detail) => detail?.contact.email ?? '-',
    },
  ];

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  const defaultActiveKeyChange = (key: string) => {
    setDefaultActiveKey(key);
  };

  const getIcon = (suffix: string) => {
    return process.env.RS_STATIC_API + '/static/website/order-status/' + suffix;
  };

  const init = async () => {
    try {
      const info = safeJsonParse(
        sessionStorage.getItem('quickEnquiryOrderDetail') as string,
      );
      setDetail(info);
      refreshRecords(info.no);
      setLoading(false);
    } catch {
      message.error('获取找舱详情失败');
      setLoading(false);
    }
  };

  const refreshRecords = (no?: string) => {
    Promise.all([
      getQuickEnquiryOrderEvents(detail?.no ?? (no as string)),
      getQuickEnquiryOrderRecords(detail?.no ?? (no as string)),
    ]).then((resp) => {
      setEvents(resp[0]?.data ?? []);
    });
  };

  const jumpToCustomerDetail = (key: string) => {
    if (key === 'customerName') {
      window.open(`/marketManage/customerManage/${detail?.customerId}`);
    } else if (key === 'affiliateName') {
      window.open(`/marketManage/affiliateManage/${detail?.affiliateId}`);
    } else return;
  };

  const cancelQuickEnquiryOrder = async () => {
    try {
      await putQuickEnquiryOrderCancel(detail?.no ?? '');
      message.success('取消找舱订单成功');
      refreshRecords();
    } catch {
      message.error('取消找舱订单失败');
    }
  };
  return (
    <>
      <Spin spinning={loading}>
        <div className="flex items-start">
          <div className="flex-1 overflow-hidden">
            <div className="bg-white p-[30px] rounded-[6px]">
              <div className="flex items-center justify-between font-semibold text-3xl">
                <p>
                  {detail?.por?.localName ?? ''} - {detail?.por?.name ?? ''}
                </p>
                <IconArrival className="w-[100px] h-[100px] mr-[10px]" />
                <p>
                  {detail?.fnd?.localName ?? ''} - {detail?.fnd?.name ?? ''}
                </p>
              </div>
              <div className="mt-[10px] font-semibold">
                找舱编号：{detail?.no ?? '-'}
              </div>
              <Divider />
              <div className="grid grid-cols-2 gap-[10px]">
                {baseOptions.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center text-gray-400"
                    onClick={() => jumpToCustomerDetail(item.key)}
                  >
                    {item.label}：
                    <span
                      className={
                        item.key === 'customerName' ||
                        item.key === 'affiliateName'
                          ? 'text-sky-900 underline cursor-pointer'
                          : 'text-stone-900 cursor-default'
                      }
                    >
                      {item.getContent(detail as QuickEnquiryOrderDetailType)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white mt-[10px] px-[20px] py-[16px] rounded-[6px]">
              <Tabs
                items={QuickEnquiryOrderDetailTabs}
                defaultActiveKey={defaultActiveKey}
                onChange={defaultActiveKeyChange}
              />
            </div>
          </div>
          <div className="overflow-hidden ml-[16px] flex-none w-100 h-full">
            <div className="bg-white mb-[10px] rounded-[6px] py-[60px] flex flex-col items-center">
              <img
                src={
                  getIcon(
                    detail?.status === 'UNDERWAY' ? 'prepareBooking' : 'cancel',
                  ) + '-op.png'
                }
                className="w-[58px] h-[58px] m-auto"
                alt=""
              />
              <p className="text-[28px] text-center font-bold text-orange-400 mt-[16px]">
                {
                  (QuickEnquiryOrderStatusOptions || []).find(
                    (item) => item.value === detail?.status,
                  )?.label
                }
              </p>
              <Button
                size="large"
                className={'button cancel-type'}
                onClick={cancelQuickEnquiryOrder}
                hidden={detail?.status !== 'UNDERWAY'}
              >
                取消订单
              </Button>
            </div>
            <QuickEnquiryOrderEvents
              events={events ?? []}
              openReplayModal={(content: string) =>
                setReplayModal({ visible: true, content: content })
              }
            />
          </div>
        </div>
      </Spin>
      <QuickEnquiryOrderModal
        params={replayModal}
        onCancel={() => setReplayModal({ visible: false, content: '' })}
      />
    </>
  );
};

export default QuickEnquiryOrderDetail;

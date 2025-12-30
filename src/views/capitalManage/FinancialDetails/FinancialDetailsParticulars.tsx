import React, { useCallback, useEffect, useState } from 'react';
import {
  Col,
  Form,
  Input,
  Row,
  Tag,
  Select,
  DatePicker,
  type SelectProps,
  Space,
  Button,
} from 'antd';
import type { FinancialDetailsType } from '@/services/capitalManage/financialDetails/financialDetailsModel';
import { getFinancialDetails } from '@/services/capitalManage/financialDetails/financialDetailsApi';
import DragModal from '@/components/modal/DragModal';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import { FinancialDetailsForms } from './config';
import {
  getSearchAffiliate,
  getSearchCustomer,
} from '@/services/orderManage/regularBooking/regularBookingApi';
import { getDepositManage } from '@/services/capitalManage/depositManage/depositManageApi';
import { DepositManageStatusOptions } from '../DepositManage/config';
import { getClientsCapital } from '@/services/capitalManage/clientsCapital/clientsCapitalApi';
import { copyValue, filterKeys } from '@/utils/tool';
import { fetchSystemSearchData } from '@/utils/freight';
import { formatTime } from '@/utils/format';

export type FinancialDetailsParticularsProps = {
  params: {
    visible: boolean;
    type: 'add' | 'view';
    viewSource: 'FinancialDetails' | 'DepositManage' | 'ClientsCapital';
    financialDetailsId: string;
  };
  onCancel: () => void;
  onOk: (params: FinancialDetailsType) => void;
};

type DetailViewOptionsType = {
  label: string;
  key: string;
  value: string | React.FC;
  hidden: boolean;
};

const FundType = ['RECHARGE_ACCOUNT_FUND', 'RECHARGE_BOND'];

const PaymentWay = ['OFFLINE', 'VIRTUAL'];

const FinancialDetailsParticulars: React.FC<
  FinancialDetailsParticularsProps
> = ({ params, onCancel, onOk }) => {
  const { visible, type, viewSource, financialDetailsId } = params;

  const [form] = Form.useForm();

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const [loading, setLoading] = useState<boolean>(false);

  const [formMaps, setFormMaps] = useState(FinancialDetailsForms);

  const [detailInfo, setDetailInfo] = useState<{ [key: string]: string }>({});

  const [customerData, setCustomerData] = useState<{
    customerId: SelectProps['options'];
  }>({
    customerId: [],
  });

  const [affiliateData, setAffiliateData] = useState<{
    affiliateId: SelectProps['options'];
  }>({
    affiliateId: [],
  });

  const getDetailByKey = useCallback(
    (key: string) => {
      return detailInfo[key] ?? '-';
    },
    [detailInfo]
  );

  const detailViewOptions: DetailViewOptionsType[] = [
    {
      label: viewSource === 'FinancialDetails' ? '资金编号' : '提现编号',
      key: 'no',
      value: () => {
        return (
          <div>
            {getDetailByKey('no') ?? ''}
            <Tag style={{ margin: '0 10px' }} onClick={() => copyValue('no')}>
              复制
            </Tag>
          </div>
        );
      },
      hidden: viewSource === 'ClientsCapital',
    },
    {
      label: '交易流水号',
      key: 'tradeNo',
      value: () => {
        return (
          <div>
            {getDetailByKey('tradeNo') ?? ''}
            <Tag
              style={{ margin: '0 10px' }}
              onClick={() => copyValue('tradeNo')}
            >
              复制
            </Tag>
          </div>
        );
      },
      hidden: viewSource !== 'ClientsCapital',
    },
    {
      label: '客户名',
      key: 'affiliateName',
      value: () => {
        return <div>{getDetailByKey('affiliateName') ?? ''}</div>;
      },
      hidden: false,
    },
    {
      label: '用户名',
      key: 'customerName',
      value: () => {
        return <div>{getDetailByKey('customerName') ?? ''}</div>;
      },
      hidden: false,
    },
    {
      label: '手机号',
      key: 'customerPhone',
      value: () => {
        return <div>{getDetailByKey('customerPhone') ?? ''}</div>;
      },
      hidden: false,
    },
    {
      label: viewSource === 'DepositManage' ? '提现金额' : '交易金额',
      key: 'amount',
      value: () => {
        return <div>{getDetailByKey('amount') ?? ''}</div>;
      },
      hidden: false,
    },
    {
      label: '账号余额',
      key: 'balance',
      value: () => {
        return <div>{getDetailByKey('balance') ?? ''}</div>;
      },
      hidden: false,
    },
    {
      label:
        viewSource === 'FinancialDetails'
          ? '资金类型归属'
          : viewSource === 'DepositManage'
          ? '业务归属'
          : '资金类型',
      key: 'fund',
      value: () => {
        let fundSource = publicData['fundSource'];
        return (
          <div>
            {fundSource[getDetailByKey('fund') ?? ''] ??
              getDetailByKey('fundTitle') ??
              ''}
          </div>
        );
      },
      hidden: false,
    },
    {
      label:
        viewSource === 'FinancialDetails'
          ? '创建时间'
          : viewSource === 'DepositManage'
          ? '提现发起时间'
          : '交易创建时间',
      key: 'created',
      value: () => {
        return <div>{getDetailByKey('created') ?? ''}</div>;
      },
      hidden: false,
    },
    {
      label: viewSource === 'FinancialDetails' ? '付款时间' : '提现处理时间',
      key: 'accomplished',
      value:
        getDetailByKey(
          viewSource === 'FinancialDetails' ? 'accomplished' : 'handled'
        ) ?? '',
      hidden: viewSource === 'ClientsCapital',
    },
    {
      label: '付款状态',
      key: 'status',
      value: () => {
        let fundRechargeStatus = publicData['fundRechargeStatus'];
        return <div>{fundRechargeStatus[getDetailByKey('status') ?? '']}</div>;
      },
      hidden: viewSource !== 'FinancialDetails',
    },
    {
      label: viewSource === 'FinancialDetails' ? '付款渠道' : '付款方式',
      key: viewSource === 'ClientsCapital' ? 'type' : 'paymentWay',
      value: () => {
        let paymentWay = publicData['paymentWay'];
        return (
          <div>
            {
              paymentWay[
                getDetailByKey(
                  viewSource === 'ClientsCapital' ? 'type' : 'paymentWay'
                ) ?? ''
              ]
            }
          </div>
        );
      },
      hidden: false,
    },
    {
      label: '付款渠道流水号',
      key: 'paymentNo',
      value: () => {
        return (
          <div>
            {getDetailByKey('paymentNo') ?? ''}
            <Tag
              style={{ margin: '0 10px' }}
              onClick={() => copyValue('paymentNo')}
            >
              复制
            </Tag>
          </div>
        );
      },
      hidden: viewSource !== 'FinancialDetails',
    },
    {
      label: '付款人',
      key: 'paymentPayer',
      value: getDetailByKey('paymentPayer') ?? '',
      hidden: viewSource !== 'FinancialDetails',
    },
    {
      label: '收款人',
      key: 'paymentPayee',
      value: getDetailByKey('paymentPayee') ?? '',
      hidden: viewSource !== 'FinancialDetails',
    },
    {
      label: '付款说明',
      key: 'paymentNote',
      value: getDetailByKey('paymentNote') ?? '',
      hidden: viewSource !== 'FinancialDetails',
    },
    {
      label: '交易类型',
      key: 'paymentPayee',
      value: () => {
        return (
          <div>
            {DepositManageStatusOptions?.find(
              (item) => item.value === getDetailByKey('status')
            )?.label ?? ''}
          </div>
        );
      },
      hidden: viewSource !== 'DepositManage',
    },
    {
      label: '提现操作人',
      key: 'paymentPayee',
      value: getDetailByKey('handledBy') ?? '',
      hidden: viewSource !== 'DepositManage',
    },
    {
      label: '交易内容',
      key: 'tradeTitle',
      value: getDetailByKey('tradeTitle') ?? '',
      hidden: viewSource !== 'ClientsCapital',
    },
    {
      label: '备注',
      key: 'remarks',
      value: getDetailByKey('remarks') ?? '',
      hidden: false,
    },
  ];

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    type === 'add' ? init() : loadDetail();
  }, [visible, type]);

  const init = () => {
    let customerFundType = FundType.map((item) => {
      return {
        label: publicData['fundSource'][item],
        value: item,
      };
    });
    let customerPaymentWay = PaymentWay.map((item) => {
      return {
        label: publicData['paymentWay'][item],
        value: item,
      };
    });
    formMaps.map((item) => {
      if (item.name === 'fundType') item.options = customerFundType;
      else if (item.name === 'paymentWay') item.options = customerPaymentWay;
    });
    setFormMaps([...formMaps]);
    form.setFieldsValue({ fundType: FundType[0], paymentWay: PaymentWay[0] });
    setLoading(false);
  };

  const loadDetail = async () => {
    try {
      const resp =
        viewSource === 'FinancialDetails'
          ? await getFinancialDetails(financialDetailsId)
          : viewSource === 'DepositManage'
          ? await getDepositManage(financialDetailsId)
          : await getClientsCapital(financialDetailsId);
      setDetailInfo(resp);
      setLoading(false);
    } catch {}
  };

  const getFinancialDetailsComp = () => {
    return (
      <>
        <div className="grid gap-y-[10px]">
          {detailViewOptions.map(
            (item) =>
              !item.hidden && (
                <div key={item.key} className="flex items-center text-gray-800">
                  <span className="text-gray-400">{item.label}：</span>
                  <span id={item.key}>
                    {typeof item.value === 'function' ? (
                      <item.value />
                    ) : (
                      item.value
                    )}
                  </span>
                </div>
              )
          )}
        </div>
      </>
    );
  };

  const handleSearch = (newValue: string, type: string) => {
    if (!newValue || !newValue.trim()) return;
    fetchSystemSearchData(
      newValue,
      type,
      type === 'customerId' ? setCustomerData : setAffiliateData,
      type === 'customerId' ? getSearchCustomer : getSearchAffiliate
    );
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...filterKeys(
            form.getFieldsValue(),
            ['created', 'accomplished'],
            false
          ),
          created: formatTime(form.getFieldValue('created'), 'Y-M-D h:m:s'),
          accomplished: formatTime(
            form.getFieldValue('accomplished'),
            'Y-M-D h:m:s'
          ),
        };
        onOk(params);
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  return (
    <>
      <DragModal
        open={visible}
        onCancel={onCancel}
        title={!financialDetailsId ? '新增线下转账' : '资金详细信息'}
        width={{ xl: !financialDetailsId ? 800 : 600, xxl: 1000 }}
        loading={loading}
        footer={
          !financialDetailsId ? (
            <Space>
              <Button type="default" onClick={onCancel}>
                取消
              </Button>
              <Button type="primary" variant="solid" onClick={handleOk}>
                保存
              </Button>
            </Space>
          ) : null
        }
      >
        {!financialDetailsId ? (
          <Form form={form} labelCol={{ span: 6 }}>
            <Form.Item name="id" hidden>
              <Input disabled />
            </Form.Item>
            <Row gutter={24}>
              {formMaps.map((item) => (
                <Col span={item.span} key={item.name}>
                  <Form.Item
                    label={item.label}
                    name={item.name}
                    rules={
                      item.isRules
                        ? [
                            {
                              required: true,
                              message: `请${
                                item.formType === 'input' ? '输入' : '选择'
                              }${item.label}`,
                            },
                          ]
                        : undefined
                    }
                  >
                    {item.formType === 'focusSelect' && (
                      <Select
                        allowClear
                        placeholder={item.customPlaceholder}
                        showSearch
                        defaultActiveFirstOption={false}
                        suffixIcon={null}
                        notFoundContent={null}
                        filterOption={false}
                        onSearch={(value: string) =>
                          handleSearch(value, item.name)
                        }
                        options={(
                          (item.name === 'customerId'
                            ? customerData.customerId
                            : affiliateData.affiliateId) || []
                        ).map((d) => ({
                          value: d.value,
                          label: d.label,
                        }))}
                      />
                    )}
                    {item.formType === 'input' && (
                      <Input
                        placeholder={`请输入${item.label}`}
                        autoComplete="off"
                        allowClear
                      />
                    )}
                    {item.formType === 'normalSelect' && (
                      <Select
                        placeholder={`请选择${item.label}`}
                        filterOption
                        options={item.options}
                        fieldNames={
                          item.selectFieldName ?? {
                            label: 'label',
                            value: 'value',
                          }
                        }
                      />
                    )}
                    {item.formType === 'date-picker' && (
                      <DatePicker
                        style={{ width: '100%' }}
                        format={'YY-MM-DD HH:mm:ss'}
                      />
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        ) : (
          getFinancialDetailsComp()
        )}
      </DragModal>
    </>
  );
};

export default FinancialDetailsParticulars;

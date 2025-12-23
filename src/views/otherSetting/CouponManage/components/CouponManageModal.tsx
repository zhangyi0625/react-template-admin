import { useCallback, useEffect, useState } from 'react';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  type SelectProps,
} from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import DragModal from '@/components/modal/DragModal';
import type { CouponManageEditType } from '@/services/otherSetting/couponManage/couponManageModel';
import { CouponManageForms } from '../config';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import CouponDiscount from './CouponDiscount';
import CouponDistribute from './CouponDistribute';
import CouponValidRule from './CouponValidRule';
import { SystemCabinType, SystemOrderType } from '@/enums/setting';
import useCacheData from '@/hooks/useCacheData';
import { filterKeys, replaceObjectName } from '@/utils/tool';
import { isArray } from 'lodash-es';

export type CouponManageModalProsp = {
  params: {
    visible: boolean;
    currentRow: CouponManageEditType | null;
  };
  routeData: SelectProps['options'];
  onCancel: () => void;
  onOk: (params: CouponManageEditType) => void;
};

type MatchingRulesType = {
  key: string;
  needAll: boolean;
  matchingRulesFun: (
    options?: Record<string, string>
  ) => Promise<SelectProps['options']> | SelectProps['options'];
};

const customerLevel = {
  0: '普通用户',
  1: '周卡',
  2: '企业',
};

const CouponManageModal: React.FC<CouponManageModalProsp> = ({
  params,
  routeData,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [loading, setLoading] = useState<boolean>(false);

  const [formMaps, setFormMaps] = useState(CouponManageForms);

  const { RangePicker } = DatePicker;

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const [form] = Form.useForm();

  const { essential } = useCacheData({
    cacheEssentialKeys: ['portData'],
    promiseFilter: {
      portData: {
        keyword: '',
        tag: 'POR',
      },
    },
  });

  const [discount, setDiscount] = useState<CouponManageEditType['discount']>({
    type: 'AMOUNT',
  });

  const [validRule, setValidRule] = useState<CouponManageEditType['validRule']>(
    {
      type: 'ABSOLUTE',
    }
  );

  const [distribute, setDistribute] = useState<
    CouponManageEditType['distribute']
  >({
    type: 'CUSTOMER_LIST',
  });

  useEffect(() => {}, [essential]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    form.resetFields();
    init();
  }, [visible]);

  const useSystemSelectOptions = useCallback(
    (
      options: Record<string, string> | SelectProps['options'],
      needAll: boolean
    ) => {
      const optionsList = isArray(options)
        ? options
        : (Object.keys(options as Record<string, string>).map((item) => ({
            label: (options as Record<string, string>)[item],
            value: item,
          })) as SelectProps['options']);
      if (needAll) {
        return (optionsList ?? [])
          .concat({
            label: '不限',
            value: '',
          })
          .sort((a, b) =>
            String(a.value ?? '').localeCompare(String(b.value ?? ''))
          );
      }
      return optionsList;
    },
    []
  );

  const getOptionMatchingRules: MatchingRulesType[] = [
    {
      key: 'discountType',
      needAll: false,
      matchingRulesFun: (options) =>
        useSystemSelectOptions(
          publicData?.couponDiscountType ?? options,
          false
        ),
    },
    {
      key: 'applyRange',
      needAll: false,
      matchingRulesFun: (options) =>
        useSystemSelectOptions(publicData?.couponApplyRange ?? options, false),
    },
    {
      key: 'customerLevel',
      needAll: true,
      matchingRulesFun: (options) =>
        useSystemSelectOptions(customerLevel ?? options, true),
    },
    {
      key: 'orderTypes',
      needAll: true,
      matchingRulesFun: (options) =>
        useSystemSelectOptions(SystemOrderType ?? options, true),
    },
    {
      key: 'productChannels',
      needAll: true,
      matchingRulesFun: (options) =>
        useSystemSelectOptions(SystemCabinType ?? options, true),
    },
    {
      key: 'porIds',
      needAll: true,
      matchingRulesFun: () =>
        useSystemSelectOptions(
          replaceObjectName(
            essential['portData'],
            ['id', 'localName'],
            ['value', 'label']
          ) as SelectProps['options'],
          true
        ),
    },
    {
      key: 'routes',
      needAll: true,
      matchingRulesFun: async () => {
        return useSystemSelectOptions(routeData, true);
      },
    },
    {
      key: 'validRuleType',
      needAll: false,
      matchingRulesFun: (options) =>
        useSystemSelectOptions(
          publicData?.couponValidRuleType ?? options,
          false
        ),
    },
    {
      key: 'distributeType',
      needAll: false,
      matchingRulesFun: (options) =>
        useSystemSelectOptions(
          publicData?.couponDistributeType ?? options,
          false
        ),
    },
  ];

  const init = async () => {
    formMaps.map((item) => {
      const matchingRules = getOptionMatchingRules.find(
        (rule) => rule.key === item.name
      );
      if (matchingRules) {
        const result = matchingRules.matchingRulesFun();
        if (result instanceof Promise) {
          result.then((opts) => (item.options = opts ?? []));
        } else {
          item.options = result ?? [];
        }
      }
    });
    setDiscount(
      currentRow?.discount ?? {
        type: 'AMOUNT',
      }
    );
    setValidRule(
      currentRow?.validRule ?? {
        type: 'ABSOLUTE',
      }
    );
    setDistribute(
      currentRow?.distribute ?? {
        type: 'CUSTOMER_LIST',
      }
    );
    form.setFieldsValue({
      applyRange: 'STANDARD',
      customerLevel: '',
      orderTypes: '',
      productChannels: '',
      discountType: currentRow?.discount?.type || 'AMOUNT',
      porIds: '',
      routes: '',
      validRuleType: currentRow?.validRule?.type || 'ABSOLUTE',
      distributeType: currentRow?.distribute?.type || 'CUSTOMER_LIST',
      ...(currentRow ?? {}),
    });
    const newArr = formMaps.filter((item) => !item.hiddenItem);
    setFormMaps([...newArr]);
    setLoading(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...filterKeys(
            form.getFieldsValue(),
            ['applyRange', 'name', 'desc', 'orderTypes'],
            true
          ),
          discount: discount,
          distribute: distribute,
          validRule: validRule,
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
    <DragModal
      open={visible}
      onCancel={onCancel}
      title={!currentRow ? '新增优惠券' : '修改优惠券'}
      width={{ xl: 900, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        labelWrap={true}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {formMaps.map((item) =>
            item.name === 'discountType' ? (
              <Col key={item.name} span={item.span}>
                <CouponDiscount
                  content={discount}
                  items={item}
                  onChangeContent={(value, key) => {
                    setDiscount({ ...discount, [key]: value });
                  }}
                />
              </Col>
            ) : item.name === 'distributeType' ? (
              <Col key={item.name} span={item.span}>
                <CouponDistribute
                  content={distribute}
                  items={item}
                  onChangeContent={(value, key) => {
                    if (typeof value === 'object') {
                      setDistribute({ ...distribute, ...value });
                    } else {
                      setDistribute({ ...distribute, [key]: value });
                    }
                  }}
                />
              </Col>
            ) : item.name === 'validRuleType' ? (
              <Col key={item.name} span={item.span}>
                <CouponValidRule
                  content={validRule}
                  items={item}
                  onChangeContent={(value, key) => {
                    if (typeof value === 'object') {
                      setValidRule({ ...validRule, ...value });
                    } else {
                      setValidRule({ ...validRule, [key]: value });
                    }
                  }}
                />
              </Col>
            ) : (
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
                  {item.formType === 'input' && (
                    <Input
                      allowClear
                      autoComplete="off"
                      placeholder={`请输入${item.label}`}
                    />
                  )}
                  {item.formType === 'textarea' && (
                    <Input.TextArea
                      placeholder={item.customPlaceholder as string}
                      autoComplete="off"
                      allowClear
                    />
                  )}
                  {item.formType === 'normalSelect' && (
                    <Select
                      placeholder={`请选择${item.label}`}
                      filterOption
                      showSearch
                      options={item.options}
                      fieldNames={
                        item.selectFileldName ?? {
                          label: 'label',
                          value: 'value',
                        }
                      }
                    />
                  )}
                  {item.formType === 'radio' && (
                    <Radio.Group
                      options={
                        item.options as CheckboxGroupProps<string>['options']
                      }
                    ></Radio.Group>
                  )}
                  {item.formType === 'date-picker' && (
                    <RangePicker
                      style={{ width: '100%' }}
                      format={'YY-MM-DD HH:mm:ss'}
                    />
                  )}
                </Form.Item>
                {/* {item.name === 'distributeType' && getDistribute()} */}
              </Col>
            )
          )}
        </Row>
      </Form>
    </DragModal>
  );
};

export default CouponManageModal;

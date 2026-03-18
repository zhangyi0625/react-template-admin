import { IconAffiliate, IconEdit, IconEmail, IconPhone } from '@/assets/icon';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  App,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  SelectProps,
  Space,
  TableProps,
} from 'antd';
import type { AffiliateDetailType } from '@/services/marketManage/affiliateManage/affiliateManageModel';
import {
  getAffiliateManageComboPermission,
  updateAffiliateManage,
} from '@/services/marketManage/affiliateManage/affiliateManageApi';
import { SearchTable } from 'customer-search-form-table';
import { AffiliateLevel, AffiliateManageDetailEditForm } from '../../config';
import {
  AffiliateComboPermissionRemark,
  type AffiliateComboPermissionRemarkRef,
} from './AffiliateComboPermissionRemark';
import AffiliateComboPermissionEdit from './AffiliateComboPermissionEdit';
import type { EquityRightsBaseEditType } from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsModel';
import { useSelector } from 'react-redux';
import { store, type RootState } from '@/stores/store';
import { ComboPermission } from '@/enums/setting';
import dayjs from 'dayjs';
import { formatTime } from '@/utils/format';
import { filterKeys } from '@/utils/tool';
import { postEquityRightsEdit } from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsApi';

export type AffiliateBasicInfoProps = {
  detail: AffiliateDetailType;
  onLoadBaseDetail: () => void;
};

const AffiliateBasicInfo: React.FC<AffiliateBasicInfoProps> = memo(
  ({ detail, onLoadBaseDetail }) => {
    const setting = useSelector((state: RootState) => state.publicSetting);

    const { message } = App.useApp();

    const [form] = Form.useForm();

    const AffiliateComboPermissionRemarkRef =
      useRef<AffiliateComboPermissionRemarkRef>(null);

    const { publicData } = store.getState().publicSetting;

    const BasicOptions = [
      {
        label: '客户分类：',
        value: AffiliateLevel?.find((item) => item.value === detail.level)
          ?.label,
      },
      {
        label: '企业类型：',
        value: publicData['customerAffiliateType'][detail.type],
      },
      {
        label: '社会统一信用代码：',
        value: detail.businessCode,
      },
      {
        label: '会员有效期：',
        value: detail.grade?.validTo ?? '',
      },
      {
        label: '子账号限制数：',
        value: detail.customersLimit,
      },
    ];

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [formMaps, setFormMaps] = useState(AffiliateManageDetailEditForm);

    const [tableLoading, setTableLoading] = useState<boolean>(true);

    const [showRemark, setShowRemark] = useState<boolean>(false);

    const [comboPermissionEdit, setComboPermissionEdit] = useState<{
      visible: boolean;
      currentRow: EquityRightsBaseEditType | null;
    }>({
      visible: false,
      currentRow: null,
    });

    const columns: TableProps['columns'] = [
      {
        title: '功能',
        width: 100,
        align: 'center',
        render(value: { module: keyof typeof ComboPermission }) {
          return <div>{ComboPermission[value.module]}</div>;
        },
      },
      {
        title: '查询模式',
        width: 100,
        align: 'center',
        render(value) {
          return (
            <div>{value.limitType === 'DAY' ? '按套餐模式' : '按总数扣除'}</div>
          );
        },
      },
      {
        title: '数量',
        width: 150,
        align: 'center',
        render(value) {
          return value.limitType === 'DAY' ? (
            <div>每个子账号{value.queryLimit}次</div>
          ) : (
            <div> 企业总数剩余{value.queryLimit}条</div>
          );
        },
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
                type="primary"
                size="small"
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                }}
                onClick={() =>
                  setComboPermissionEdit({
                    visible: true,
                    currentRow: filterKeys(
                      _,
                      ['limitType', 'module', 'queryLimit'],
                      true,
                    ),
                  })
                }
              >
                编辑
              </Button>
            </Space>
          );
        },
      },
    ];

    useEffect(() => {
      isEdit && affiliateBasicInfoInit();
      setTableLoading(false);
      formMaps.map((item) => {
        if (item.name === 'type') {
          let newArr: SelectProps['options'] = [];
          for (let key in publicData['customerAffiliateType']) {
            newArr.push({
              label: publicData['customerAffiliateType'][key],
              value: key,
            });
          }
          item.options = newArr;
        }
      });
    }, [detail.id, isEdit]);

    const affiliateBasicInfoInit = () => {
      let params: Record<string, unknown> = {};
      AffiliateManageDetailEditForm.map((item) => {
        if (detail[item.name])
          params[item.name] =
            item.formType === 'date-picker'
              ? dayjs(detail[item.name])
              : detail[item.name];
        else {
          params[item.name] =
            item.formType === 'date-picker'
              ? dayjs(detail[item.ExtraKey as string][item.name])
              : detail[item.ExtraKey as string][item.name];
        }
      });
      isEdit &&
        form.setFieldsValue({
          ...detail,
          ...params,
          enableFreightRealApi: Number(params.enableFreightRealApi),
        });
    };

    const getBasicInfo = () => {
      return (
        <>
          <p className="font-semibold text-base mb-[10px]">基本信息</p>
          <div className="grid grid-cols-2 text-gray-500 gap-y-[10px]">
            {BasicOptions.map((item) => (
              <div key={item.label}>
                {item.label}
                <span className="text-stone-800">{item?.value}</span>
              </div>
            ))}
          </div>
        </>
      );
    };

    const getComboPermission = () => {
      return (
        <>
          <p className="font-semibold text-base mb-[10px]">
            套餐外权限
            <span
              className="text-normal-blue font-medium ml-[12px] underline cursor-pointer text-sm font-normal"
              onClick={() => {
                (setShowRemark(true),
                  AffiliateComboPermissionRemarkRef.current?.onLoadRemark());
              }}
            >
              点击查看套餐内权限及额外购买费用
            </span>
          </p>
          <SearchTable
            size="small"
            columns={columns}
            style={{ marginTop: '8px' }}
            immediate={tableLoading}
            scroll={{ x: 'max-content', y: 178 }}
            rowKey="id"
            totalKey="total"
            fetchResultKey="data"
            isPagination={false}
            fetchData={getAffiliateManageComboPermission}
            searchFilter={{ affiliateId: detail.id }}
            isSelection={false}
            selectionParentType="checkbox"
            onUpdatePagination={() => {}}
          />
        </>
      );
    };

    const handleSave = () => {
      form
        .validateFields()
        .then(() => {
          saveDetail({ ...form.getFieldsValue() });
        })
        .catch((errorInfo) => {
          // 滚动并聚焦到第一个错误字段
          form.scrollToField(errorInfo.errorFields[0].name);
          form.focusField(errorInfo.errorFields[0].name);
        });
    };

    const saveDetail = async (info: AffiliateDetailType) => {
      let params = {
        ...info,
        grade: {
          level: info.level,
        },
        affiliateBusinessConfig: {
          ...filterKeys(
            info,
            [
              ...formMaps.map((item) => {
                if (item.ExtraKey === 'businessConfig') return item.name;
              }),
            ],
            true,
          ),
          enableFreightRealApi: Boolean(info.enableFreightRealApi),
          freightRealApiKeyExpire: formatTime(
            info.freightRealApiKeyExpire,
            'Y-M-D h:m:s',
          ),
        },
        contact: filterKeys(info, ['tel', 'email'], true),
        created: formatTime(info.created, 'Y-M-D h:m:s'),
        validTo: formatTime(info.validTo, 'Y-M-D h:m:s'),
      };
      try {
        await updateAffiliateManage(params, info.id);
        message.success('修改成功～');
        setIsEdit(false);
        onLoadBaseDetail();
      } catch {
        setIsEdit(false);
      }
    };

    const editComboPermission = async (
      currentRow: Omit<EquityRightsBaseEditType, 'affiliateId'>,
    ) => {
      setTableLoading(true);
      try {
        await postEquityRightsEdit({ affiliateId: detail.id, ...currentRow });
        message.success('修改成功～');
        setComboPermissionEdit({ visible: false, currentRow: null });
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      } catch {
        setComboPermissionEdit({ visible: false, currentRow: null });
      }
    };

    return (
      <>
        <div className="bg-white px-[20px] py-[31px] rounded-[6px] w-full">
          {!isEdit ? (
            <>
              <div className="flex items-center justify-between whitespace-nowrap">
                <div className="flex items-center">
                  <IconAffiliate className="w-[26px] h-[26px] mr-[4px]" />
                  <p className="ml-[4px] text-3xl font-medium">{detail.name}</p>
                  <IconEdit
                    width={18}
                    height={18}
                    className="ml-[12px] cursor-pointer"
                    onClick={() => setIsEdit(true)}
                  />
                </div>
                <div className="text-xs text-gray-500 font-normal">
                  创建时间：{formatTime(detail.created, 'Y/M/D h:m:s')}
                </div>
              </div>
              <div className="flex items-center mt-[22px]">
                <p>简称：{detail.shortName}</p>
                {detail.contact.tel && (
                  <div className="flex items-center mx-[30px]">
                    <IconPhone width={18} height={18} className="mr-[2px]" />
                    <span>{detail.contact.tel}</span>
                  </div>
                )}
                {detail.contact.email && (
                  <div className="flex items-center">
                    <IconEmail width={18} height={18} className="mr-[2px]" />
                    <span>{detail.contact.email}</span>
                  </div>
                )}
              </div>
              <Divider dashed />
              {getBasicInfo()}
              <Divider dashed />
              {getComboPermission()}
            </>
          ) : (
            <>
              <p className="font-semibold text-base mb-[10px]">基本信息</p>
              <Form form={form} labelCol={{ span: 8 }} colon={false}>
                <Form.Item name="id" hidden>
                  <Input disabled />
                </Form.Item>
                <Row gutter={24}>
                  {formMaps.map((item, index) => (
                    <Col span={item.span} key={index}>
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
                            placeholder={`请输入${item.label}`}
                            autoComplete="off"
                            allowClear
                          />
                        )}
                        {item.formType === 'input-number' && (
                          <InputNumber
                            placeholder={`请输入${item.label}`}
                            min={0}
                            style={{ width: '100%' }}
                          />
                        )}
                        {item.formType === 'date-picker' && (
                          <DatePicker
                            style={{ width: '100%' }}
                            format={'YY-MM-DD HH:mm:ss'}
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
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </Form>
              <div className="flex items-center justify-center">
                <Button
                  type="default"
                  variant="outlined"
                  style={{ width: '120px' }}
                  onClick={() => setIsEdit(false)}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  variant="outlined"
                  style={{ width: '120px', marginLeft: '10px' }}
                  onClick={handleSave}
                >
                  保存
                </Button>
              </div>
            </>
          )}
        </div>
        <AffiliateComboPermissionRemark
          source="affiliate"
          ref={AffiliateComboPermissionRemarkRef}
          visible={showRemark}
          onCancel={() => setShowRemark(false)}
        />
        <AffiliateComboPermissionEdit
          visible={comboPermissionEdit.visible}
          currentRow={comboPermissionEdit.currentRow}
          onCancel={() =>
            setComboPermissionEdit({ visible: false, currentRow: null })
          }
          onOk={editComboPermission}
        />
      </>
    );
  },
);

export default AffiliateBasicInfo;

import DefaultUserIcon from '@/assets/svg/icon/default-user.svg';
import AffiliateEdit from '@/assets/svg/icon/edit.svg';
import AffiliateEmail from '@/assets/svg/icon/email.svg';
import AffiliateTel from '@/assets/svg/icon/tel.svg';
import styles from '@/views/marketManage/AffiliateManage/AffiliateManage.module.scss';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  App,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
} from 'antd';
import type {
  StaffDetailType,
  StaffManageType,
} from '@/services/marketManage/staffManage/staffManageModel';
import { store } from '@/stores/store';
import {
  getStaffExtraEquityLimit,
  updateStaffManage,
} from '@/services/marketManage/staffManage/staffManageApi';
import {
  AffiliateComboPermissionRemark,
  type AffiliateComboPermissionRemarkRef,
} from '@/views/marketManage/AffiliateManage/components/AffiliateBasicInfo/AffiliateComboPermissionRemark';
import { UserManageDetailEditForm } from '../../config';
import { formatTime } from '@/utils/format';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { filterKeys } from '@/utils/tool';
import { EquityRightsExtraEditType } from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsApi';
import { postEquityRightsExtraEdit } from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsModel';

export type UserBaseInfoProps = {
  detail: StaffDetailType;
  onLoadBaseDetail: () => void;
};

const UserBaseInfo: React.FC<UserBaseInfoProps> = memo(
  ({ detail, onLoadBaseDetail }) => {
    const { message } = App.useApp();

    const [form] = Form.useForm();

    const { Search } = Input;

    const AffiliateComboPermissionRemarkRef =
      useRef<AffiliateComboPermissionRemarkRef>(null);

    const { publicData } = store.getState().publicSetting;

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [formMaps, setFormMaps] = useState(UserManageDetailEditForm);

    const moduleKeys = ['REALTIME_RATE', 'CARGO_TRACE', 'CARRIER_SCHEDULE'];

    const [showRemark, setShowRemark] = useState<boolean>(false);

    const [equityExtraOptions, setEquityExtraOptions] =
      useState<{ module: string; queryLimit: number }[]>();

    const getPermissionsIndexOf = useCallback(
      (type: string) => {
        return detail.permissions.indexOf(type) !== -1 ? '是' : '否';
      },
      [detail]
    );

    const getEquityExtraIndexOf = useCallback(
      (module: string) => {
        return (
          (equityExtraOptions &&
            equityExtraOptions.find((item) => item.module === module)
              ?.queryLimit) ||
          0
        );
      },
      [equityExtraOptions]
    );

    useEffect(() => {
      isEdit && userBasicInfoInit();
      !isEdit && init();
    }, [isEdit]);

    const init = async () => {
      try {
        const resp = await getStaffExtraEquityLimit({
          customerId: detail.id as string,
        });
        setEquityExtraOptions(resp.data);
      } catch {}
    };

    const BasicOptions = [
      {
        label: '公司名称：',
        value: detail.affiliateName,
      },
      {
        label: '公司管理员：',
        value: getPermissionsIndexOf('AFA'),
      },
      {
        label: '客户类型：',
        value: publicData['customerLevel'][detail.level],
      },
      {
        label: '订舱权限：',
        value: getPermissionsIndexOf('BKG'),
      },
      {
        label: '预定权限：',
        value: getPermissionsIndexOf('PBK'),
      },
      {
        label: '上传舱位权限：',
        value: getPermissionsIndexOf('CUP'),
      },
      {
        label: '订单免审：',
        value: getPermissionsIndexOf('OVE'),
      },
      {
        label: '绑定船公司账号：',
        value: getPermissionsIndexOf('CAA'),
      },
      {
        label: '消息订阅权限：',
        value: getPermissionsIndexOf('NTF'),
      },
      {
        label: '子账号权益：',
        value: detail.level === 9 ? '是' : '否',
      },
    ];

    const ComboPermissionOptions = [
      {
        label: '额外实时查询购买：',
        key: 'REALTIME_RATE',
        value: `剩余${getEquityExtraIndexOf('REALTIME_RATE')}条`,
        limit: getEquityExtraIndexOf('REALTIME_RATE'),
      },
      {
        label: '额外运价订阅数：',
        key: 'RATE_SUBSCRIBE',
        value: `${getEquityExtraIndexOf('RATE_SUBSCRIBE')}条`,
        limit: getEquityExtraIndexOf('RATE_SUBSCRIBE'),
      },
      {
        label: '箱货跟踪：',
        key: 'CARGO_TRACE',
        value: `剩余${getEquityExtraIndexOf('CARGO_TRACE')}次`,
        limit: getEquityExtraIndexOf('CARGO_TRACE'),
      },
      {
        label: '船舶计划：',
        key: 'CARRIER_SCHEDULE',
        value: `剩余${getEquityExtraIndexOf('CARRIER_SCHEDULE')}次`,
        limit: getEquityExtraIndexOf('CARRIER_SCHEDULE'),
      },
      {
        label: '国内卡车轨迹：',
        key: 'TRUCK_TRAJECTORY',
        value: `剩余${getEquityExtraIndexOf('TRUCK_TRAJECTORY')}条`,
        limit: getEquityExtraIndexOf('TRUCK_TRAJECTORY'),
      },
      {
        label: '美国清关放行查询：',
        key: 'US_CLEARANCE',
        value: `剩余${getEquityExtraIndexOf('US_CLEARANCE')}条`,
        limit: getEquityExtraIndexOf('US_CLEARANCE'),
      },
      {
        label: '短信服务：',
        key: 'SMS_NOTIFY',
        value: `剩余${getEquityExtraIndexOf('SMS_NOTIFY')}次`,
        limit: getEquityExtraIndexOf('SMS_NOTIFY'),
      },
    ];

    const getBasicInfo = () => {
      return (
        <>
          <Divider dashed />
          <p className="font-semibold text-base mb-[10px]">基本权限设置</p>
          {!isEdit ? (
            <div className="grid grid-cols-2 text-gray-500 gap-y-[10px]">
              {BasicOptions.map((item) => (
                <div key={item.label}>
                  {item.label}
                  <span className="text-stone-800">{item?.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <Row gutter={24}>
              {formMaps.slice(5, formMaps.length - 6).map((item, index) => (
                <Col span={item.span} key={index}>
                  <Form.Item
                    label={item.label}
                    name={item.name}
                    labelCol={{ span: 10 }}
                  >
                    {item.formType === 'radio' && (
                      <Radio.Group
                        options={
                          item.options as CheckboxGroupProps<string>['options']
                        }
                      ></Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          )}
        </>
      );
    };

    const getComboPermission = () => {
      return (
        <>
          <Divider dashed />
          <p className="font-semibold text-base mb-[10px]">
            套餐外权限
            <span
              className="text-normal-blue font-meduim ml-[12px] underline cursor-pointer text-sm font-normal"
              onClick={() => {
                setShowRemark(true),
                  AffiliateComboPermissionRemarkRef.current?.onLoadReamrk();
              }}
            >
              点击查看套餐内权限及额外购买费用
            </span>
          </p>
          {!isEdit ? (
            <div className="grid grid-cols-2 text-gray-500 gap-y-[10px]">
              {ComboPermissionOptions.map((item) => (
                <div key={item.label}>
                  {item.label}
                  <span className="text-stone-800">{item?.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <Row gutter={24}>
              {formMaps
                .slice(formMaps.length - 6, formMaps.length)
                .map((item, index) => (
                  <Col span={item.span} key={index}>
                    <Form.Item label={item.label} name={item.name}>
                      {item.formType === 'input' && (
                        <Search
                          placeholder="0"
                          className={styles['queryLimitInput']}
                          enterButton={
                            <>
                              <div>
                                {moduleKeys.includes(item.name) ? '次' : '条'}
                              </div>
                            </>
                          }
                        />
                      )}
                    </Form.Item>
                  </Col>
                ))}
            </Row>
          )}
        </>
      );
    };

    const userBasicInfoInit = () => {
      formMaps.map((item) => {
        if (item.formType === 'radio') {
          !item.ExtraKey &&
            form.setFieldsValue({
              [item.name]: detail.permissions.includes(item.name) ? 1 : 0,
            });
          item.ExtraKey &&
            form.setFieldsValue({
              [item.name]: detail.businessConfig[item.name] ? 1 : 0,
            });
        } else if (item.formType === 'input' && item.ExtraKey) {
          form.setFieldsValue({
            [item.name]: equityExtraOptions?.find(
              (equity) => equity.module === item.name
            )?.queryLimit,
          });
        } else form.setFieldsValue({ ...detail });
      });
    };

    const handleSave = () => {
      form
        .validateFields()
        .then(() => {
          const newArr: string[] = [];
          const jurisdictionParams = filterKeys(
            form.getFieldsValue(),
            [
              ...formMaps.map((item) => {
                if (!item.ExtraKey && item.formType === 'radio')
                  return item.name;
              }),
            ],
            true
          );
          for (let i in jurisdictionParams) {
            if (jurisdictionParams[i]) newArr.push(i);
          }

          const copyExtraInfo = JSON.parse(
            JSON.stringify(
              filterKeys(
                form.getFieldsValue(),
                [
                  ...formMaps.map((item) => {
                    if (item.ExtraKey && item.formType === 'radio')
                      return item.name;
                  }),
                ],
                true
              )
            )
          );
          for (let i in copyExtraInfo) {
            copyExtraInfo[i] = Boolean(copyExtraInfo[i]);
          }
          let params = {
            ...filterKeys(
              form.getFieldsValue(),
              [
                ...formMaps.map((item) => {
                  if (item.formType === 'radio' && !item.ExtraKey)
                    return item.name;
                }),
              ],
              false
            ),
            permissions: newArr.join(','),
            customerBusinessConfig: {
              ...copyExtraInfo,
            },
          };
          saveDetail(params);
        })
        .catch((errorInfo) => {
          // 滚动并聚焦到第一个错误字段
          form.scrollToField(errorInfo.errorFields[0].name);
          form.focusField(errorInfo.errorFields[0].name);
        });
    };

    const saveDetail = async (params: StaffManageType) => {
      try {
        await updateStaffManage(params, detail.id as string);
        await updateEquityExtra();
        message.success('修改成功～');
        setIsEdit(false);
        onLoadBaseDetail();
      } catch {
        // setIsEdit(false);
      }
    };

    const updateEquityExtra = async () => {
      let equityExtraInfo = filterKeys(
        form.getFieldsValue(),
        [
          ...formMaps.map((item) => {
            if (item.formType === 'input' && item.ExtraKey) return item.name;
          }),
        ],
        true
      );
      let newArr = ComboPermissionOptions.map((item) => {
        if (
          equityExtraInfo[item.key] &&
          equityExtraInfo[item.key] !== item.limit
        ) {
          return {
            customerId: detail.id,
            limitType: 'COUNT',
            module: item.key,
            queryLimit: equityExtraInfo[item.key],
          };
        }
      }) as EquityRightsExtraEditType[];
      for (let i of newArr) {
        try {
          if (i) await postEquityRightsExtraEdit(i);
        } catch (error) {
          // console.error('Error fetching', ':', error);
        }
      }
    };

    return (
      <>
        <div className="bg-white px-[20px] py-[31px] rounded-[6px] w-full">
          {!isEdit ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <img
                    src={DefaultUserIcon}
                    width={96}
                    height={96}
                    alt="defaultUser"
                  />
                  <div className="flex flex-col ml-[12px]">
                    <div className="flex items-center">
                      <p className="ml-[4px] text-3xl font-medium">
                        {detail.name}
                      </p>
                      <div
                        className="w-[80px] text-center py-[7px] rounded-[16px] mx-[12px] text-normal-blue text-sm font-medium"
                        style={{ background: '#ECF5FF' }}
                      >
                        {publicData['customerLevel'][detail.level]}
                      </div>
                      <img
                        src={AffiliateEdit}
                        width={26}
                        height={26}
                        className="cursor-pointer"
                        alt="edit"
                        onClick={() => setIsEdit(true)}
                      />
                    </div>
                    <div className="flex items-center mt-[22px]">
                      {detail.phone && (
                        <div className="inline-flex mr-[30px]">
                          <img
                            src={AffiliateTel}
                            width={18}
                            height={18}
                            className="mr-[2px]"
                            alt="edit"
                          />
                          <span>{detail.phone}</span>
                        </div>
                      )}
                      {detail.email && (
                        <div className="inline-flex">
                          <img
                            src={AffiliateEmail}
                            width={18}
                            height={18}
                            className="mr-[2px]"
                            alt="edit"
                          />
                          <span>{detail.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-[20px] font-normal">
                  创建时间：{formatTime(detail.created, 'Y/M/D h:m:s')}
                </div>
              </div>
              {getBasicInfo()}
              {getComboPermission()}
            </>
          ) : (
            <>
              <p className="font-semibold text-base mb-[10px]">基本信息</p>
              <Form
                form={form}
                labelCol={{ span: 8 }}
                colon={false}
                labelAlign="left"
              >
                <Form.Item name="id" hidden>
                  <Input disabled />
                </Form.Item>
                <Row gutter={24}>
                  {formMaps.slice(0, 5).map((item, index) => (
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
                            disabled={item.disabled}
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
                              item.selectFileldName ?? {
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
                {getBasicInfo()}
                {getComboPermission()}
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
          ref={AffiliateComboPermissionRemarkRef}
          source="staff"
          visible={showRemark}
          onCancel={() => setShowRemark(false)}
        />
      </>
    );
  }
);

export default UserBaseInfo;

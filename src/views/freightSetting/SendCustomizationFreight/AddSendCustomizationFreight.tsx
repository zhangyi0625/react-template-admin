import React, { useEffect, useState } from 'react';
import styles from '../../orderManage/CabinResult/cabinResult.module.scss';
import DeleteIcon from '@/assets/svg/icon/delete.svg';
import AddIcon from '@/assets/svg/icon/add.svg';
import { Form, Input, Select, Space, TimePicker, type SelectProps } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { SendCustomizationFreightType } from '@/services/freightSetting/sendCustomizationFreight/sendCustomizationFreightModel';
import { SendCustomizationFreightForms } from '../config';
import { getSearchCustomer } from '@/services/orderManage/regularBooking/regularBookingApi';
import { getSystemPort } from '@/services/system/basicData/basicDataApi';
import type { SystemPortOptionsType } from '@/services/system/basicData/basicDataModel';
import { fetchSystemSearchData } from '@/utils/freight';
import dayjs from 'dayjs';
import { formatTime } from '@/utils/format';
import useCacheData from '@/hooks/useCacheData';

export type AddSendCustomizationFreightProps = {
  params: {
    visible: boolean;
    currentRow: SendCustomizationFreightType | null;
  };
  onCancel: () => void;
  onOk: (params: SendCustomizationFreightType) => void;
};

type PortType = {
  POR?: SelectProps['options'];
  FND?: SelectProps['options'];
  [key: string]: SelectProps['options'];
};

type SendCustomizationFreightOptionsType = {
  porCode: string | undefined;
  fndCode: string | undefined;
  carrier: string | undefined;
  porList: SystemPortOptionsType[];
  fndList: SystemPortOptionsType[];
};

const AddSendCustomizationFreight: React.FC<
  AddSendCustomizationFreightProps
> = ({ params, onCancel, onOk }) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const [formMaps] = useState(SendCustomizationFreightForms);

  const [data, setData] = useState<{ customerId: SelectProps['options'] }>({
    customerId: [],
  });

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData', 'ourCompanyPort'],
    formMap: [],
    promiseFilter: {
      ourCompanyPort: {
        pageIndex: 1,
        pageSize: 9999,
      },
    },
  });

  const [defaultOptions, setDefaultOptions] = useState<PortType>({
    POR: [],
    FND: [],
  });

  const [freightOptions, setFreightOptions] = useState<
    SendCustomizationFreightType['freights'] &
      SendCustomizationFreightOptionsType[]
  >([]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    init();
  }, [visible]);

  useEffect(() => {}, [essential]);

  const init = async () => {
    if (currentRow) {
      const newArr: SendCustomizationFreightOptionsType[] =
        currentRow.freights.map((item) => {
          return {
            carrier: item.carrier,
            porCode: item.porCode,
            fndCode: item.fndCode,
            porList: essential['ourCompanyPort'].filter(
              (port: { unlocode: string }) => port.unlocode === item.porCode
            ),
            fndList: essential['ourCompanyPort'].filter(
              (port: { unlocode: string }) => port.unlocode === item.fndCode
            ),
          };
        });
      setFreightOptions([...newArr]);
      handleSearch(currentRow.customerName, 'customerId');
      form.setFieldsValue({
        ...currentRow,
        execTime: dayjs(
          formatTime(new Date() as unknown as string, 'Y-M-D') +
            '' +
            currentRow.execTime
        ),
      });
    } else {
      form.resetFields();
      resetData();
    }
    setLoading(false);
  };

  const resetData = () => {
    setData({ customerId: [] });
    setFreightOptions([
      {
        carrier: undefined,
        porCode: undefined,
        fndCode: undefined,
        porList: [],
        fndList: [],
      },
    ]);
  };

  const handleSearch = (newValue: string, type: string, index?: number) => {
    if (!newValue || !newValue.trim()) return;
    fetchSystemSearchData(
      newValue,
      type,
      type === 'customerId' ? setData : setDefaultOptions,
      type === 'customerId' ? getSearchCustomer : getSystemPort
    );
    if (type === 'POR' || type === 'FND') {
      freightOptions[index as number][type === 'POR' ? 'porList' : 'fndList'] =
        defaultOptions[type] as SystemPortOptionsType[];
      setFreightOptions([...freightOptions]);
    }
  };

  const getPortSelect = (
    type: string,
    _: Partial<SendCustomizationFreightOptionsType>,
    key: keyof { porCode: string; fndCode: string },
    index: number
  ) => {
    return (
      <Select
        allowClear
        placeholder={`请输入${type === 'POR' ? '起运' : '目的'}港`}
        showSearch
        defaultActiveFirstOption={false}
        suffixIcon={null}
        notFoundContent={null}
        filterOption={false}
        style={{ width: '210px' }}
        value={_[key]}
        onSearch={(value: string) => handleSearch(value, type, index)}
        onChange={(value: string) => selectChange(value, index, key)}
        options={((type === 'POR' ? _.porList : _.fndList) || []).map((d) => ({
          label: (
            <div className="">
              <p>
                {d.localName} - {d.name}
              </p>
              <p>
                {d.countryLocalName} - {d.countryName}
              </p>
            </div>
          ),
          value: d.unlocode,
        }))}
      />
    );
  };

  const selectChange = (
    value: string,
    index: number,
    type: keyof SendCustomizationFreightType['freights'][number]
  ) => {
    freightOptions[index][type] = value;
    setFreightOptions([...freightOptions]);
  };

  const deleteFreightOptions = (index: number) => {
    freightOptions.splice(index, 1);
    setFreightOptions([...freightOptions]);
  };

  const addFndPort = () => {
    setFreightOptions(
      [...freightOptions].concat({
        carrier: undefined,
        porCode: undefined,
        fndCode: undefined,
        porList: [],
        fndList: [],
      })
    );
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...form.getFieldsValue(),
          execTime: formatTime(form.getFieldValue('execTime'), 'h:m:s'),
          freights: freightOptions.map((item) => {
            return {
              carrier: item.carrier,
              porCode: item.porCode,
              fndCode: item.fndCode,
            };
          }),
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
        title={!currentRow ? '新增定制运价' : '修改定制运价'}
        width={{ xl: 750, xxl: 1000 }}
        onOk={handleOk}
        className={styles['cabinResult']}
        loading={loading}
      >
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          {formMaps.map((item) => (
            <Form.Item
              key={item.name}
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
                    handleSearch(value, 'customerId')
                  }
                  options={(data.customerId || []).map((d) => ({
                    value: d.value,
                    label: d.label,
                  }))}
                />
              )}
              {item.formType === 'date-picker' && (
                <TimePicker format={'HH:mm:ss'} />
              )}
            </Form.Item>
          ))}
          {freightOptions.map((_, index) => (
            <Form.Item
              label={index > 0 ? null : '关注运价'}
              style={{ marginBottom: 0 }}
              key={index}
            >
              <Space
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Form.Item>
                  <Select
                    placeholder="请选择船公司"
                    filterOption
                    options={essential['carrierData']}
                    fieldNames={{
                      label: 'carrierCode',
                      value: 'carrierCode',
                    }}
                    allowClear
                    style={{ width: '120px' }}
                    value={_.carrier}
                    onChange={(value: string) =>
                      selectChange(value, index, 'carrier')
                    }
                  />
                </Form.Item>
                <Form.Item>
                  {getPortSelect('POR', _, 'porCode', index)}
                </Form.Item>
                <Form.Item>
                  {getPortSelect('FND', _, 'fndCode', index)}
                </Form.Item>
                <img
                  onClick={() => deleteFreightOptions(index)}
                  src={DeleteIcon}
                  alt="delete"
                  className={`${
                    freightOptions.length <= 1 && 'hidden'
                  } w-[14px] h-[14px] ml-[6px] mb-[25px] cursor-pointer`}
                />
              </Space>
            </Form.Item>
          ))}
        </Form>
        <div
          className="flex items-center cursor-pointer w-fit ml-[120px]"
          onClick={addFndPort}
        >
          <img src={AddIcon} alt="add" className="w-[14px] h-[14px] mr-[4px]" />
          <p className="text-green-500 text-sm">新增港口</p>
        </div>
      </DragModal>
    </>
  );
};

export default AddSendCustomizationFreight;

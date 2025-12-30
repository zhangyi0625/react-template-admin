import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Space } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { ShipownerEncyclopediaType } from '@/services/websiteInfo/websiteInfoModel';
import {
  ShipownerEncyclopediaForm,
  ShipownerEncyclopediaOfficesForm,
} from './config';
import { filterKeys } from '@/utils/tool';
import DeleteIcon from '@/assets/svg/icon/delete.svg';
import AddIcon from '@/assets/svg/icon/add.svg';

export type ShipownerEncyclopediaProps = {
  params: {
    visible: boolean;
    currentRow: ShipownerEncyclopediaType | null;
  };
  onOk: (params: ShipownerEncyclopediaType) => void;
  onCancel: () => void;
};

const ShipownerEncyclopedia: React.FC<ShipownerEncyclopediaProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const [contactInfo, setContactInfo] = useState<
    ShipownerEncyclopediaType['offices']
  >([
    {
      address: '',
      email: '',
      fax: '',
      name: '',
      scope: '',
      tel: '',
    },
  ]);

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      setLoading(true);
      form.setFieldsValue({
        ...currentRow,
        websiteUrl: currentRow.websites.find((item) => item.type == 'home')
          ?.url,
        addressUrl: currentRow.websites.find((item) => item.type == 'track')
          ?.url,
      });
      setContactInfo(currentRow.offices ?? []);
      setLoading(false);
    } else {
      form.resetFields();
    }
  }, [visible]);

  const addContactInfo = () => {
    setContactInfo(
      contactInfo.concat([
        {
          address: '',
          email: '',
          fax: '',
          name: '',
          scope: '',
          tel: '',
        },
      ])
    );
  };
  const deleteContactInfo = (index: number) => {
    setContactInfo([...contactInfo.filter((_, i: number) => i !== index)]);
  };

  const inputChange = (
    value: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index: number
  ) => {
    contactInfo[index][key] = value.target.value;
    setContactInfo([...contactInfo]);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...filterKeys(
            form.getFieldsValue(),
            ['websiteUrl', 'addressUrl'],
            false
          ),
          websites: [
            {
              type: 'HOME',
              url: form.getFieldValue('websiteUrl'),
            },
            {
              type: 'TRACK',
              url: form.getFieldValue('addressUrl'),
            },
          ],
          offices: contactInfo,
        };
        onOk({
          ...params,
        });
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
      title="编辑船司百科"
      width={{ xl: 950, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {ShipownerEncyclopediaForm.map((item) => (
            <Col span={item.span} key={item.name}>
              <Form.Item
                label={item.label}
                name={item.name}
                rules={[
                  {
                    required: true,
                    message: `请${item.formType === 'input' ? '输入' : '选择'}${
                      item.label
                    }`,
                  },
                ]}
                labelCol={{
                  span: item.formType === 'input' ? 8 : 4,
                  offset: item.formType === 'input' ? 0 : 0,
                }}
              >
                {item.formType === 'input' && (
                  <Input
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                  />
                )}
                {item.formType === 'textarea' && (
                  <Input.TextArea
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                    style={{ minHeight: '100px' }}
                  />
                )}
              </Form.Item>
            </Col>
          ))}
          <Col span={24}>
            <Form.Item label="联系方式">
              {contactInfo.map((item, index) => (
                <Space key={index} style={{ marginBottom: '10px' }}>
                  {ShipownerEncyclopediaOfficesForm.map(
                    (formItem, formIndex) => (
                      <Form.Item
                        // name={formItem.name}
                        key={formIndex}
                        style={{ marginBottom: 0 }}
                      >
                        <Input
                          placeholder={`请输入${formItem.label}`}
                          autoComplete="off"
                          value={item[formItem.name]}
                          onChange={(value) =>
                            inputChange(value, formItem.name, index)
                          }
                        />
                      </Form.Item>
                    )
                  )}
                  <img
                    onClick={() => deleteContactInfo(index)}
                    src={DeleteIcon}
                    alt="delete"
                    className={`${
                      contactInfo.length <= 1 && 'hidden'
                    } w-[14px] h-[14px] ml-[12px] cursor-pointer`}
                  />
                </Space>
              ))}
              <div
                className="flex items-center cursor-pointer w-fit"
                onClick={addContactInfo}
              >
                <img
                  src={AddIcon}
                  alt="add"
                  className="w-[14px] h-[14px] mr-[4px]"
                />
                <p className="text-green-500 text-sm">新增联系方式</p>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </DragModal>
  );
};

export default ShipownerEncyclopedia;

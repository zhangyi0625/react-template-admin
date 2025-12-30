import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { OurCompanyPortForms } from '../config';
import DragModal from '@/components/modal/DragModal';
import type { OurCompanyPortType } from '@/services/portManage/ourCompanyPort/ourCompanyPortModel';
import { getSystemAreaOptions } from '@/services/system/basicData/basicDataApi';
import { filterKeys, searchSelectFilterOption } from '@/utils/tool';
import useCacheData from '@/hooks/useCacheData';

export type AddOurCompanyPortProps = {
  params: {
    visible: boolean;
    currentRow: OurCompanyPortType | null;
  };
  onCancel: () => void;
  onOk: (params: OurCompanyPortType) => void;
};

const AddOurCompanyPort: React.FC<AddOurCompanyPortProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const { essential } = useCacheData({
    cacheEssentialKeys: ['routerData', 'countryData'],
  });

  const [formMaps, setFormMaps] = useState(OurCompanyPortForms);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    init();
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        tags: currentRow.tags?.split(','),
        popularity: currentRow.popularity ? 1 : 0,
      });
    } else {
      form.resetFields();
    }
  }, [visible, essential]);

  const init = async () => {
    try {
      formMaps.map((item) => {
        if (item.name === 'parentAreaId') item.options = essential['routeData'];
        else if (item.name === 'countryId')
          item.options = essential['countryData'];
      });
      currentRow?.parentAreaId && getRouteChange(currentRow?.parentAreaId ?? 0);
      setFormMaps([...formMaps]);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const getRouteChange = async (value: number) => {
    try {
      const resp = await getSystemAreaOptions({ parentId: value });
      formMaps.map((item) => {
        if (item.name === 'areaId') item.options = resp;
      });
      setFormMaps([...formMaps]);
      form.setFieldsValue({ areaId: resp[0].id });
    } catch {}
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...filterKeys(form.getFieldsValue(), ['tags'], false),
          tags: form.getFieldValue('tags').join(','),
        };
        onOk({ ...params });
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
        width={{ xl: 900, xxl: 1000 }}
        open={visible}
        title={currentRow ? '编辑我司港口' : '新增我司港口'}
        onOk={handleOk}
        onCancel={onCancel}
        loading={loading}
      >
        <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Row gutter={24}>
            {OurCompanyPortForms.map((item) => (
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
                      placeholder={`请输入${item.label}`}
                      autoComplete="off"
                      allowClear
                    />
                  )}
                  {item.formType === 'normalSelect' && (
                    <Select
                      placeholder={`请选择${item.label}`}
                      filterOption={(input, option) =>
                        searchSelectFilterOption(
                          input,
                          item.selectFieldName,
                          option
                        )
                      }
                      showSearch
                      allowClear
                      options={item.options}
                      fieldNames={
                        item.selectFieldName ?? {
                          label: 'label',
                          value: 'value',
                        }
                      }
                      mode={item.name === 'tags' ? 'tags' : undefined}
                      maxTagCount={2}
                      onChange={(e) =>
                        item.name === 'parentAreaId' && getRouteChange(e)
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </DragModal>
    </>
  );
};

export default AddOurCompanyPort;

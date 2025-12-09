import React, { useEffect, useState } from 'react';
import { App, Col, Form, Input, Row, Select, type TableProps } from 'antd';
import {
  OurCompanyPortSearchColumns,
  ShippingCompanyPortSearchColumns,
} from '../config';
import DragModal from '@/components/modal/DragModal';
import type { ShippingCompanyPortType } from '@/services/portManage/shippingCompanyPort/shippingCompanyPortModel';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { getOurCompanyPortListByPage } from '@/services/portManage/ourCompanyPort/ourCompanyPortApi';
import type {
  OurCompanyPortSearchFilterParams,
  OurCompanyPortSearchParams,
} from '@/services/portManage/ourCompanyPort/ourCompanyPortModel';
import { filterKeys } from '@/utils/tool';
import useCacheData from '@/hooks/useCacheData';

export type AddShippingCompanyPortProps = {
  params: {
    visible: boolean;
    currentRow: ShippingCompanyPortType | null;
  };
  onCancel: () => void;
  onOk: (params: ShippingCompanyPortType) => void;
};

const AddShippingCompanyPort: React.FC<AddShippingCompanyPortProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const { message } = App.useApp();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData'],
    formMap: ShippingCompanyPortSearchColumns,
  });

  const [selected, setSelected] = useState<string[]>([]);

  const [immediate, setImmediate] = useState<boolean>(true);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<OurCompanyPortSearchParams>({
      pageIndex: 1,
      pageSize: 9999,
      filter: undefined,
    });

  useEffect(() => {
    if (!visible) return;
    setImmediate(true);
    setLoading(true);
    init();
  }, [visible]);

  const init = () => {
    if (!currentRow) {
      form.resetFields();
      setSelected([]);
    } else {
      form.setFieldsValue({ ...currentRow });
      if (currentRow?.locationId) {
        setSelected([currentRow?.locationId]);
        onUpdateSearch({
          code: currentRow?.unlocode ?? '',
          name: currentRow?.locationName ?? '',
        });
      }
    }
    setLoading(false);
  };

  const columns: TableProps['columns'] = [
    {
      title: '五字码[国际/国内]',
      dataIndex: 'localCode',
      width: 200,
      align: 'center',
    },
    {
      title: '名称',
      width: 200,
      align: 'center',
      render(value) {
        return (
          <div>
            {value.localName} - {value.name}
          </div>
        );
      },
    },
  ];

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        if (!selected.length) {
          message.error('选择我司对应港口代码');
          return;
        }
        let params = {
          ...form.getFieldsValue(),
          locationId: selected[0],
        };
        onOk({ ...params });
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  const onUpdateSearch = (
    info?: OurCompanyPortSearchFilterParams | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined
      )
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize', 'sort'],
      true
    );
    setSearchDefaultForm({
      ...pageInfo,
      filter: { ...filteredObj },
    });
    setImmediate(false);
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
          {!currentRow?.id && (
            <>
              <div className="text-sm font-medium mb-[20px]">船司港口信息</div>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="brand"
                    rules={[
                      {
                        required: true,
                        message: `请选择船公司`,
                      },
                    ]}
                    label="船司"
                  >
                    <Select
                      placeholder="请选择船公司"
                      showSearch
                      allowClear
                      options={essential['carrierData']}
                      fieldNames={{
                        label: 'carrierCode',
                        value: 'code',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: `请填写船司港口代码`,
                      },
                    ]}
                    label="船司代码"
                  >
                    <Input
                      placeholder="请填写船司港口代码"
                      autoComplete="off"
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: `请填写船司港口名`,
                      },
                    ]}
                    label="船司港口名"
                  >
                    <Input
                      placeholder="请填写船司港口名"
                      autoComplete="off"
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <div className="text-sm font-medium mb-[20px]">对应我司港口</div>
        </Form>
        <SearchForm
          columns={OurCompanyPortSearchColumns.slice(0, 2)}
          gutterWidth={24}
          labelPosition="left"
          btnSeparate={false}
          defaultFormItemLayout={{
            labelCol: {
              xs: { span: 16 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 2 },
              sm: { span: 22 },
            },
          }}
          iconHidden={false}
          isShowReset={true}
          isShowExpend={false}
          onUpdateSearch={onUpdateSearch}
        />
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          // scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          selectionParentType="radio"
          isPagination={false}
          immediate={immediate}
          fetchData={getOurCompanyPortListByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          multipleSelected={selected}
          onUpdatePagination={() => {}}
          onUpdateSelection={(options) => setSelected(options)}
        />
      </DragModal>
    </>
  );
};

export default AddShippingCompanyPort;

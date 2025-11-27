import React, { useEffect, useState } from 'react';
import {
  ConfigProvider,
  Form,
  Select,
  Upload,
  UploadFile,
  type UploadProps,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { SelectProps } from 'antd/lib';
import DragModal from '@/components/modal/DragModal';
import { getSearchAffiliate } from '@/services/orderManage/regularBooking/regularBookingApi';
import type { ImportCabinResultType } from '@/services/orderManage/cabinResult/cabinResultModel';
import { debounce } from 'lodash-es';
import { fetchSystemSearchData } from '@/utils/freight';

export type CabinResultModalProps = {
  params: {
    carrierOptions: { carrierCode: string }[];
    visible: boolean;
  };
  onOk: (params: ImportCabinResultType) => void;
  onCancel: () => void;
};

const fetchSearch = debounce((value: string, callback: (data: any) => void) => {
  getSearchAffiliate({ keyword: value }).then((resp) => {
    callback(resp);
  });
}, 300);

const CabinResultModal: React.FC<CabinResultModalProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, carrierOptions = [] } = params;

  const [CabinResultForm] = Form.useForm();

  const [defalueOptions, setDefaultOptions] = useState<{
    affiliateId: SelectProps['options'];
  }>({
    affiliateId: [],
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { Dragger } = Upload;

  const DraggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx',
    beforeUpload(file) {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  useEffect(() => {
    if (visible) {
      CabinResultForm.resetFields();
      setFileList([]);
    }
  }, [visible]);

  const handleOk = () => {
    CabinResultForm.validateFields()
      .then(() => {
        onOk({ ...CabinResultForm.getFieldsValue(), file: fileList[0] });
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        CabinResultForm.scrollToField(errorInfo.errorFields[0].name);
        CabinResultForm.focusField(errorInfo.errorFields[0].name);
      });
  };

  const handleSearch = (value?: string) => {
    if (!value) return;
    // fetchSearch(value, setDefaultOptions);
    fetchSystemSearchData(
      value,
      'affiliateId',
      setDefaultOptions,
      getSearchAffiliate
    );
  };

  return (
    <DragModal
      open={params.visible}
      width={'40%'}
      title="导入拍舱结果"
      onOk={handleOk}
      onCancel={onCancel}
      okText="导入"
    >
      <Form form={CabinResultForm} labelCol={{ span: 4 }}>
        <Form.Item
          label="公司名称"
          name="affiliateId"
          rules={[{ required: true, message: '请输入公司名称' }]}
        >
          <Select
            allowClear
            placeholder="请输入公司名称"
            showSearch
            defaultActiveFirstOption={false}
            suffixIcon={null}
            notFoundContent={null}
            filterOption={false}
            onSearch={(value: string) => handleSearch(value)}
            options={(defalueOptions.affiliateId || []).map((d) => ({
              value: d.id,
              label: d.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="船公司"
          name="carrier"
          rules={[{ required: true, message: '请选择船公司' }]}
        >
          <Select
            allowClear
            placeholder="请选择船公司"
            showSearch
            defaultActiveFirstOption={false}
            filterOption={false}
            options={(carrierOptions || []).map((d) => ({
              value: d.carrierCode,
              label: d.carrierCode,
            }))}
          />
        </Form.Item>
        <ConfigProvider
          theme={{
            components: {
              Upload: {
                colorBorder: '#167fff',
                colorFillAlter: 'rgba(241,246,255,1)',
              },
            },
          }}
        >
          <Dragger {...DraggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-sky-600">点击或将文件拖动到这里上传</p>
            <p>仅支持文件格式：xlsx</p>
          </Dragger>
        </ConfigProvider>
      </Form>
    </DragModal>
  );
};

export default CabinResultModal;

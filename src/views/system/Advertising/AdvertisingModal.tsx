import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  type GetProp,
  Input,
  InputNumber,
  Upload,
  UploadFile,
  type UploadProps,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DragModal from '@/components/modal/DragModal';
import type { AdvertisingManageType } from '@/services/system/advertising/advertisingModel';
import { AdvertisingManageForms } from './config';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

export type AdvertisingModalProps = {
  params: {
    visible: boolean;
    currentRow?: AdvertisingManageType | null;
  };
  onCancel: () => void;
  onOk: (values: AdvertisingManageType) => void;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AdvertisingModal: React.FC<AdvertisingModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;

  const [loading, setLoading] = useState(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    init();
  }, [visible]);

  const init = () => {
    if (!currentRow) {
      form.resetFields();
      setFileList([]);
    } else {
      form.setFieldsValue(currentRow);
    }
    setLoading(false);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.png,.jpg',
    beforeUpload(file) {
      setFileList([file]);
      return false;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        !info.fileList.length && setFileList([]);
      }
      if (info.fileList.length) {
        const formdata = new FormData();
        formdata.append('file', info.file as FileType); //将每一个文件图片都加进formdata
        // postUploadFile(formdata).then((resp) => {
        //   form.setFieldsValue({
        //     ...form.getFieldsValue(),
        //     logo: resp.data.id,
        //     logoName: resp.data.name,
        //   })
        // })
      }
    },
    fileList,
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({
          ...filterKeys(form.getFieldsValue(), ['create', 'fileList'], false),
          validForm: formatTime(form.getFieldValue('create')[0], 'Y-M-D'),
          validTo: formatTime(form.getFieldValue('create')[1], 'Y-M-D'),
        });
        console.log(form.getFieldsValue());
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
      title={!currentRow ? '添加广告' : '修改广告'}
      width={{ xl: 600, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {AdvertisingManageForms.map((item) => (
          <Form.Item
            label={item.label}
            name={item.name}
            key={item.name}
            rules={
              item.isRules
                ? [
                    {
                      required: true,
                      message: `请${
                        item.formType === 'input' ||
                        item.formType === 'textarea'
                          ? '输入'
                          : '选择'
                      }${item.label}`,
                    },
                  ]
                : undefined
            }
          >
            {item.formType === 'input' && (
              <Input placeholder={`请输入${item.label}`} autoComplete="off" />
            )}
            {item.formType === 'input-number' && (
              <InputNumber
                placeholder={`请输入${item.label}`}
                min={1}
                style={{ width: '100%' }}
              />
            )}
            {item.formType === 'range-picker' && (
              <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            )}
            {item.formType === 'upload' && (
              <Upload {...uploadProps}>
                <Button
                  color="primary"
                  variant="outlined"
                  icon={<UploadOutlined />}
                >
                  上传图片
                </Button>
                <p className="text-sm text-gray-500 mt-[8px]">
                  只支持 jpg、png 格式
                </p>
              </Upload>
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default AdvertisingModal;

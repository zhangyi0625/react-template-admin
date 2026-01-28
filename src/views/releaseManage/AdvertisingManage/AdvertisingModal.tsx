import { useEffect, useState } from 'react';
import {
  App,
  DatePicker,
  Form,
  type GetProp,
  Input,
  InputNumber,
  Upload,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import DragModal from '@/components/modal/DragModal';
import type { AdvertisingManageType } from '@/services/releaseManage/advertisingManage/advertisingManageModel';
import { AdvertisingForm } from './config';
import { formatTime } from '@/utils/format';
import { filterKeys } from '@/utils/tool';
import dayjs from 'dayjs';
import { postUploadFile, previewPreviewFile } from '@/services/upload';

export type AdvertisingModalProps = {
  params: {
    visible: boolean;
    currentRow: AdvertisingManageType | null;
  };
  onCancel: () => void;
  onOk: (params: AdvertisingManageType) => void;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AdvertisingModal: React.FC<AdvertisingModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { message } = App.useApp();

  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;

  const [imageUrl, setImageUrl] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        date: [dayjs(currentRow.startDate), dayjs(currentRow.endDate)],
      });
      loadImage();
    } else {
      form.resetFields();
      form.setFieldsValue({ date: [] });
      setImageUrl('');
    }
  }, [visible]);

  const loadImage = async () => {
    if (currentRow?.imageId) {
      const image = await previewPreviewFile(currentRow.imageId);
      setImageUrl(await getBase64(image as Blob));
    }
  };

  const CustomUploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    listType: 'picture-card',
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return false;
    },
    onChange(info) {
      setLoading(true);
      const formdata = new FormData();
      formdata.append('file', info.file as FileType); //将每一个文件图片都加进formdata
      postUploadFile(formdata).then(async (resp) => {
        setLoading(false);
        const image = await previewPreviewFile(resp.data.id);
        setImageUrl(await getBase64(image as Blob));
        form.setFieldValue('imageId', resp.data.id);
      });
    },
    onRemove() {
      setImageUrl('');
    },
    fileList,
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        console.log(form.getFieldsValue());
        let params = {
          ...filterKeys(form.getFieldsValue(), ['date'], false),
          startDate: formatTime(form.getFieldsValue().date?.[0], 'Y-M-D'),
          endDate: formatTime(form.getFieldsValue().date?.[1], 'Y-M-D'),
        };
        onOk(params);
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const getBase64 = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  return (
    <DragModal
      width="50%"
      open={visible}
      title={currentRow ? '编辑广告' : '新增广告'}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        {AdvertisingForm.map((item) => (
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
            {item.formType === 'input-number' && (
              <InputNumber style={{ width: '100%' }} min={0} />
            )}
            {item.formType === 'input' && (
              <Input placeholder={item.label as string} allowClear />
            )}
            {item.formType === 'range-picker' && (
              <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            )}
          </Form.Item>
        ))}
        <Form.Item name="imageId" label="广告图片">
          <Upload {...CustomUploadProps}>
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
      </Form>
    </DragModal>
  );
};

export default AdvertisingModal;

import { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  GetProp,
  Input,
  InputNumber,
  Radio,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { NoticeManageForms } from './config';
import dayjs from 'dayjs';
import DragModal from '@/components/modal/DragModal';
import type { NoticeManageEditType } from '@/services/otherSetting/noticeManage/noticeManageModel';
import { postUploadBulletinFile } from '@/services/upload';
import { getNoticeManageDetail } from '@/services/otherSetting/noticeManage/noticeManageApi';
import { formatTime } from '@/utils/format';
import { filterKeys, safeJsonParse } from '@/utils/tool';

export type NoticeManageModalProps = {
  params: {
    visible: boolean;
    editRow: NoticeManageEditType | null;
  };
  onOk: (values: NoticeManageEditType) => void;
  onCancel: () => void;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const NoticeManageModal: React.FC<NoticeManageModalProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, editRow } = params;

  const API = process.env.RS_BASE_API?.replace('/api', '') ?? '';

  const [url, setUrl] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
        setUploading(true);
        const formdata = new FormData();
        formdata.append('file', info.file as FileType); //将每一个文件图片都加进formdata
        postUploadBulletinFile(formdata).then((resp) => {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            url: resp.url,
          });
          setUploading(false);
        });
      }
    },
    fileList,
  };

  useEffect(() => {
    if (!visible) return;
    if (!editRow) {
      resetCache();
    } else loadNoticeDetail();
  }, [visible]);

  const resetCache = () => {
    form.resetFields();
    form.setFieldsValue({
      type: 'MOBILE_HOME_TOP',
      sequence: 0,
    });
    setUrl('');
    setFileList([]);
  };

  const loadNoticeDetail = async () => {
    try {
      const resp = await getNoticeManageDetail(editRow?.id as string);
      form.setFieldsValue({
        ...editRow,
        validFrom: editRow?.validFrom ? dayjs(editRow.validFrom) : undefined,
        validTo: editRow?.validTo ? dayjs(editRow.validTo) : undefined,
      });
      let fullUrl = safeJsonParse(atob(resp?.content || ''))?.url ?? '';
      setUrl(fullUrl);
      setFileList(
        fullUrl
          ? [
              {
                uid: '-1',
                name:
                  safeJsonParse(atob(resp?.content || ''))
                    ?.file.split('/')
                    .pop() || 'image',
                url: API + safeJsonParse(atob(resp?.content || ''))?.file || '',
              },
            ]
          : []
      );
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...filterKeys(
            form.getFieldsValue(),
            ['file', 'link', 'validFrom', 'validTo'],
            false
          ),
          validFrom: form.getFieldValue('validFrom')
            ? formatTime(form.getFieldValue('validFrom'), 'Y-M-D h:m:s')
            : null,
          validTo: form.getFieldValue('validTo')
            ? formatTime(form.getFieldValue('validTo'), 'Y-M-D h:m:s')
            : null,
          content: !form.getFieldValue('file')
            ? editRow?.content
            : btoa(
                JSON.stringify({
                  url: form.getFieldValue('link'),
                  file: form.getFieldValue('url'),
                })
              ),
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
      title={!editRow ? '新增公告' : '修改公告'}
      width={{ xl: 600, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {NoticeManageForms.map((item) => (
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
                        item.formType === 'input' ? '输入' : '选择'
                      }${item.label}`,
                    },
                  ]
                : undefined
            }
          >
            {item.formType === 'radio' && (
              <Radio.Group
                options={item.options as CheckboxGroupProps<string>['options']}
              ></Radio.Group>
            )}
            {item.formType === 'date-picker' && (
              <DatePicker
                style={{ width: '100%' }}
                format={'YY-MM-DD HH:mm:ss'}
              />
            )}
            {item.formType === 'input' && (
              <Input allowClear placeholder={`请输入${item.label}`} />
            )}
            {item.formType === 'inputNumber' && (
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder={`请输入${item.label}`}
              />
            )}
          </Form.Item>
        ))}
        <Form.Item label="公告链接" name="link">
          {!editRow ? (
            <Input allowClear placeholder="请输入公告链接" />
          ) : (
            <div
              className="text-blue-500 underline cursor-pointer"
              onClick={() => window.open(url)}
            >
              {url}
            </div>
          )}
        </Form.Item>
        <Form.Item name={'file'} label="公告图片" layout="horizontal">
          <Upload {...uploadProps}>
            <Button
              color="primary"
              variant="outlined"
              icon={<UploadOutlined />}
              loading={uploading}
            >
              上传图片
            </Button>
            <p className="text-sm text-gray-500 mt-[8px]">
              支持扩展名：.png .jpg
            </p>
          </Upload>
        </Form.Item>
      </Form>
    </DragModal>
  );
};

export default NoticeManageModal;

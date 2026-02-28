import { useEffect, useState } from 'react';
import {
  App,
  Col,
  DatePicker,
  Form,
  GetProp,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { MemberUnitManageType } from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import {
  MemberUnitManageForm,
  MemberUnitManageMemberLevelOptions,
  MemberUnitManageUnitLevelOptions,
} from './config';
import dayjs from 'dayjs';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { postUploadFile } from '@/services/upload';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

export type MemberUnitModalProps = {
  params: {
    visible: boolean;
    currentRow: MemberUnitManageType | null;
  };
  onOk: (row: MemberUnitManageType) => void;
  onCancel: () => void;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const MemberUnitModal: React.FC<MemberUnitModalProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const { message } = App.useApp();

  const [imageUrl, setImageUrl] = useState<string>('');

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    if (!currentRow) {
      form.resetFields();
      setImageUrl('');
    } else {
      form.setFieldsValue({
        ...currentRow,
        memberExpiryDate: currentRow.memberExpiryDate
          ? dayjs(currentRow.memberExpiryDate)
          : null,
        establishmentDate: currentRow.establishmentDate
          ? dayjs(currentRow.establishmentDate)
          : null,
      });
      setImageUrl(currentRow.logoPath ?? '');
    }
  }, [visible]);

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
        setImageUrl(resp.data.path);
        form.setFieldValue('logo', resp.data.id);
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
        onOk({
          ...filterKeys(
            form.getFieldsValue(),
            ['memberExpiryDate', 'establishmentDate', 'file'],
            false,
          ),
          memberExpiryDate: formatTime(
            form.getFieldValue('memberExpiryDate'),
            'Y-M-D',
          ),
          establishmentDate: formatTime(
            form.getFieldValue('establishmentDate'),
            'Y-M-D',
          ),
          isShow: true,
          memberLevel: (MemberUnitManageMemberLevelOptions || [])[
            (MemberUnitManageUnitLevelOptions || []).findIndex(
              (item) => item.value === form.getFieldValue('unitLevel'),
            )
          ].value,
        });
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
      <div style={{ marginTop: 8 }}>点击上传</div>
    </button>
  );
  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title={!currentRow ? '添加会员单位' : '修改会员单位'}
      width={{ xl: 860, xxl: 1000 }}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 12 }} layout="vertical">
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 2 }}
          labelAlign="left"
          layout="horizontal"
          name="logo"
          label="logo"
        >
          <Upload {...CustomUploadProps}>
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Row gutter={24}>
          {MemberUnitManageForm.map((item) => (
            <Col span={item.span} key={item.name}>
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
                  />
                )}
                {item.formType === 'normalSelect' && (
                  <Select
                    showSearch
                    allowClear
                    placeholder={`请选择${item.label}`}
                    options={item.options}
                  />
                )}
                {item.formType === 'date-picker' && (
                  <DatePicker
                    placeholder={`请选择${item.label}`}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                )}
                {item.formType === 'textarea' && (
                  <Input.TextArea
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                    style={{ minHeight: '100px' }}
                  />
                )}
                {item.formType === 'input-number' && (
                  <InputNumber
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                    style={{ width: '100%' }}
                    min={0}
                  />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </DragModal>
  );
};

export default MemberUnitModal;

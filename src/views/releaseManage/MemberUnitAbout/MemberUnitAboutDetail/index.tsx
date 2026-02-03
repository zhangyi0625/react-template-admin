import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Col,
  Form,
  type GetProp,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Upload,
  type UploadFile,
  type UploadProps,
} from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { useNavigate, useParams } from 'react-router-dom';
import { MemberUnitAboutForm } from '../config';
import {
  getMemberUnitAboutDetail,
  updateMemberUnitAbout,
} from '@/services/releaseManage/memberUnitAbout/memberUnitAboutApi';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { postUploadFile, previewPreviewFile } from '@/services/upload';
import IconClose from '@/assets/svg/icon/close.svg';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const MemberUnitAboutDetail: React.FC = () => {
  const params = useParams();

  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [type, setType] = useState('content');

  const { message } = App.useApp();

  const [immediate, setImmediate] = useState<boolean>(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [companyPicList, setCompanyPicList] = useState<string[]>([]);

  const [editor, setEditor] = useState<IDomEditor | null>(null);

  // 编辑器内容
  const [html, setHtml] = useState('<p>hello</p>');

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    // setTimeout(() => {
    //   setHtml('<p>hello world</p>');
    // }, 1500);
  }, []);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    if (!params.id) return;
    init();
  }, [params.id]);

  const init = async () => {
    setImmediate(true);
    try {
      const resp = await getMemberUnitAboutDetail(params.id as string);
      form.setFieldsValue({
        ...resp,
        type: resp.content ? 'content' : 'imageIds',
      });
      setCompanyPicList(resp.imageIds ? resp.imageIds.split(',') : []);

      // setFileList(resp.imageIds || []);
      setType(resp.content ? 'content' : 'imageIds');
      setTimeout(() => {
        setHtml(resp.content ?? '<p>hello world</p>');
      }, 1500);
      setImageUrls(resp.imagePath ? resp.imagePath : []);
      setImmediate(false);
    } catch {
      setImmediate(false);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async () => {
        console.log(form.getFieldsValue(), html, companyPicList);
        let params = {
          ...form.getFieldsValue(),
          imageIds: type === 'imageIds' ? companyPicList.join(',') : null,
          content: type === 'content' ? html : null,
        };
        await updateMemberUnitAbout(params);
        message.success('更新成功');
        navigate('/releaseManage/memberUnitAbout');
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  // 组件挂载时加载所有图片
  useEffect(() => {
    // companyPicList.forEach((item) => getSrc(item));
  }, [companyPicList]);

  const changeImageUrls = (item: string, index: number) => {
    // setImageUrls((prev) => prev.filter((i, i) => i !== index));
    setImageUrls((prev) => prev.filter((i) => i !== item));
    setCompanyPicList((prev) =>
      prev.filter((i) => i !== companyPicList[index]),
    );
  };

  const CustomUploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    // listType: 'picture-card',
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
      postUploadFile(formdata).then((resp) => {
        setLoading(false);
        setCompanyPicList((prev) => [...prev, resp.data.id as string]);
        setImageUrls((prev) => [...prev, resp.data.path]);
      });
    },
    onRemove() {
      // setImageUrl('');
    },
    fileList,
  };

  return (
    <>
      <Spin spinning={immediate}>
        <div className="bg-white py-[32px] px-[24px] rounded-[8px] shadow-md">
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
          >
            <Form.Item name="id" hidden>
              <Input disabled />
            </Form.Item>
            <Row>
              {MemberUnitAboutForm.map((item) => (
                <Col span={item.span} key={item.name}>
                  <Form.Item
                    label={item.label}
                    key={item.name}
                    name={item.name}
                    rules={[
                      {
                        required: true,
                        message: `请${item.formType === 'input' ? '输入' : '选择'}${
                          item.label
                        }`,
                      },
                    ]}
                  >
                    {item.formType === 'input' && (
                      <Input
                        placeholder={`请输入${item.label}`}
                        autoComplete="off"
                      />
                    )}
                    {item.formType === 'input-number' && (
                      <InputNumber style={{ width: '100%' }} min={0} />
                    )}
                    {item.formType === 'normalSelect' && (
                      <Select
                        placeholder={`请选择${item.label}`}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption
                        options={item.options}
                      />
                    )}
                    {item.formType === 'radio' && (
                      <Radio.Group
                        options={
                          item.options as CheckboxGroupProps<string>['options']
                        }
                        onChange={(e) => setType(e.target.value)}
                      />
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
            {type === 'content' ? (
              <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                <Toolbar
                  editor={editor}
                  defaultConfig={toolbarConfig}
                  mode="default"
                  style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                  defaultConfig={editorConfig}
                  value={html}
                  onCreated={setEditor}
                  onChange={(editor) => setHtml(editor.getHtml())}
                  mode="default"
                  style={{ height: '500px', overflowY: 'hidden' }}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center mb-[20px]">
                  <p className="mr-[60px]">图片:</p>
                  <Upload {...CustomUploadProps}>
                    <Button type="primary" loading={loading}>
                      上传图片
                    </Button>
                  </Upload>
                </div>
                <div className="flex flex-wrap items-center">
                  {imageUrls.map((item, index) => (
                    <div
                      key={item}
                      className="mr-[12px] relative w-[80px] h-[80px]"
                    >
                      <img
                        src={item || ''}
                        alt={item}
                        className="w-full h-auto h-cover"
                      />
                      <img
                        src={IconClose}
                        alt="close"
                        className="absolute top-[2px] right-[0px] w-[24px] h-[24px] cursor-pointer"
                        onClick={() => changeImageUrls(item, index)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            <Space className="mt-[8px]">
              <Button type="primary" onClick={handleOk}>
                立刻保存
              </Button>
              <Button
                variant="outlined"
                color="default"
                onClick={() => navigate('/releaseManage/memberUnitAbout')}
              >
                返回
              </Button>
            </Space>
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default MemberUnitAboutDetail;

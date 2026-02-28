import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Col,
  Form,
  type GetProp,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Upload,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { postSaveFile, postUploadFile } from '@/services/upload';
import IconClose from '@/assets/svg/icon/close.svg';
import {
  createIndustryDynamics,
  getIndustryDynamicsDetail,
  getIndustryDynamicsGroup,
  updateIndustryDynamics,
} from '@/services/releaseManage/industryDynamics/industryDynamicsApi';
import type { CheckboxGroupProps } from 'antd/es/checkbox';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type InsertFnType = (url: string, alt: string, href: string) => void;

const IndustryDynamicsDetail: React.FC = () => {
  const params = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [type, setType] = useState('content');

  const { message } = App.useApp();

  const [immediate, setImmediate] = useState<boolean>(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [imageUrls, setImageUrls] = useState<string>('');

  const [companyPicList, setCompanyPicList] = useState<string[]>([]);

  const [editor, setEditor] = useState<IDomEditor | null>(null);

  const [industryDynamicsGroupList, setIndustryDynamicsGroupList] = useState<
    { label: string; value: string }[]
  >([]);

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
    MENU_CONF: {
      uploadImage: {
        server: '/api/system/file/upload',
        fieldName: 'file',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        // 自定义插入图片
        async customInsert(res: any, insertFn: InsertFnType) {
          console.log(res, 'res');
          // 从 res 中找到 url alt href ，然后插入图片
          insertFn(res.data.path, res.data.name, res.data.path);
          await postSaveFile(res.data.id);
        },
      },
    },
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
    setFileList([]);
    setImageUrls('');
    loadIndustryDynamicsGroupList();
  }, [params.id]);

  const loadIndustryDynamicsGroupList = async () => {
    try {
      const resp = await getIndustryDynamicsGroup();
      setIndustryDynamicsGroupList(
        resp.map((i: { name: string; id: string }) => ({
          label: i.name,
          value: i.id,
        })),
      );
    } catch {}
  };

  const init = async () => {
    setImmediate(true);
    try {
      if (!location.search) {
        const resp = await getIndustryDynamicsDetail(params.id as string);
        form.setFieldsValue({
          ...resp,
          type: resp.content ? 'content' : 'url',
        });
        setCompanyPicList(resp.mainImage ? resp.mainImage.split(',') : []);
        setImageUrls(resp.mainImagePath || '');
        setType(resp.content ? 'content' : 'url');
        setTimeout(() => {
          setHtml(resp.content || '<p>hello world</p>');
        }, 1500);
      } else {
        form.resetFields();
        form.setFieldsValue({
          type: 'url',
        });
        setType('url');
      }
      setImmediate(false);
    } catch {
      setImmediate(false);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async () => {
        let params = {
          ...form.getFieldsValue(),
          mainImage: imageUrls && companyPicList[0] ? companyPicList[0] : null,
          content: type === 'content' ? html : null,
          url: type === 'url' ? form.getFieldValue('url') : null,
        };
        form.getFieldValue('id')
          ? await updateIndustryDynamics(params)
          : await createIndustryDynamics(params);
        message.success(form.getFieldValue('id') ? '更新成功' : '创建成功');
        navigate('/releaseManage/industryDynamics');
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
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
        setCompanyPicList([resp.data.id]);
        setImageUrls(resp.data.path);
      });
    },
    onRemove() {
      // setImageUrl('');
    },
    fileList,
  };

  return (
    <Spin spinning={immediate}>
      <div className="bg-white py-[32px] px-[24px] rounded-[8px] shadow-md">
        <Form form={form} labelCol={{ span: 6 }} labelAlign="left">
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Row>
            <Col span={8}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input.TextArea
                  style={{ minHeight: '100px' }}
                  placeholder="请输入标题"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                name="groupId"
                label="栏目名称"
                rules={[{ required: true, message: '请选择栏目名称' }]}
              >
                <Select
                  placeholder="请选择栏目名称"
                  style={{ width: '100%' }}
                  showSearch
                  filterOption
                  options={industryDynamicsGroupList}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                name="type"
                label="类型"
                rules={[{ required: true, message: '请选择类型' }]}
              >
                <Radio.Group
                  options={
                    [
                      { label: '跳转外链接', value: 'url' },
                      { label: '文本内容', value: 'content' },
                    ] as CheckboxGroupProps<string>['options']
                  }
                  onChange={(e) => setType(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="mainImage" label="缩略图">
                <Upload {...CustomUploadProps}>
                  <Button type="primary" loading={loading}>
                    上传图片
                  </Button>
                </Upload>
                {imageUrls && (
                  <div className="flex flex-wrap items-center">
                    <div className="mr-[12px] mt-[12px] relative w-[80px] h-[80px]">
                      <img
                        src={imageUrls || ''}
                        alt={imageUrls || ''}
                        className="w-full h-auto h-cover"
                      />
                      <img
                        src={IconClose}
                        alt="close"
                        className="absolute top-[2px] right-[0px] w-[24px] h-[24px] cursor-pointer"
                        onClick={() => setImageUrls('')}
                      />
                    </div>
                  </div>
                )}
              </Form.Item>
            </Col>
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
            <Row>
              <Col span={8}>
                <Form.Item
                  name="url"
                  label="跳转链接"
                  rules={[{ required: true, message: '请输入跳转链接' }]}
                >
                  <Input placeholder="请输入跳转链接" autoComplete="off" />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Space className="mt-[8px]">
            <Button type="primary" onClick={handleOk}>
              立刻保存
            </Button>
            <Button
              variant="outlined"
              color="default"
              onClick={() => navigate('/releaseManage/industryDynamics')}
            >
              返回
            </Button>
          </Space>
        </Form>
      </div>
    </Spin>
  );
};

export default IndustryDynamicsDetail;

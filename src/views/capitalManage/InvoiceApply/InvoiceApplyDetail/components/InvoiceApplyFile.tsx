import React, { useImperativeHandle, useState } from 'react';
import {
  App,
  Button,
  GetProp,
  Image,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from '@/views/marketManage/AffiliateManage/AffiliateManage.module.scss';
import LinkIcon from '@/assets/svg/icon/link.svg';
import {
  deleteInvoiceApplyFile,
  getInvoiceApplyFile,
  postInvoiceApplyUploadFile,
} from '@/services/capitalManage/invoiceApply/invoiceApplyApi';

export type InvoiceApplyFileProps = {
  invoiceApplyId: string;
  onRefresh: (type: string) => void;
};

export type InvoiceApplyFileRef = {
  loadInvoiceApplyFile: (invoiceApplyId?: string) => Promise<void>;
};

type InvoiceApplyFileType = {
  id: string;
  name: string;
  srcPath: string;
  targetName: string;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const InvoiceApplyFile = React.forwardRef<
  InvoiceApplyFileRef,
  InvoiceApplyFileProps
>(({ invoiceApplyId, onRefresh }, ref) => {
  const { message, modal } = App.useApp();

  const [previewImage, setPreviewImage] = useState<string[]>([]);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [invoiceApplyFile, setInvoiceApplyFile] =
    useState<InvoiceApplyFileType[]>();

  useImperativeHandle(ref, () => ({
    loadInvoiceApplyFile: async (id?: string) => {
      await getInvoiceApplyFile(id || invoiceApplyId).then((res) => {
        setInvoiceApplyFile(res);
      });
    },
  }));

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.jpg,.png',
    showUploadList: false,
    beforeUpload(file) {
      setFileList(fileList.concat([file]));
      return false;
    },
    onChange(info) {
      if (info.fileList.length) {
        const formdata = new FormData();
        formdata.append('file', info.file as FileType); //将每一个文件图片都加进formdata
        postInvoiceApplyUploadFile(formdata, invoiceApplyId as string).then(
          () => {
            message.success('上传成功');
            onRefresh('invoiceApplyFile');
          }
        );
      }
    },
    fileList,
  };

  const delInvoiceFile = (id: string) => {
    try {
      modal.confirm({
        title: '删除开票',
        icon: <ExclamationCircleFilled />,
        content: '确定删除该开票吗？数据删除后将无法恢复！',
        async onOk() {
          await deleteInvoiceApplyFile(id);
          message.success('删除成功');
          onRefresh('invoiceApplyFile');
        },
      });
    } catch {}
  };

  const previewInvoiceFile = (item: InvoiceApplyFileType) => {
    if (!item.srcPath) return;
    try {
      setPreviewImage([item.srcPath]);
      setPreviewOpen(true);
    } catch {
      message.error('获取图片文件地址失败！');
    }
  };

  return (
    <>
      <div className="bg-white rounded-[12px] p-[24px]">
        <div className="flex items-start justify-between">
          <p className={styles['basic-title']}>开票操作</p>
          <Upload {...props}>
            <Button type="primary">上传发票</Button>
          </Upload>
        </div>
        {invoiceApplyFile?.map((item) => (
          <div
            className="flex items-center justify-between py-[15px] rounded-[8px] mb-[10px] px-[12px] bg-neutral-100 cursor-pointer"
            key={item.id}
          >
            <>
              <img src={LinkIcon} className="w-[16px] h-[16px]" alt="" />
              <p className="ml-[10px]">{item.name}</p>
            </>
            <div>
              <Button type="link" onClick={() => previewInvoiceFile(item)}>
                预览发票
              </Button>
              <Button
                variant="link"
                color="red"
                onClick={() => delInvoiceFile(item.id)}
              >
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
      {previewImage && (
        <Image.PreviewGroup
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage([]),
          }}
          items={previewImage}
        />
      )}
    </>
  );
});

export default InvoiceApplyFile;

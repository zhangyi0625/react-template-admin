import { useState } from 'react';
import {
  App,
  Card,
  ConfigProvider,
  type GetProp,
  type TableProps,
  type UploadProps,
  Image,
} from 'antd';
import { SearchTable } from 'customer-search-form-table';
import { getUserFeedbackByPage } from '@/services/websiteInfo/websiteInfoApi';
import { getFileUrl } from '@/services/upload';
import useParentSize from '@/hooks/useParentSize';

const FeedBackType: Record<string, string> = {
  UI: '界面优化',
  FUNCTION: '功能建议',
  BUG: '产品bug',
  OTHER: '其他问题',
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UserFeedback: React.FC = () => {
  const { message } = App.useApp();

  const { height } = useParentSize();

  const [previewImage, setPreviewImage] = useState<string[]>([]);

  const [previewOpen, setPreviewOpen] = useState(false);

  const columns: TableProps['columns'] = [
    {
      title: '反馈类型',
      width: 120,
      align: 'center',
      hidden: true,
      render(value) {
        return <div>{FeedBackType[value.category]}</div>;
      },
    },
    {
      title: '用户名',
      dataIndex: 'customerName',
      width: 120,
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      width: 120,
      align: 'center',
    },
    {
      title: '问题描述',
      key: 'content',
      align: 'center',
      dataIndex: 'content',
      width: 150,
    },
    {
      title: '上传图片',
      key: 'attachments',
      align: 'center',
      width: 80,
      render(value) {
        return (
          <div
            className={`cursor-pointer text-${
              value.attachments ? 'blue' : 'stone'
            }-500 underline font-semibold`}
            onClick={() => previewUrl(value.attachments)}
          >
            {value.attachments ? '查看' : '-'}
          </div>
        );
      },
    },
    {
      title: '提交时间',
      dataIndex: 'created',
      align: 'center',
      width: 200,
    },
  ];

  const previewUrl = (attachments: string | null) => {
    if (!attachments) return;
    try {
      let ids = JSON.parse(attachments);
      let urlList: string[] = [];
      ids.map(async (id: string) => {
        const resp = await getFileUrl(id);
        const file = await getBase64(resp as unknown as FileType);
        urlList.push(file);
      });
      setTimeout(() => {
        setPreviewImage(urlList);
        setPreviewOpen(true);
      }, 300);
    } catch {
      message.error('获取图片文件地址失败！');
    }
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Card
          style={{ flex: 1, marginTop: '8px' }}
          styles={{ body: { height: '100%' } }}
        >
          <SearchTable
            size="small"
            columns={columns}
            bordered
            rowKey="id"
            fetchResultKey="entries"
            pageIndexKey="pageIndex"
            pageSizeKey="pageSize"
            totalKey="total"
            isPagination={false}
            scroll={{ x: 'max-content', y: height - 128 }}
            fetchData={getUserFeedbackByPage}
            isSelection={false}
            onUpdatePagination={() => {}}
          />
        </Card>
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
      </ConfigProvider>
    </>
  );
};

export default UserFeedback;

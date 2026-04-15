import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  type GetProp,
  Image,
  Space,
  type TableProps,
  type UploadProps,
  type TablePaginationConfig,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import {
  AuthenticationManageSearchColumns,
  AuthenticationManageTabItems,
  AuthenticationStatusOptions,
  type AuthenticationStatusType,
} from './config';
import {
  getAuthenticationManageByPage,
  getAuthenticationSupplierManageByPage,
  postAuthenticationCertificationByPass,
  postAuthenticationCertificationByReject,
} from '@/services/marketManage/authenticationManage/authenticationManageApi';
import AuthenticationDetailModal from './AuthenticationDetailModal';
import AuthenticationRejectModal from './AuthenticationRejectModal';
import useParentSize from '@/hooks/useParentSize';
import type {
  AuthenticationAuditUrlType,
  AuthenticationManageParams,
} from '@/services/marketManage/authenticationManage/authenticationManageModel';
import { getFileUrl } from '@/services/upload';
import { updateSearchFilter } from '@/utils/filter';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AuthenticationManage: React.FC = () => {
  const { message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<AuthenticationManageParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: {
        status: 'CREATED',
      },
    });

  const [defaultActiveTabKey, setDefaultActiveTabKey] =
    useState('authentication');

  const [formMaps, setFormMaps] = useState(AuthenticationManageSearchColumns);

  const [detailModal, setDetailModal] = useState<{
    visible: boolean;
    editId: string | null;
    type: 'detail' | 'remark';
  }>({
    visible: false,
    editId: null,
    type: 'detail',
  });

  const [previewImage, setPreviewImage] = useState<string[]>([]);

  const [previewOpen, setPreviewOpen] = useState(false);

  const columns: TableProps['columns'] = [
    {
      title: '申请人',
      dataIndex: 'customerName',
      width: 120,
      hidden: defaultActiveTabKey !== 'authentication',
      align: 'center',
    },
    {
      title: '公司名称',
      width: 120,
      align: 'center',
      render(value) {
        return (
          <div>
            {defaultActiveTabKey === 'authentication'
              ? value.name
              : value.affiliateName}
          </div>
        );
      },
    },
    {
      title: '操作用户',
      dataIndex: 'creator',
      width: 120,
      align: 'center',
      hidden: defaultActiveTabKey === 'authentication',
    },
    {
      title: '联系方式',
      width: 120,
      align: 'center',
      hidden: defaultActiveTabKey !== 'authentication',
      render(value) {
        return <div>{value.contact?.tel}</div>;
      },
    },
    {
      title: '操作邮箱',
      width: 120,
      align: 'center',
      hidden: defaultActiveTabKey !== 'authentication',
      render(value) {
        return <div>{value.contact?.email}</div>;
      },
    },
    {
      title: '营业执照',
      width: 120,
      align: 'center',
      hidden: defaultActiveTabKey !== 'authentication',
      render(value) {
        return (
          <div
            className="text-dull-blue underline cursor-pointer"
            onClick={() => preview(value.credentials, 'BC01')}
          >
            {value.credentials.find(
              (item: AuthenticationAuditUrlType) => item.type === 'BC01',
            )?.name || ''}
          </div>
        );
      },
    },
    {
      title: '无船承运人资质',
      width: 120,
      align: 'center',
      hidden: defaultActiveTabKey !== 'authentication',
      render(value) {
        return (
          <div
            className="text-dull-blue underline cursor-pointer"
            onClick={() => preview(value.credentials, 'BC02')}
          >
            {value.credentials.find(
              (item: AuthenticationAuditUrlType) => item.type === 'BC02',
            )?.name || ''}
          </div>
        );
      },
    },
    {
      title: '统一社会信用代码',
      width: 200,
      align: 'center',
      hidden: defaultActiveTabKey !== 'authentication',
      dataIndex: 'businessCode',
    },
    {
      title: '编辑时间',
      dataIndex: 'updated',
      width: 150,
      hidden: defaultActiveTabKey === 'authentication',
      align: 'center',
    },
    {
      title: '审核状态',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <div>
            {
              AuthenticationStatusOptions.find(
                (item) =>
                  item[
                    defaultActiveTabKey === 'authentication'
                      ? 'strValue'
                      : 'intValue'
                  ] === value.status,
              )?.label
            }
          </div>
        );
      },
    },
    {
      title: '申请时间',
      width: 200,
      align: 'center',
      hidden: defaultActiveTabKey !== 'authentication',
      dataIndex: 'created',
    },
    {
      title: '处理人',
      width: 100,
      align: 'center',
      hidden: defaultActiveTabKey !== 'authentication',
      dataIndex: 'reviewer',
    },
    {
      title: '拒绝原因',
      width: 200,
      align: 'center',
      hidden: defaultActiveTabKey !== 'authentication',
      dataIndex: 'rejectReason',
    },
    {
      title: '变更内容',
      dataIndex: 'brief',
      width: 200,
      align: 'center',
      hidden: defaultActiveTabKey === 'authentication',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              type="default"
              variant="outlined"
              onClick={() =>
                setDetailModal({ visible: true, editId: _.id, type: 'detail' })
              }
              hidden={defaultActiveTabKey === 'authentication'}
            >
              变更详情
            </Button>
            <Button
              color="red"
              variant="outlined"
              onClick={() =>
                setDetailModal({ visible: true, editId: _.id, type: 'remark' })
              }
              hidden={
                defaultActiveTabKey === 'authentication' &&
                _.status !== 'CREATED'
              }
              disabled={_.status === 0 || _.status === 1}
            >
              拒绝
            </Button>
            <Button
              color="blue"
              variant="outlined"
              onClick={() => changeStatus(_.id, 'pass')}
              hidden={
                defaultActiveTabKey === 'authentication' &&
                _.status !== 'CREATED'
              }
              disabled={_.status === 0 || _.status === 1}
            >
              通过
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    formMaps.map((item) => {
      item.selectFieldName = {
        label: 'label',
        value:
          defaultActiveTabKey === 'authentication' ? 'strValue' : 'intValue',
      };
      item.defaultValue =
        defaultActiveTabKey === 'authentication' ? 'CREATED' : 2;
    });
    setFormMaps([...formMaps]);
  }, [defaultActiveTabKey]);

  const tabChange = (key: string) => {
    setDefaultActiveTabKey(key);
    setSearchDefaultForm({
      pageIndex: 1,
      pageSize: 10,
      filter: {
        status: (
          AuthenticationStatusOptions.find(
            (item) => item.label === '待审核',
          ) as AuthenticationStatusType
        )[key === 'authentication' ? 'strValue' : 'intValue'],
      },
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const onUpdateSearch = (info?: AuthenticationManageParams | unknown) => {
    updateSearchFilter(
      searchDefaultForm,
      setSearchDefaultForm,
      ['pageIndex', 'pageSize'],
      info,
    );
  };

  const changeStatus = async (
    id: string,
    type: string,
    params: { rejectReason: string } = { rejectReason: '' },
  ) => {
    try {
      if (type === 'pass') {
        await postAuthenticationCertificationByPass(id);
        message.success('审核通过～');
      } else {
        await postAuthenticationCertificationByReject({
          ...params,
          ids: [id],
          status: 'REJECTED',
        });
        message.success('审核不通过，请修改相关资料～');
        setDetailModal({ visible: false, editId: null, type: 'remark' });
        setSearchDefaultForm({ ...searchDefaultForm });
      }
    } catch {}
  };

  const preview = (row: AuthenticationAuditUrlType[], type: string) => {
    const url = row.find((item) => item.type === type)?.url;
    if (!url) return;
    try {
      let ids = [JSON.parse(url)];
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
          tabList={AuthenticationManageTabItems}
          onTabChange={tabChange}
          defaultActiveTabKey={defaultActiveTabKey}
        >
          <SearchForm
            columns={formMaps}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            iconHidden={true}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 178 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={
            defaultActiveTabKey === 'authentication'
              ? getAuthenticationManageByPage
              : getAuthenticationSupplierManageByPage
          }
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      {detailModal.type === 'detail' ? (
        <AuthenticationDetailModal
          params={detailModal}
          onCancel={() =>
            setDetailModal({ visible: false, editId: null, type: 'detail' })
          }
        />
      ) : (
        <AuthenticationRejectModal
          params={detailModal}
          onCancel={() =>
            setDetailModal({ visible: false, editId: null, type: 'remark' })
          }
          onOk={(params: { rejectReason: string }) =>
            changeStatus(detailModal.editId as string, 'reject', {
              ...params,
            })
          }
        />
      )}
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
};

export default AuthenticationManage;

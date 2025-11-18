import React, { useCallback, useEffect, useState } from 'react';
import { App, Button, Divider, Space, Spin, TableProps, Tag } from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import AffiliateEdit from '@/assets/svg/icon/edit.svg';
import { useLocation } from 'react-router-dom';
import { SearchTable } from 'customer-search-form-table';
import {
  getOpenInterfaceDetail,
  getOpenInterfaceBusiness,
  updateOpenInterface,
  resetOpenInterfaceSecret,
  addOpenInterfaceBusiness,
  updateOpenInterfaceBusiness,
  deleteOpenInterfaceBusiness,
} from '@/services/marketManage/openInterface/openInterfaceApi';
import AddOpenInterfaceModal from '../AddOpenInterfaceModal';
import AddOpenInterfaceBusiness from '../AddOpenInterfaceBusiness';
import { store } from '@/stores/store';
import { formatTime } from '@/utils/format';
import useParentSize from '@/hooks/useParentSize';
import {
  OpenInterfaceBusinessType,
  OpenInterfaceType,
} from '@/services/marketManage/openInterface/openInterfaceModel';
import { copyValue } from '@/utils/tool';

export const OpenInterfaceDetail: React.FC = () => {
  const location = useLocation();

  const { message, modal } = App.useApp();

  const { publicSetting } = store.getState().publicSetting;

  const { height } = useParentSize();

  const [openInterfaceInfo, setOpenInterfaceInfo] =
    useState<OpenInterfaceType | null>(null);

  const [edit, setEdit] = useState<boolean>(false);

  const [params, setParams] = useState<{
    visible: boolean;
    editRow: OpenInterfaceBusinessType | null;
  }>({
    visible: false,
    editRow: null,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    id: null,
  });

  useEffect(() => {
    init();
  }, []);

  const getValue = useCallback(
    (key: string) => {
      return openInterfaceInfo ? openInterfaceInfo[key] : '';
    },
    [openInterfaceInfo]
  );

  const detailOption = [
    {
      label: '客户名:',
      key: 'affiliateName',
      value: getValue('affiliateName'),
    },
    {
      label: '用户名:',
      key: 'customerName',
      value: getValue('customerName'),
    },
    {
      label: 'API Key: ',
      key: 'key',
      value: getValue('key'),
      showCopyTag: true,
    },
    {
      label: 'API Secret: ',
      key: 'secret',
      value: getValue('secret'),
      showCopyTag: true,
      showResetTag: true,
    },
    {
      label: '接入IP白名单:',
      key: 'ipAllows',
      value: getValue('ipAllows'),
    },
    {
      label: '业务回调地址:',
      key: 'callback',
      value: getValue('callback'),
    },
    {
      label: '备注:',
      key: 'remarks',
      value: getValue('remarks'),
    },
  ];

  const columns: TableProps['columns'] = [
    {
      title: '功能',
      width: 150,
      align: 'center',
      render(value) {
        return <div>{publicSetting['openApiGrantItem'][value.item]}</div>;
      },
    },
    {
      title: '请求速率限制',
      width: 150,
      align: 'center',
      dataIndex: 'rateLimit',
    },
    {
      title: '有效期',
      width: 150,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.validTo, 'Y-M-D')}</div>;
      },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              color="blue"
              variant="solid"
              size="small"
              onClick={() => setParams({ visible: true, editRow: _ })}
              style={{
                fontSize: '12px',
                fontWeight: '400',
              }}
            >
              修改
            </Button>
            <Button
              color="danger"
              variant="solid"
              size="small"
              onClick={() => delOpenInterfaceBusiness(_.id)}
              style={{
                fontSize: '12px',
                fontWeight: '400',
              }}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const init = async () => {
    setLoading(true);
    const id = location.pathname.split('/marketManage/openInterface/')[1];
    try {
      const resp = await getOpenInterfaceDetail(id);
      setOpenInterfaceInfo(resp);
      !searchDefaultForm.id && setSearchDefaultForm({ id: resp.id });
      setLoading(false);
    } catch {
      setLoading(true);
    }
  };

  const getBaseInfo = () => {
    return (
      <>
        {detailOption.map((item) => (
          <p
            className="my-[6px] text-stone-500 flex items-center"
            key={item.key}
          >
            {item.label}
            <span className="text-stone-900" id={item.key}>
              {item.value}
            </span>
            {item.showCopyTag && item.value && (
              <Tag
                style={{ margin: '0 10px' }}
                onClick={() => copyValue(item.key)}
              >
                复制
              </Tag>
            )}
            {item.showResetTag && item.value && (
              <Tag color="red" onClick={resetText}>
                重置
              </Tag>
            )}
          </p>
        ))}
      </>
    );
  };

  const onEdit = async (info: OpenInterfaceType) => {
    try {
      await updateOpenInterface(info);
      message.success('修改接口成功～');
      setEdit(false);
      init();
    } catch {
      setEdit(false);
    }
  };

  const resetText = () => {
    modal.confirm({
      title: '重置密钥',
      icon: <ExclamationCircleFilled />,
      content: '确认重置该API Secret！',
      onOk() {
        resetOpenInterfaceSecret(openInterfaceInfo?.id as string).then(() => {
          init();
        });
      },
    });
  };

  const editBusiness = async (editRow: OpenInterfaceBusinessType) => {
    try {
      if (!editRow.id) {
        await addOpenInterfaceBusiness({
          ...editRow,
          userId: openInterfaceInfo?.id as string,
        });
      } else {
        await updateOpenInterfaceBusiness(editRow);
      }
      message.success(editRow.id ? '修改成功～' : '新增成功～');
      setParams({ visible: false, editRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch {
      // setParams({ visible: false, editRow: null });
    }
  };

  const delOpenInterfaceBusiness = (id: string) => {
    modal.confirm({
      title: '删除业务功能',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该API业务功能？数据删除后将无法恢复！',
      onOk() {
        deleteOpenInterfaceBusiness(id).then(() => {
          message.success('删除成功～');
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  return (
    <>
      <Spin spinning={loading}>
        <div className="flex items-start">
          <div className="flex flex-col w-3xl bg-white rounded-[6px] p-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-3xl font-medium">
                  {openInterfaceInfo?.name}
                </p>
                <img
                  src={AffiliateEdit}
                  width={18}
                  height={18}
                  className="ml-[12px] cursor-pointer"
                  alt="edit"
                  onClick={() => setEdit(true)}
                />
              </div>
              <div className="text-gray-500 text-xs font-normal">
                <p>接入状态：{openInterfaceInfo?.valid ? '有效' : '无效'}</p>
                <p>创建时间：{openInterfaceInfo?.created}</p>
              </div>
            </div>
            <Divider />
            {getBaseInfo()}
          </div>
          <div className="max-w-[540px] ml-[16px] flex1 bg-white rounded-[6px] p-[20px]">
            <div className="flex items-center justify-between mb-[20px]">
              <p className="font-medium text-sm">业务功能</p>
              <Button
                variant="filled"
                color="blue"
                style={{
                  fontSize: '12px',
                  fontWeight: '400',
                }}
                icon={<PlusOutlined />}
                onClick={() => setParams({ visible: true, editRow: null })}
              >
                新增功能授权
              </Button>
            </div>
            {searchDefaultForm?.id && (
              <SearchTable
                size="small"
                columns={columns}
                style={{ marginTop: '10px' }}
                pageIndexKey="pageIndex"
                pageSizeKey="pageSize"
                scroll={{ x: 'max-content', y: height - 128 }}
                rowKey="id"
                totalKey="total"
                fetchResultKey="data"
                isPagination={false}
                fetchData={getOpenInterfaceBusiness}
                searchFilter={searchDefaultForm}
                isSelection={false}
                onUpdatePagination={() => {}}
              />
            )}
          </div>
        </div>
      </Spin>
      <AddOpenInterfaceModal
        visible={edit}
        currentRow={openInterfaceInfo}
        onCancel={() => setEdit(false)}
        onOk={onEdit}
      />
      <AddOpenInterfaceBusiness
        params={params}
        onCancel={() => setParams({ visible: false, editRow: null })}
        onOk={editBusiness}
      />
    </>
  );
};

export default OpenInterfaceDetail;

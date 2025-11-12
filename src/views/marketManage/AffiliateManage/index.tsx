import { useEffect, useState } from 'react';
import {
  App,
  Card,
  ConfigProvider,
  type TableProps,
  type TablePaginationConfig,
  Switch,
  Space,
  Button,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import type {
  AffiliateManageParams,
  AffiliateManageType,
} from '@/services/marketManage/affiliateManage/affiliateManageModel';
import useParentSize from '@/hooks/useParentSize';
import {
  addAffiliateManage,
  getAffiliateManageByPage,
  updateAffiliateManage,
  updateAffiliateSearchSupplier,
} from '@/services/marketManage/affiliateManage/affiliateManageApi';
import AddAffiliate from './AddAffiliate';
import {
  AffiliateLevel,
  AffiliateManageSearchColumns,
  AffiliateManageTabItems,
} from './config';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getPublicData, getPublicSetting } from '@/services/system/setting';
import { setPublicData } from '@/stores/store';

const AffiliateManage: React.FC = () => {
  const { message } = App.useApp();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<AffiliateManageParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: {},
      sort: { validTo: '-1' },
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: AffiliateManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '公司名称',
      dataIndex: 'name',
      width: 200,
      align: 'center',
    },
    {
      title: '客户分类',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <div>
            {AffiliateLevel?.find((item) => item.value === value.type)?.label}
          </div>
        );
      },
    },
    {
      title: '会员有效截止日期',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div>
            {value.grade?.validTo
              ? formatTime(value.grade?.validTo, 'Y/M/D')
              : '-'}
          </div>
        );
      },
    },
    {
      title: '剩余天数',
      align: 'center',
      width: 150,
      render(value) {
        const oneDay = 24 * 60 * 60 * 1000;
        const validTo = new Date(value.validTo).getTime();
        const difference = Math.abs(
          validTo - new Date(value.validTo).getTime()
        );
        return value.validTo && <div>{Math.ceil(difference / oneDay)}</div>;
      },
      hidden: !searchDefaultForm.filter.expiredDays,
    },
    {
      title: '联系方式',
      width: 120,
      align: 'center',
      render(value) {
        return <div>{value.contact?.tel ?? ''}</div>;
      },
    },
    {
      title: '所在省市',
      dataIndex: 'addressCity',
      width: 150,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      width: 200,
      align: 'center',
    },
    {
      title: '社会统一信用代码',
      dataIndex: 'businessCode',
      width: 200,
      align: 'center',
    },
    {
      title: '供应商查询',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <Switch
            value={Boolean(value.showSupplier)}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={(e) => switchChange(e, value)}
          />
        );
      },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              type="default"
              variant="outlined"
              onClick={() => navigate(`/marketManage/affiliateManage/${_.id}`)}
            >
              查看
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    Promise.all([getPublicData(), getPublicSetting()]).then((res) => {
      dispatch(setPublicData(res));
    });
  }, []);

  const tabChange = (key: string) => {
    onUpdateSearch({ expiredDays: key });
  };

  const switchChange = (e: boolean, row: AffiliateManageType) => {
    updateAffiliateSearchSupplier({ show: e }, row.id as string).then(() => {
      message.success('修改成功～');
      setSearchDefaultForm({ ...searchDefaultForm });
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const onUpdateSearch = (info?: AffiliateManageParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined
      )
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize', 'sort'],
      true
    );
    setSearchDefaultForm({
      ...pageInfo,
      filter: { ...filteredObj },
    });
  };

  const onEditOk = async (editRow: AffiliateManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addAffiliateManage(editRow);
      } else {
        // 编辑数据
        await updateAffiliateManage(editRow, editRow.id as string);
      }
      message.success(!editRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, editRow: null });
    }
  };

  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider>
        <Card
          tabList={AffiliateManageTabItems.map((item) => ({
            ...item,
            key: item.key as unknown as string,
          }))}
          onTabChange={tabChange}
        >
          <SearchForm
            columns={AffiliateManageSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 17 },
                sm: { span: 7 },
              },
              wrapperCol: {
                xs: { span: 4 },
                sm: { span: 20 },
              },
            }}
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
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增客户
          </Button>
        </Space>
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          bordered
          scroll={{ x: 'max-content', y: height - 178 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getAffiliateManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddAffiliate
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default AffiliateManage;

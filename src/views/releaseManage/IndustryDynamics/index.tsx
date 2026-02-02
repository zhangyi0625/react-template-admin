import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import useParentSize from '@/hooks/useParentSize';
import type { IndustryDynamicsSearchParams } from '@/services/releaseManage/industryDynamics/industryDynamicsModel';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { IndustryDynamicsSearchColumns } from './config';
import {
  deleteIndustryDynamics,
  getIndustryDynamicsGroup,
  getIndustryDynamicsListByPage,
} from '@/services/releaseManage/industryDynamics/industryDynamicsApi';

import IndustryDynamicsProgramDrawer from './IndustryDynamicsProgramDrawer';
import { filterKeys } from '@/utils/tool';
import { useNavigate } from 'react-router-dom';

const IndustryDynamics: React.FC = () => {
  const { modal, message } = App.useApp();

  const navigate = useNavigate();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<IndustryDynamicsSearchParams>({
      page: 1,
      limit: 10,
    });

  const [industryDynamicsGroupList, setIndustryDynamicsGroupList] = useState<
    { id: string; name: string }[]
  >([]);

  const [formMaps, setFormMaps] = useState(IndustryDynamicsSearchColumns);

  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    loadIndustryDynamicsGroupList();
  }, [drawerVisible]);

  const loadIndustryDynamicsGroupList = async () => {
    try {
      const resp = await getIndustryDynamicsGroup();
      formMaps.map((i) => {
        i.options = resp || [];
      });
      setIndustryDynamicsGroupList(resp || []);
      setFormMaps([...formMaps]);
    } catch {}
  };

  const columns: TableProps['columns'] = [
    {
      title: '栏目名称',
      align: 'center',
      width: 120,
      render(value) {
        return (
          <div>
            {(industryDynamicsGroupList || []).find(
              (i) => i.id === value.groupId,
            )?.name || '-'}
          </div>
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      width: 250,
    },
    {
      title: '阅读量',
      dataIndex: 'readCount',
      align: 'center',
      width: 100,
    },
    {
      title: '类型',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{value.content ? '文本内容' : '跳转外链接'}</div>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      width: 180,
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() => {
                navigate(`/releaseManage/industryDynamics/${_.id}`);
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteBatch(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除行业动态',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该行业动态吗？数据删除后将无法恢复！',
      onOk() {
        deleteIndustryDynamics(id).then(() => {
          message.success('删除成功～');
          // 刷新表格数据
          onUpdateSearch();
        });
      },
    });
  };

  const onUpdateSearch = (info?: IndustryDynamicsSearchParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
    );
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true);
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={formMaps}
            gutterWidth={24}
            iconHidden={true}
            labelPosition="left"
            btnSeparate={false}
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
        <Space className="mb-[8px]">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              navigate(
                `/releaseManage/industryDynamics/${Math.random().toString(36).substring(2)}?type=add`,
              )
            }
          >
            发布动态
          </Button>
          <Button
            variant="outlined"
            color="default"
            onClick={() => setDrawerVisible(true)}
          >
            栏目设置
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          rowKey="id"
          isPagination={true}
          fetchResultKey="list"
          totalKey="count"
          pageIndexKey="page"
          pageSizeKey="limit"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getIndustryDynamicsListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <IndustryDynamicsProgramDrawer
        industryDynamicsGroupList={industryDynamicsGroupList}
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        onFresh={loadIndustryDynamicsGroupList}
      />
    </>
  );
};

export default IndustryDynamics;

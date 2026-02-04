import { useState } from 'react';
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
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { MemberUnitAboutSearchColumns } from './config';
import { useNavigate } from 'react-router-dom';
import useParentSize from '@/hooks/useParentSize';
import {
  createMemberUnitAbout,
  deleteMemberUnitAbout,
  getMemberUnitAboutListByPage,
  updateMemberUnitAbout,
} from '@/services/releaseManage/memberUnitAbout/memberUnitAboutApi';
import type {
  MemberUnitAboutSearchParams,
  MemberUnitAboutType,
} from '@/services/releaseManage/memberUnitAbout/memberUnitAboutModel';
import MemberUnitAboutModal from './MemberUnitAboutModal';
import { filterKeys } from '@/utils/tool';

const MemberUnitAbout: React.FC = () => {
  const { modal, message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const navigate = useNavigate();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<MemberUnitAboutSearchParams>({
      page: 1,
      limit: 10,
      // sort: 'update_time',
      // order: 'desc',
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: MemberUnitAboutType | null;
    source: 'industryDynamics' | 'memberUnitAbout';
  }>({
    visible: false,
    currentRow: null,
    source: 'memberUnitAbout',
  });

  // 固定写死协会概况需要合并
  const onCellCallback = (record: MemberUnitAboutType, index: number) => {
    // 只处理协会概况分组的合并
    if (record.groupName === '协会概况') {
      // 固定写死：第一个协会概况分组返回合并行数 4，其他返回 0
      if (index === 0) {
        // 第一个协会概况分组，返回合并行数 4
        return { rowSpan: 4 };
      } else if (index < 4) {
        // 不是第一个协会概况分组，返回 0
        return { rowSpan: 0 };
      }
    }
    // 其他分组不合并
    return { rowSpan: 1 };
  };

  const columns: TableProps['columns'] = [
    {
      title: '分组',
      dataIndex: 'groupName',
      align: 'center',
      width: 120,
      onCell: (record, index) =>
        onCellCallback(record as MemberUnitAboutType, index as number),
    },
    {
      title: '栏目名称',
      dataIndex: 'columnName',
      align: 'center',
      width: 150,
      // onCell: sharedOnCell,
    },
    {
      title: '栏目类型',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.content ? '文本' : '图片'}</div>;
      },
    },
    {
      title: '组内显示顺序',
      dataIndex: 'sort',
      align: 'center',
      width: 100,
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
                navigate(`/releaseManage/memberUnitAbout/${_.id}`);
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
      title: '删除协会概况',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该协会概况吗？数据删除后将无法恢复！',
      onOk() {
        deleteMemberUnitAbout(id).then(() => {
          message.success('删除成功～');
          // 刷新表格数据
          onUpdateSearch();
        });
      },
    });
  };

  const onEditOk = async (routeRow: MemberUnitAboutType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await createMemberUnitAbout(routeRow);
      } else {
        // 编辑数据
        await updateMemberUnitAbout(routeRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!params.currentRow ? '添加成功' : '修改成功');
      setParams({
        visible: false,
        currentRow: null,
        source: 'memberUnitAbout',
      });
      onUpdateSearch();
    } catch (error) {}
  };

  const onUpdateSearch = (info?: MemberUnitAboutSearchParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'sort', 'order'],
      true,
    );
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
            columns={MemberUnitAboutSearchColumns}
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
              setParams({
                visible: true,
                currentRow: null,
                source: 'memberUnitAbout',
              })
            }
          >
            新增
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
          fetchData={getMemberUnitAboutListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <MemberUnitAboutModal
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({
            visible: false,
            currentRow: null,
            source: 'memberUnitAbout',
          })
        }
      />
    </>
  );
};

export default MemberUnitAbout;

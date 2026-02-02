import { useEffect, useState } from 'react';
import { App, Button, Drawer, Space, Table, type TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { MemberUnitAboutType } from '@/services/releaseManage/memberUnitAbout/memberUnitAboutModel';
import {
  createIndustryDynamicsGroup,
  deleteIndustryDynamicsGroup,
  updateIndustryDynamicsGroup,
} from '@/services/releaseManage/industryDynamics/industryDynamicsApi';
import MemberUnitAboutModal from '../MemberUnitAbout/MemberUnitAboutModal';

export type IndustryDynamicsProgramParams = {
  visible: boolean;
  industryDynamicsGroupList: { id: string; name: string }[];
  onCancel: () => void;
  onFresh: () => void;
};

const IndustryDynamicsProgramDrawer: React.FC<
  IndustryDynamicsProgramParams
> = ({ visible, industryDynamicsGroupList, onCancel, onFresh }) => {
  const { message } = App.useApp();

  const [tableData, setTableData] = useState<MemberUnitAboutType[]>([]);

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: MemberUnitAboutType | null;
    source: 'industryDynamics' | 'memberUnitAbout';
  }>({
    visible: false,
    currentRow: null,
    source: 'industryDynamics',
  });

  const tableColumns: TableProps['columns'] = [
    {
      title: '栏目名称',
      dataIndex: 'name',
      align: 'center',
      width: 120,
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
                setParams({
                  visible: true,
                  currentRow: _,
                  source: 'industryDynamics',
                });
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

  useEffect(() => {
    if (!visible) return;
    init();
  }, [visible]);

  const init = async () => {};

  const onEditOk = async (routeRow: MemberUnitAboutType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await createIndustryDynamicsGroup(routeRow);
      } else {
        // 编辑数据
        await updateIndustryDynamicsGroup(routeRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!params.currentRow ? '添加成功' : '修改成功');
      setParams({
        visible: false,
        currentRow: null,
        source: 'industryDynamics',
      });
      onFresh();
    } catch (error) {}
  };

  const deleteBatch = async (id: string) => {
    try {
      await deleteIndustryDynamicsGroup(id);
      message.success('删除成功');
      onFresh();
    } catch (error) {}
  };

  return (
    <>
      <Drawer
        title="栏目设置"
        open={visible}
        onClose={onCancel}
        maskClosable={false}
        width={800}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            setParams({
              visible: true,
              currentRow: null,
              source: 'industryDynamics',
            })
          }
        >
          新增栏目
        </Button>
        <Table
          columns={tableColumns}
          dataSource={industryDynamicsGroupList}
          pagination={false}
        />
      </Drawer>
      <MemberUnitAboutModal
        params={params}
        onCancel={() => setParams({ ...params, visible: false })}
        onOk={onEditOk}
      />
    </>
  );
};

export default IndustryDynamicsProgramDrawer;

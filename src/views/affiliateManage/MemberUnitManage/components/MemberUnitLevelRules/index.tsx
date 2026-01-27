import DragModal from '@/components/modal/DragModal';
import { Table, TableProps } from 'antd';
import { MemberUnitManageMemberLevelOptions } from '../../config';

export type MemberUnitLevelRulesProps = {
  visible: boolean;
  onCancel: () => void;
};

const MemberUnitLevelRules: React.FC<MemberUnitLevelRulesProps> = ({
  visible,
  onCancel,
}) => {
  const tableData = [
    {
      level: '累计年限',
      V1: '<3',
      V2: '≥ 3年',
      V3: '≥ 10年',
      V4: '≥ 15年',
      V5: '≥ 20年',
    },
    {
      level: '连续年限',
      V1: '<1',
      V2: '≥ 1年',
      V3: '≥ 3年',
      V4: '≥ 5年',
      V5: '≥ 10年',
    },
  ];

  const getLevelOptions = () => {
    return MemberUnitManageMemberLevelOptions?.map((item) => ({
      title: item.label,
      dataIndex: item.label,
      width: 80,
      align: 'center',
    })) as TableProps['columns'];
  };

  const columns: TableProps['columns'] = [
    {
      title: '会员等级',
      width: 100,
      align: 'center',
      dataIndex: 'level',
    },
    ...(getLevelOptions() || []),
  ];
  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title="等级计算规则"
      width={{ xl: 760, xxl: 1000 }}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey={() => Math.random().toString(36).substring(2)}
      />
    </DragModal>
  );
};
export default MemberUnitLevelRules;

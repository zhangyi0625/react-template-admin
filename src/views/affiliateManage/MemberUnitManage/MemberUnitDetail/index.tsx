import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Drawer, Row, Spin, Tabs, TabsProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import DefaultAvatar from '@/assets/svg/icon/default-logo.svg';
import V1 from '@/assets/svg/icon/v1.png';
import V2 from '@/assets/svg/icon/v2.png';
import V3 from '@/assets/svg/icon/v3.png';
import V4 from '@/assets/svg/icon/v4.png';
import V5 from '@/assets/svg/icon/v5.png';
import { getMemberUnitManageDetail } from '@/services/affiliateManage/memberUnitManage/memberUnitManageApi';
import type {
  MemberUnitManageDetailType,
  MemberUnitManageType,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import { MemberUnitManageUnitLevelOptions } from '../config';
import MemberUnitDetailBaseInfo, {
  MemberUnitDetailBaseInfoRef,
} from './MemberUnitBaseInfo';
import MemberUnitPerson, { MemberUnitPersonRef } from './MemberUnitPerson';
import MemberUnitRecord, { MemberUnitRecordRef } from './MemberUnitRecord';
import MemberUnitLevelRules from '../components/MemberUnitLevelRules';

export type MemberUnitDetailProps = {
  visible: boolean;
  currentRow: MemberUnitManageType | null;
  onCancel: () => void;
};

export type MemberUnitDetailBaseInfoType = {
  label: string;
  value: () => string | number;
  span?: number;
};

const levelMap = {
  1: V1,
  2: V2,
  3: V3,
  4: V4,
  5: V5,
};

const MemberUnitDetail: React.FC<MemberUnitDetailProps> = ({
  visible,
  currentRow,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState<MemberUnitManageDetailType | null>(null);

  const [defaultActiveKey, setDefaultActiveKey] = useState(
    'memberUnitDetailBaseInfo',
  );

  const baseInfoRef = useRef<MemberUnitDetailBaseInfoRef>(null);

  const MemberUnitPersonRef = useRef<MemberUnitPersonRef>(null);

  const MemberUnitRecordRef = useRef<MemberUnitRecordRef>(null);

  const [levelRulesVisible, setLevelRulesVisible] = useState(false);

  const getValueByKey = useCallback(
    (key: keyof MemberUnitManageDetailType) => () => {
      return detail?.[key] ?? '-';
    },
    [detail],
  );

  const baseInfo = [
    {
      label: '社会统一信用代码：',
      value: getValueByKey('socialCode'),
      span: 8,
    },
    {
      label: '会员单位等级',
      value: () => {
        return (
          MemberUnitManageUnitLevelOptions?.find(
            (item) => item.value === getValueByKey('unitLevel')(),
          )?.label ?? '-'
        );
      },
      span: 8,
    },
    {
      label: '会员到期日期：',
      value: getValueByKey('memberExpiryDate'),
      span: 8,
    },
    {
      label: '企业联系电话：',
      value: getValueByKey('contactPhone'),
      span: 8,
    },
    {
      label: '地址：',
      value: getValueByKey('address'),
      span: 8,
    },
    {
      label: '创建日期：',
      value: getValueByKey('createTime'),
      span: 24,
    },
    {
      label: '企业简介：',
      value: getValueByKey('enterpriseDescription'),
      span: 24,
    },
  ];

  const TabItems: TabsProps['items'] = [
    {
      label: '企业信息',
      key: 'memberUnitDetailBaseInfo',
      children: (
        <MemberUnitDetailBaseInfo
          ref={baseInfoRef}
          detail={(detail as MemberUnitManageDetailType) || {}}
          baseInfo={baseInfo as MemberUnitDetailBaseInfoType[]}
        />
      ),
    },
    {
      label: '会员成员',
      key: 'memberUnitPerson',
      children: (
        <MemberUnitPerson
          ref={MemberUnitPersonRef}
          detail={(detail as MemberUnitManageDetailType) || {}}
        />
      ),
    },
    {
      label: '入会记录',
      key: 'memberUnitRecord',
      children: (
        <MemberUnitRecord
          ref={MemberUnitRecordRef}
          detail={(detail as MemberUnitManageDetailType) || {}}
        />
      ),
    },
  ];

  useEffect(() => {
    visible && init();
  }, [visible]);

  const init = async () => {
    setLoading(true);
    try {
      const resp = await getMemberUnitManageDetail(currentRow?.id as string);
      setDetail(resp);
      setLoading(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const changeActiveKey = (key: string) => {
    setDefaultActiveKey(key);
    if (key === 'memberUnitPerson') {
      MemberUnitPersonRef.current?.onRefresh();
    } else if (key === 'memberUnitRecord') {
      MemberUnitRecordRef.current?.onRefresh();
    }
  };

  return (
    <Drawer
      title="会员单位"
      width={936}
      open={visible}
      closeIcon={false}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onCancel} />}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      footer={null}
    >
      <Spin spinning={loading}>
        <div className="flex items-center">
          <img
            src={detail?.logo ?? DefaultAvatar}
            className="w-[56px] h-[49px]"
            alt=""
          />
          <div className="flex flex-col ml-[12px]">
            <div className="text-xl font-semibold">{detail?.name}</div>
            <div className="flex items-center mt-[3px]">
              <img
                src={levelMap[detail?.unitLevel as keyof typeof levelMap]}
                className="w-[43px] h-[18px]"
                alt=""
              />
              <p
                className="underline text-blue-500 text-sm ml-[4px] font-normal cursor-pointer"
                onClick={() => setLevelRulesVisible(true)}
              >
                查看等级计算规则
              </p>
            </div>
          </div>
        </div>
        <Row gutter={24}>
          {baseInfo.slice(0, baseInfo.length - 2).map((item) => (
            <Col key={item.label} span={item.span || 8}>
              <div className="flex items-center whitespace-nowrap mt-[12px]">
                <div className="text-sm text-gray-400">{item.label}</div>
                <div className="text-sm text-stone-900 ml-[8px]">
                  {item.value()}
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Tabs
          items={TabItems}
          defaultActiveKey={defaultActiveKey}
          onChange={changeActiveKey}
        />
      </Spin>
      <MemberUnitLevelRules
        visible={levelRulesVisible}
        onCancel={() => setLevelRulesVisible(false)}
      />
    </Drawer>
  );
};

export default MemberUnitDetail;

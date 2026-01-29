import { useCallback, useEffect, useRef, useState } from 'react';
import {
  App,
  Button,
  Col,
  Drawer,
  Row,
  SelectProps,
  Spin,
  Tabs,
  TabsProps,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import DefaultAvatar from '@/assets/svg/icon/default-logo.svg';
import V1 from '@/assets/svg/icon/v1.png';
import V2 from '@/assets/svg/icon/v2.png';
import V3 from '@/assets/svg/icon/v3.png';
import V4 from '@/assets/svg/icon/v4.png';
import V5 from '@/assets/svg/icon/v5.png';
import {
  deleteCompanyImage,
  getCompanyImageDetail,
  getMemberUnitManageDetail,
  updateMemberUnitManage,
  uploadCompanyImage,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageApi';
import type {
  MemberUnitManageDetailType,
  MemberUnitManageType,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import {
  MemberUnitManageAdvantageOptions,
  MemberUnitManageUnitLevelOptions,
} from '../config';
import MemberUnitDetailBaseInfo, {
  MemberUnitDetailBaseInfoRef,
} from './MemberUnitBaseInfo';
import MemberUnitPerson, { MemberUnitPersonRef } from './MemberUnitPerson';
import MemberUnitRecord, { MemberUnitRecordRef } from './MemberUnitRecord';
import MemberUnitLevelRules from '../components/MemberUnitLevelRules';
import MemberUnitModal from '../MemberUnitModal';
import { getCarrierManageList } from '@/services/essential/carrierManage/carrierManageApi';
import { getAllPortManageList } from '@/services/essential/portManage/portManageModel';
import { getRouteManageList } from '@/services/customerInformation/routeManage/routeManageApi';
import { PortManageType } from '@/services/essential/portManage/portManageApi';
import { CarrierManageType } from '@/services/essential/carrierManage/carrierManageModel';
import { RouteMangeType } from '@/services/customerInformation/routeManage/routeManageModel';
import { previewPreviewFile } from '@/services/upload';

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

export type AdvantageListType = {
  advantageBusiness: SelectProps['options'];
  advantagePor: PortManageType[];
  advantageFnd: PortManageType[];
  advantageRoute: PortManageType[];
  advantageCarrier: CarrierManageType[];
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
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState<MemberUnitManageDetailType | null>(null);

  const [defaultActiveKey, setDefaultActiveKey] = useState(
    'memberUnitDetailBaseInfo',
  );

  const [editBaseInfo, setEditBaseInfo] = useState<{
    visible: boolean;
    currentRow: MemberUnitManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const baseInfoRef = useRef<MemberUnitDetailBaseInfoRef>(null);

  const MemberUnitPersonRef = useRef<MemberUnitPersonRef>(null);

  const MemberUnitRecordRef = useRef<MemberUnitRecordRef>(null);

  const [levelRulesVisible, setLevelRulesVisible] = useState(false);

  const [logo, setLogo] = useState('');

  const [advantageList, setAdvantageList] = useState<AdvantageListType>({
    advantageBusiness: [],
    advantagePor: [],
    advantageFnd: [],
    advantageRoute: [],
    advantageCarrier: [],
  });

  const [companyPicList, setCompanyPicList] = useState<
    { companyId: string; imageId: string; id: string }[]
  >([]);

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

  useEffect(() => {
    if (!visible) return;
    setDefaultActiveKey('memberUnitDetailBaseInfo');
    init();
    loadAdvantage();
  }, [visible]);

  const init = async () => {
    setLoading(true);
    try {
      const resp = await getMemberUnitManageDetail(currentRow?.id as string);
      loadCompanyPic();
      setDetail(resp);
      if (resp.logo) {
        const imageId = await previewPreviewFile(resp.logo ?? '');
        const image = await getBase64(imageId as Blob);
        setLogo(image);
      } else {
        setLogo(DefaultAvatar);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const loadCompanyPic = async () => {
    try {
      const resp = await getCompanyImageDetail(currentRow?.id as string);
      setCompanyPicList(resp ?? []);
    } catch {}
  };

  const uploadCompanyPic = async (imageId: string) => {
    try {
      await uploadCompanyImage({
        companyId: currentRow?.id as string,
        imageId: imageId,
      });
      message.success('上传成功');
      setTimeout(() => {
        init();
      }, 1000);
    } catch {}
  };

  const deleteCompanyPicItem = async (imageId: string) => {
    try {
      await deleteCompanyImage(
        companyPicList?.find((item) => item.imageId === imageId)?.id ?? '',
      );
      message.success('删除成功');
      setTimeout(() => {
        init();
      }, 1000);
    } catch {}
  };

  const changeActiveKey = (key: string) => {
    setDefaultActiveKey(key);
    if (key === 'memberUnitPerson') {
      MemberUnitPersonRef.current?.onRefresh();
    } else if (key === 'memberUnitRecord') {
      MemberUnitRecordRef.current?.onRefresh();
    }
  };

  const refreshBaseInfo = async (currentRow: MemberUnitManageType) => {
    await updateMemberUnitManage(currentRow);
    message.success('修改成功');
    setEditBaseInfo({ visible: false, currentRow: null });
    init();
  };

  const loadAdvantage = async () => {
    try {
      Promise.all([
        getAllPortManageList({ isPor: true }),
        getAllPortManageList({ isFnd: true }),
        getRouteManageList({}),
        getCarrierManageList({}),
      ]).then((result) => {
        // setAdvantageList(result[0] ?? []);
        setAdvantageList({
          advantageBusiness: MemberUnitManageAdvantageOptions,
          advantagePor:
            result[0].map((i: PortManageType) => ({
              ...i,
              label: i.cnName,
              value: i.code,
            })) ?? [],
          advantageFnd:
            result[1].map((i: PortManageType) => ({
              ...i,
              label: i.cnName,
              value: i.code,
            })) ?? [],
          advantageRoute:
            result[2].filter((i: RouteMangeType) => i.parentId) ?? [],
          advantageCarrier:
            result[3].map((i: CarrierManageType) => {
              return {
                ...i,
                label: i.cnName,
                value: i.code,
              };
            }) ?? [],
        });
      });
    } catch {}
  };

  const changeAdvantageItem = async (
    item: string,
    key: keyof MemberUnitManageDetailType,
    type: 'delete' | 'create',
  ) => {
    try {
      let info = {
        ...detail,
        [key]:
          type === 'delete'
            ? String(detail?.[key])
                ?.replace(item, '')
                .split(',')
                .filter(Boolean)
                .join(',')
            : (detail?.[key]
                ? String(detail?.[key])
                    ?.replace(item, '')
                    ?.split(',')
                    .filter(Boolean)
                : []
              )
                .concat(item)
                .join(','),
      };
      console.log(item, key, type, info, detail?.[key]);
      // return;
      await updateMemberUnitManage(info as MemberUnitManageType);
      message.success(type === 'delete' ? '删除成功' : '添加成功');
      setTimeout(() => {
        init();
      }, 1000);
    } catch {}
  };

  const TabItems: TabsProps['items'] = [
    {
      label: '企业信息',
      key: 'memberUnitDetailBaseInfo',
      children: (
        <MemberUnitDetailBaseInfo
          ref={baseInfoRef}
          detail={(detail as MemberUnitManageDetailType) || {}}
          baseInfo={baseInfo as MemberUnitDetailBaseInfoType[]}
          advantageList={advantageList}
          companyPicList={companyPicList.map((item) => item.imageId)}
          deleteCompanyPicItem={deleteCompanyPicItem}
          editBaseInfo={() =>
            setEditBaseInfo({ visible: true, currentRow: detail })
          }
          uploadCompanyPic={uploadCompanyPic}
          changeAdvantageItem={changeAdvantageItem}
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

  const getBase64 = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

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
          <img src={logo} className="w-[56px] h-[49px]" alt="" />
          <div className="flex flex-col ml-[12px]">
            <div className="text-xl font-semibold">{detail?.name}</div>
            <div className="flex items-center mt-[3px]">
              <img
                src={levelMap[detail?.memberLevel as keyof typeof levelMap]}
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
                  {item.value() as string}
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
      <MemberUnitModal
        params={editBaseInfo}
        onCancel={() => setEditBaseInfo({ visible: false, currentRow: null })}
        onOk={refreshBaseInfo}
      />
    </Drawer>
  );
};

export default MemberUnitDetail;

import { useCallback } from 'react';
import './index.scss';
import { Select } from 'antd';
import AdvantageIcon from '@/assets/svg/icon/advantage-close.svg';
import type { MemberUnitManageDetailType } from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import type { AdvantageListType } from '../../MemberUnitDetail';
import type { PortManageType } from '@/services/essential/portManage/portManageApi';

export type MemberUnitAdvantageProps = {
  business: Pick<
    MemberUnitManageDetailType,
    | 'advantageBusiness'
    | 'advantagePor'
    | 'porList'
    | 'advantageFnd'
    | 'fndList'
    | 'advantageRoute'
    | 'routeList'
    | 'advantageCarrier'
    | 'carrierList'
  >;
  advantageList: AdvantageListType;
  deleteAdvantageItem: (
    item: string,
    key: keyof MemberUnitManageDetailType,
  ) => void;
  createAdvantageItem: (
    item: string,
    key: keyof MemberUnitManageDetailType,
  ) => void;
};

const MemberUnitAdvantage: React.FC<MemberUnitAdvantageProps> = ({
  business = {
    advantageBusiness: '',
    advantagePor: '宁波,上海',
    advantageFnd: '迈阿密,纽约,费城',
    advantageRoute: '',
    advantageCarrier: '',
  },
  advantageList,
  deleteAdvantageItem,
  createAdvantageItem,
}) => {
  const getValueByKey = useCallback(
    (key: keyof AdvantageListType | keyof MemberUnitManageDetailType) => {
      const value = (business as any)[key];
      return value
        ? key === 'advantageBusiness'
          ? value.split(',')
          : value.map((i: PortManageType) =>
              key !== 'routeList' ? i.cnName : i.name,
            )
        : [];
    },
    [business],
  );
  return (
    <>
      <div className="flex items-start mt-[20px]">
        <p className="advantage-label">优势业务：</p>
        <div className="flex flex-wrap">
          {getValueByKey('advantageBusiness').map((item: string) => (
            <div
              key={item}
              className="advantage-item"
              onClick={() => deleteAdvantageItem(item, 'advantageBusiness')}
            >
              {item}
              <img className="icon" src={AdvantageIcon} alt="" />
            </div>
          ))}
          <Select
            options={advantageList.advantageBusiness}
            showSearch
            filterOption={(input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            fieldNames={{ label: 'label', value: 'label' }}
            placeholder="请选择"
            className="advantage-select"
            onChange={(value) => {
              createAdvantageItem(value, 'advantageBusiness');
            }}
          />
        </div>
      </div>
      <div className="flex items-start mt-[20px]">
        <p className="advantage-label">优势起运港：</p>
        <div className="flex flex-wrap">
          {getValueByKey('porList').map((item: string) => (
            <div
              key={item}
              className="advantage-item"
              onClick={() => deleteAdvantageItem(item, 'advantagePor')}
            >
              {item}
              <img className="icon" src={AdvantageIcon} alt="" />
            </div>
          ))}
          <Select
            options={advantageList.advantagePor}
            showSearch
            fieldNames={{ label: 'cnName', value: 'code' }}
            filterOption={(input, option) =>
              String(option?.cnName ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            placeholder="请选择"
            className="advantage-select"
            onChange={(value) => {
              createAdvantageItem(value, 'advantagePor');
            }}
          />
        </div>
      </div>
      <div className="flex items-start mt-[20px]">
        <p className="advantage-label">优势目的港：</p>
        <div className="flex flex-wrap">
          {getValueByKey('fndList').map((item: string) => (
            <div
              key={item}
              className="advantage-item"
              onClick={() => deleteAdvantageItem(item, 'advantageFnd')}
            >
              {item}
              <img className="icon" src={AdvantageIcon} alt="" />
            </div>
          ))}
          <Select
            options={advantageList.advantageFnd}
            showSearch
            filterOption={(input, option) =>
              String(option?.cnName ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            fieldNames={{ label: 'cnName', value: 'code' }}
            placeholder="请选择"
            className="advantage-select"
            onChange={(value) => {
              createAdvantageItem(value, 'advantageFnd');
            }}
          />
        </div>
      </div>
      <div className="flex items-start mt-[20px]">
        <p className="advantage-label">优势航线：</p>
        <div className="flex flex-wrap">
          {getValueByKey('routeList').map((item: string) => (
            <div
              key={item}
              className="advantage-item"
              onClick={() => deleteAdvantageItem(item, 'advantageRoute')}
            >
              {item}
              <img className="icon" src={AdvantageIcon} alt="" />
            </div>
          ))}
          <Select
            options={advantageList.advantageRoute}
            showSearch
            filterOption={(input, option) =>
              String(option?.cnName ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            fieldNames={{ label: 'name', value: 'code' }}
            placeholder="请选择"
            className="advantage-select"
            onChange={(value) => {
              createAdvantageItem(value, 'advantageRoute');
            }}
          />
        </div>
      </div>
      <div className="flex items-start mt-[20px]">
        <p className="advantage-label">优势船东：</p>
        <div className="flex flex-wrap">
          {getValueByKey('carrierList').map((item: string) => (
            <div
              key={item}
              className="advantage-item"
              onClick={() => deleteAdvantageItem(item, 'advantageCarrier')}
            >
              {item}
              <img className="icon" src={AdvantageIcon} alt="" />
            </div>
          ))}
          <Select
            options={advantageList.advantageCarrier}
            showSearch
            filterOption={(input, option) =>
              String(option?.cnName ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            placeholder="请选择"
            className="advantage-select"
            onChange={(value) => {
              createAdvantageItem(value, 'advantageCarrier');
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MemberUnitAdvantage;

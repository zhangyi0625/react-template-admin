import { useCallback, useMemo } from 'react';
import './index.scss';
import { Select } from 'antd';
import AdvantageIcon from '@/assets/svg/icon/advantage-close.svg';
import type { MemberUnitManageDetailType } from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import type { AdvantageListType } from '../../MemberUnitDetail';

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

type AdvantageItemConfig = {
  label: string;
  valueKey: keyof MemberUnitManageDetailType;
  listKey: keyof MemberUnitManageDetailType;
  optionsKey: keyof AdvantageListType;
  isString?: boolean;
  displayField?: 'cnName' | 'name';
};

const advantageConfigs: AdvantageItemConfig[] = [
  {
    label: '优势业务',
    valueKey: 'advantageBusiness',
    listKey: 'advantageBusiness',
    optionsKey: 'advantageBusiness',
    isString: true,
  },
  {
    label: '优势起运港',
    valueKey: 'advantagePor',
    listKey: 'porList',
    optionsKey: 'advantagePor',
    displayField: 'cnName',
  },
  {
    label: '优势目的港',
    valueKey: 'advantageFnd',
    listKey: 'fndList',
    optionsKey: 'advantageFnd',
    displayField: 'cnName',
  },
  {
    label: '优势航线',
    valueKey: 'advantageRoute',
    listKey: 'routeList',
    optionsKey: 'advantageRoute',
    displayField: 'name',
  },
  {
    label: '优势船东',
    valueKey: 'advantageCarrier',
    listKey: 'carrierList',
    optionsKey: 'advantageCarrier',
    displayField: 'cnName',
  },
];

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
      if (!value) return [];

      // advantageBusiness是字符串，需要分割成数组
      if (key === 'advantageBusiness') {
        return value.split(',');
      }

      // 其他字段已经是数组
      return value;
    },
    [business],
  );

  const AdvantageItem = useCallback(
    ({ config }: { config: AdvantageItemConfig }) => {
      const { label, valueKey, listKey, optionsKey, isString, displayField } =
        config;
      const items = getValueByKey(listKey);
      const options = advantageList[optionsKey] as any;

      return (
        <div className="flex items-start mt-[20px]" key={label}>
          <p className="advantage-label">{label}：</p>
          <div className="flex flex-wrap">
            {items.map((item: any) => (
              <div
                key={item.code || item}
                className="advantage-item"
                onClick={() => deleteAdvantageItem(item.code || item, valueKey)}
              >
                {isString ? item : item[displayField || 'cnName']}
                <img className="icon" src={AdvantageIcon} alt="" />
              </div>
            ))}
            <Select
              options={options}
              showSearch
              filterOption={(input, option) =>
                String(option?.[displayField || 'label'] ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              fieldNames={
                isString
                  ? { label: 'label', value: 'label' }
                  : { label: displayField || 'cnName', value: 'code' }
              }
              placeholder="请选择"
              className="advantage-select"
              onChange={(value) => {
                createAdvantageItem(value, valueKey);
              }}
            />
          </div>
        </div>
      );
    },
    [advantageList, deleteAdvantageItem, createAdvantageItem, getValueByKey],
  );

  const advantageItems = useMemo(
    () =>
      advantageConfigs.map((config) => (
        <AdvantageItem key={config.label} config={config} />
      )),
    [AdvantageItem],
  );
  return <>{advantageItems}</>;
};

export default MemberUnitAdvantage;

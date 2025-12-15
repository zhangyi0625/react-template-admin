import { useCallback } from 'react';
import styles from '../cabinMonitoring.module.scss';
import DragModal from '@/components/modal/DragModal';
import type {
  CabinMonitoringDetailType,
  CabinMonitoringRestrictType,
} from '@/services/cabinInformation/cabinMonitoring/cabinMonitoringModel';
import { CabinMonitoringExtraForms, VesselStatusOptions } from '../config';
import { isArray } from 'lodash-es';
import { formatTime } from '@/utils/format';
import { safeJsonParse } from '@/utils/tool';

export type CabinMonitoringDetailProps = {
  params: {
    visible: boolean;
    currentRow: CabinMonitoringDetailType | null;
  };
  onCancel: () => void;
};

const CabinMonitoringDetail: React.FC<CabinMonitoringDetailProps> = ({
  params,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const getValueByKey = useCallback(
    (key: string) => {
      if (!currentRow || !params.visible) {
        return undefined;
      }
      return (currentRow as { [key: string]: any })[key] ?? '';
    },
    [currentRow, params.visible]
  );

  const baseInfoOptions = [
    {
      label: '任务名称',
      key: 'taskName',
      value: getValueByKey('taskName'),
    },
    {
      label: '船公司',
      key: 'carrier',
      value: getValueByKey('carrier'),
    },
    {
      label: '业务类型',
      key: 'carrierType',
      value: `${getValueByKey('carrier')}${getValueByKey('carrierType')}`,
    },
    {
      label: '箱型',
      key: 'ctnType',
      value: (getValueByKey('ctnType') ?? []).join(','),
    },
    {
      label: '船司账号',
      key: 'accounts',
      value: (
        (getValueByKey('accounts') as CabinMonitoringDetailType['accounts']) ||
        []
      )
        .map((item) => item.username)
        .join(','),
    },
    {
      label: '港口',
      key: 'portConfig',
      value: (
        (getValueByKey(
          'portConfig'
        ) as CabinMonitoringDetailType['portConfig']) || []
      ).map((i, index: number) => (
        <span key={index}>
          {i.por.name + '-' + i.fnd.name}
          {index < getValueByKey('portConfig').length - 1 && <span>,</span>}
        </span>
      )),
    },
  ];

  const getWorkDay = (type: 'workday' | 'nonworkdays') => {
    let newArr =
      (safeJsonParse(getValueByKey('restrict')) as Record<
        string,
        CabinMonitoringRestrictType
      >) ?? [];
    return isArray(newArr[type])
      ? newArr[type].map((i, index) => (
          <div key={index}>
            {formatTime(i.startTime, 'h:m:s') +
              ' ~ ' +
              formatTime(i.endTime, 'h:m:s')}
            <span className="ml-[10px]">
              频率{i.min}-{i.max}分钟刷新一次
            </span>
          </div>
        ))
      : '';
  };

  const getExtraOptions = () => {
    let options = CabinMonitoringExtraForms[getValueByKey('carrierType')] || [];
    let extraInfo = {
      ...getValueByKey('extra'),
      ...(getValueByKey('extra')?.emergencyContact ?? {}),
      vesselStatus: (getValueByKey('extra')?.vesselStatus ?? [])
        .map((i: string) => {
          let maps = VesselStatusOptions ?? [];
          if (maps.find((item) => item.value === i)) {
            return {
              label: maps.find((item) => item.value === i)?.label ?? '',
              value: i,
            };
          }
        })
        .map((item: { label: string }) => item.label)
        .join(','),
    };
    let newArr = options.map((item) => ({
      ...item,
      value: extraInfo[item.name],
    }));
    return newArr;
  };
  return (
    <>
      <DragModal
        width={{ xl: 850, xxl: 1000 }}
        open={visible}
        title="任务详情"
        onCancel={onCancel}
        footer={null}
      >
        <div className={styles['cabinMonitoring-detail']}>
          <div className={styles['title-item']}>
            <span></span>
            <p>基本信息</p>
          </div>
          <div className="grid grid-cols-2 gap-y-[8px]">
            {baseInfoOptions.map((item) => (
              <div key={item.key} className="flex items-start">
                <span className={styles['basic-title']}>{item.label}：</span>
                <p className={styles['basic-value']}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className={styles['title-item']}>
            <span></span>
            <p>ETD起止日期</p>
          </div>
          <div className="text-gray-500 flex items-start">
            <span className={styles['basic-title']}>ETD起止日期：</span>
            <p className={styles['basic-value']}>
              {(
                (getValueByKey(
                  'etdRange'
                ) as CabinMonitoringDetailType['etdRange']) || []
              ).map((i, index) => (
                <span key={index}>
                  {formatTime(i.startDate, 'M-D') +
                    ' ~ ' +
                    formatTime(i.endDate, 'M-D')}
                </span>
              ))}
            </p>
          </div>
          <div className={styles['title-item']}>
            <span></span>
            <p>监控要求</p>
          </div>
          <div className="grid grid-cols-2 gap-y-[8px]">
            <div className="flex items-start">
              <span className={styles['basic-title']}>工作日：</span>
              <div className={styles['basic-value']}>
                {getWorkDay('workday')}
              </div>
            </div>
            <div className="flex items-start">
              <span className={styles['basic-title']}>非工作日：</span>
              <div className={styles['basic-value']}>
                {getWorkDay('nonworkdays')}
              </div>
            </div>
          </div>
          <div className={styles['title-item']}>
            <span></span>
            <p>额外参数</p>
          </div>
          <div className="grid grid-cols-2 gap-y-[8px]">
            {getExtraOptions().map((item, index) => (
              <div key={index} className="flex items-start">
                <span className={styles['basic-title']}>{item.label}：</span>
                <p className={styles['basic-value']}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className={styles['title-item']}>
            <span></span>
            <p>通知邮箱</p>
          </div>
          <div className="text-gray-500 flex items-start">
            <span className={styles['basic-title']}>邮箱：</span>
            <p className={styles['basic-value']}>
              {(getValueByKey('email') || []).join(',')}
            </p>
          </div>
        </div>
      </DragModal>
    </>
  );
};

export default CabinMonitoringDetail;

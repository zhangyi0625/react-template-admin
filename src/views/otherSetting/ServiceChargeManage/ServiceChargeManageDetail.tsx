import { useEffect, useState } from 'react';
import { Button, Input, Space } from 'antd';
import styles from './serviceChargeManage.module.scss';
import DragModal from '@/components/modal/DragModal';
import { getServiceChargeManageDetail } from '@/services/otherSetting/serviceChargeManage/serviceChargeManageApi';
import type { ServiceChargeFeeItems } from '@/services/otherSetting/serviceChargeManage/serviceChargeManageModel';
import { store } from '@/stores/store';
import { LevelSetting } from '@/enums/setting';

export type ServiceChargeManageDetailProps = {
  params: {
    visible: boolean;
    id: string;
  };
  onCancel: () => void;
  onOk: (array: ServiceChargeFeeItems[]) => void;
};

const ServiceChargeManageDetail: React.FC<ServiceChargeManageDetailProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, id } = params;

  const { publicData } = store.getState().publicSetting;

  const [loading, setLoading] = useState<boolean>(false);

  const [serviceFeeOptions, setServiceFeeOptions] =
    useState<{ label: string; items: ServiceChargeFeeItems[] }[]>();

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setServiceFeeOptions(undefined);
    loadServiceChargeManageDetail();
  }, [visible]);

  const loadServiceChargeManageDetail = async () => {
    try {
      const resp = await getServiceChargeManageDetail(id);
      const serviceFeeType: Record<string, 'BK01' | 'BK02' | 'BK03'> =
        publicData.serviceFeeType;
      for (let i in serviceFeeType) {
        resp.items.map((item: ServiceChargeFeeItems) => {
          if (item.type === i) {
            setServiceFeeOptions((prev) => {
              const existed = prev || [];
              const idx = existed.findIndex(
                (g) => g.label === serviceFeeType[i]
              );
              if (idx >= 0) {
                existed[idx].items.push(item);
                return [...existed];
              }
              return [...existed, { label: serviceFeeType[i], items: [item] }];
            });
          }
        });
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const getLevelOptions = () => {
    let keys = Object.keys(LevelSetting).filter(
      (key) => key !== 'L9' && key !== 'L21'
    );
    return keys.map((key) => ({
      label: LevelSetting[key as keyof typeof LevelSetting],
      value: Number(key.replace('L', '')),
    }));
  };

  const inputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    label: string,
    type: 'standard' | 'bond'
  ) => {
    setServiceFeeOptions((prev) => {
      const existed = prev || [];
      existed.forEach((item) => {
        if (item.label === label) {
          item.items[index][type] = Number(e.target.value);
        }
      });
      return [...existed];
    });
  };

  const handleOk = () => {
    onOk(
      serviceFeeOptions?.reduce<ServiceChargeFeeItems[]>(
        (acc, val) => acc.concat(val.items),
        []
      ) || []
    );
  };

  return (
    <DragModal
      title="费用明细"
      open={visible}
      onCancel={onCancel}
      width={{ xl: 880, xxl: 1000 }}
      footer={
        <Space size={16}>
          <Button type="primary" onClick={handleOk}>
            确定修改
          </Button>
          <Button type="default" onClick={onCancel}>
            取消
          </Button>
        </Space>
      }
      loading={loading}
      className={styles['service-chargeManage-detail']}
    >
      <div className="flex flex-row">
        {serviceFeeOptions?.map((item) => (
          <div
            key={item.label}
            className={styles['service-chargeManage-detail-flex']}
          >
            <div className={styles['service-chargeManage-detail-flex-title']}>
              <div>{item.label}</div>
              <div className="flex items-center mt-[6px]">
                <p className="w-[90px]">服务费</p>
                <p className="w-[90px] ml-[12px]">保证金</p>
              </div>
            </div>
            {item.items.map((i, index) => (
              <div
                key={i.id}
                className={styles['service-chargeManage-detail-flex-items']}
              >
                <div className={styles['label']}>
                  {
                    getLevelOptions().find((l) => l.value === i.customerLevel)
                      ?.label
                  }
                </div>
                <Input
                  className={styles['input']}
                  value={i.standard}
                  onChange={(e) =>
                    inputChange(e, index, item.label, 'standard')
                  }
                />
                <Input
                  className={styles['input']}
                  value={i.bond}
                  onChange={(e) => inputChange(e, index, item.label, 'bond')}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </DragModal>
  );
};

export default ServiceChargeManageDetail;

import React, { useState } from 'react';
import { App, Button, Drawer, Table } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CabinMonitoringCarrierType } from './config';
import CabinMonitoringExtraSettingModal from './CabinMonitoringExtraSettingModal';
import { putCabinMonitoringExtra } from '@/services/cabinInformation/cabinMonitoring/cabinMonitoringApi';
import { CabinMonitoringExtraParams } from '@/services/cabinInformation/cabinMonitoring/cabinMonitoringModel';

export type CabinMonitoringExtraSettingProps = {
  visible: boolean;
  onCancel: () => void;
};

const CabinMonitoringExtraSetting: React.FC<
  CabinMonitoringExtraSettingProps
> = ({ visible, onCancel }) => {
  const { message } = App.useApp();

  const tableData = CabinMonitoringCarrierType.filter(
    (i) => i.carrier === 'MSK'
  );

  const [extraSettingVisible, setExtraSettingVisible] = useState<{
    visible: boolean;
    carrierType: string;
  }>({ visible: false, carrierType: '' });

  const onEditOk = async (params: CabinMonitoringExtraParams) => {
    try {
      await putCabinMonitoringExtra(params);
      message.success('修改配置成功');
      setExtraSettingVisible({ visible: false, carrierType: '' });
    } catch {}
  };
  return (
    <>
      <Drawer
        title="额外参数设置"
        width={600}
        open={visible}
        closeIcon={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
        }
        onClose={onCancel}
      >
        <Table
          dataSource={tableData}
          rowKey="value"
          pagination={false}
          columns={[
            {
              title: '船公司',
              dataIndex: 'carrier',
              align: 'center',
            },
            {
              title: '业务类型',
              dataIndex: 'label',
              align: 'center',
            },
            {
              title: '操作',
              fixed: 'right',
              align: 'center',
              render(_) {
                return (
                  <Button
                    type="link"
                    onClick={() =>
                      setExtraSettingVisible({
                        visible: true,
                        carrierType: _.value,
                      })
                    }
                  >
                    编辑额外参数
                  </Button>
                );
              },
            },
          ]}
        />
      </Drawer>
      <CabinMonitoringExtraSettingModal
        visible={extraSettingVisible.visible}
        onCancel={() =>
          setExtraSettingVisible({ visible: false, carrierType: '' })
        }
        onOk={onEditOk}
        carrierType={extraSettingVisible.carrierType}
      />
    </>
  );
};

export default CabinMonitoringExtraSetting;

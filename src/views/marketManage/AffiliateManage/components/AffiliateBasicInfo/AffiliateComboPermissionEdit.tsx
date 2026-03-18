import React, { useEffect } from 'react';
import styles from '../../AffiliateManage.module.scss';
import { Form, Input, Radio } from 'antd';
import DragModal from '@/components/modal/DragModal';
import { ComboPermission } from '@/enums/setting';
import type { EquityRightsBaseEditType } from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsModel';

export type AffiliateComboPermissionEditProps = {
  visible: boolean;
  currentRow: Omit<EquityRightsBaseEditType, 'affiliateId'> | null;
  onCancel: () => void;
  onOk: (params: Omit<EquityRightsBaseEditType, 'affiliateId'>) => void;
};

export const AffiliateComboPermissionEdit: React.FC<
  AffiliateComboPermissionEditProps
> = ({ visible, currentRow, onCancel, onOk }) => {
  const { Search } = Input;

  useEffect(() => {
    if (!visible) return;
    form.setFieldsValue({ ...currentRow });
  }, [visible]);

  const [form] = Form.useForm();

  const handleOk = () => {
    onOk({ ...form.getFieldsValue() });
  };

  return (
    <>
      <DragModal
        open={visible}
        onCancel={onCancel}
        title="编辑查询模式"
        width={{ xl: 600, xxl: 1000 }}
        onOk={handleOk}
      >
        <Form form={form} labelCol={{ span: 8 }}>
          <Form.Item name="module" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="limitType"
            label={`${
              currentRow &&
              ComboPermission[currentRow.module as keyof typeof ComboPermission]
                ? ComboPermission[
                    currentRow.module as keyof typeof ComboPermission
                  ]
                : ''
            }查询模式`}
          >
            <Radio.Group>
              <Radio value="DAY">按套餐模式</Radio>
              <Radio value="COUNT">按总数扣除</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="queryLimit"
            label={`额外${
              currentRow &&
              ComboPermission[currentRow.module as keyof typeof ComboPermission]
                ? ComboPermission[
                    currentRow.module as keyof typeof ComboPermission
                  ]
                : ''
            }查询购买`}
          >
            <Search
              placeholder="0"
              className={styles['queryLimitInput']}
              enterButton={
                <>
                  <div>次</div>
                </>
              }
            />
          </Form.Item>
        </Form>
      </DragModal>
    </>
  );
};

export default AffiliateComboPermissionEdit;

import { TableProps } from 'antd';
import { formatTime } from '@/utils/format';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { ServiceSettingType } from './config';

type formSettingType = Pick<
  CustomColumn,
  'label' | 'name' | 'formType' | 'isRules' | 'options'
>;

export const getTemplateSetting = (carrier?: string, statusType?: string) => {
  const columns = [
    {
      title: '抢舱模式',
      key: 'startType',
      align: 'center',
      hidden: statusType !== 'RUNNING',
      width: 120,
      render(value) {
        return (
          <div>
            {value.startType === 'SAME_FREQ'
              ? '同频放舱'
              : ServiceSettingType.find(
                  (item) => item.value === value.startType
                )?.label}
          </div>
        );
      },
    },
    {
      title: '船公司',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'center',
      width: 80,
    },
    {
      title: '起运港',
      key: 'porCode',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div>
            {value.por.enName ?? ''} - {value.por.cnName ?? ''}
          </div>
        );
      },
    },
    {
      title: '目的港',
      key: 'fndCode',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div>
            {value.fnd.enName ?? ''} - {value.fnd.cnName ?? ''}
          </div>
        );
      },
    },
    {
      title: '船司航线',
      key: 'route',
      dataIndex: 'routeFndName',
      align: 'center',
      width: 100,
    },
    {
      title: '客户名称',
      key: 'customerName',
      align: 'center',
      width: 300,
      render(value) {
        return (
          <div className="text-blue-500 cursor-pointer underline text-sm">
            {value.customerName}
          </div>
        );
      },
    },
    {
      title: 'ETD',
      key: 'etd',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.etd, 'M-D')}</div>;
      },
    },
    {
      title: '箱型',
      key: 'ctntype',
      dataIndex: 'ctnType',
      align: 'center',
    },
    {
      title: '箱型/票数',
      key: 'ctnQty',
      align: 'center',
      width: 120,
      render(value) {
        return (
          <div>
            {value.ctnQty} / {value.ctnTicket}
          </div>
        );
      },
    },
    {
      title: '额外免箱',
      key: 'extra',
      align: 'center',
      width: 150,
      hidden: carrier !== 'MSK',
      render(value) {
        return <div>{value.extra?.extentDndFreeDays ?? '-'}</div>;
      },
    },
    {
      title: 'rollable',
      key: 'extra',
      align: 'center',
      width: 150,
      hidden: carrier !== 'MSK',
      render(value) {
        return <div>{value.extra?.withRollable ? '需要' : '不需要'}</div>;
      },
    },
    {
      title: '购买保值服务',
      key: 'insurance',
      align: 'center',
      width: 150,
      hidden: carrier !== 'OOCL',
      render(value) {
        return <div>{value.extra?.insurance ? '需要' : '不需要'}</div>;
      },
    },

    {
      title: '合约号',
      key: 'extra',
      align: 'center',
      width: 120,
      hidden: carrier !== 'MSK',
      render(value) {
        return <div>{value.extra?.contractNo ?? ''}</div>;
      },
    },
    {
      title: '价格上限',
      dataIndex: 'priceLimit',
      key: 'priceLimit',
      align: 'center',
      width: 120,
    },
    {
      title: '创建时间',
      key: 'createTime',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.createTime, 'Y-M-D h:m')}</div>;
      },
    },
  ] as TableProps['columns'];

  const formSetting: Record<string, formSettingType[]> = {
    MSK: [
      {
        label: '关联约号',
        isRules: false,
        name: 'contractNo',
        formType: 'input',
      },
      {
        label: '免箱期',
        isRules: true,
        name: 'extentDndFreeDays',
        formType: 'inputNumber',
      },
      {
        label: 'rollable',
        isRules: true,
        formType: 'radio',
        name: 'withRollable',
        options: [
          {
            label: '需要',
            value: 1,
          },
          {
            label: '不需要',
            value: 0,
          },
        ],
      },
    ],
    OOCL: [
      {
        label: '购买保值服务',
        isRules: true,
        formType: 'radio',
        name: 'insurance',
        options: [
          {
            label: '需要',
            value: 1,
          },
          {
            label: '不需要',
            value: 0,
          },
        ],
      },
    ],
  };

  const operationColumns: TableProps['columns'] = [
    {
      title: '操作人',
      key: 'userName',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '操作时间',
      key: 'updateTime',
      align: 'center',
      render(value) {
        return <div>{formatTime(value.updateTime, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '操作信息',
      key: 'etd',
      align: 'center',
      dataIndex: 'content',
    },
  ];
  return {
    columns: columns,
    formSetting: formSetting,
    operationColumns: operationColumns,
  };
};

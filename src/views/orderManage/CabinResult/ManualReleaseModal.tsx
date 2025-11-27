import { useEffect, useState } from 'react';
import styles from './cabinResult.module.scss';
import {
  Form,
  Select,
  Row,
  Col,
  Button,
  Space,
  Input,
  type TableProps,
  DatePicker,
  type SelectProps,
  App,
} from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import DragModal from '@/components/modal/DragModal';
import {
  getSearchPort,
  getShippingSchedule,
} from '@/services/orderManage/regularBooking/regularBookingApi';
import { formatTime } from '@/utils/format';
import { filterKeys } from '@/utils/tool';
import dayjs from 'dayjs';
import { SearchTable } from 'customer-search-form-table';
import type { ManualpublicationType } from '@/services/orderManage/cabinResult/cabinResultModel';
import { changeSelectOptionsByLabel } from '@/utils/options';
import { loadSearchPortData } from '@/utils/freight';

export type ManualReleaseType = {
  params: {
    visible: boolean;
    editRow: any;
    carrierOptions?: string[];
  };
  onOk: (params: ManualpublicationType) => void;
  onCancel: () => void;
};

type PortType = {
  POR?: SelectProps['options'];
  FND?: SelectProps['options'];
  [key: string]: SelectProps['options'];
};

const ManualRelease: React.FC<ManualReleaseType> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, editRow, carrierOptions = [] } = params;
  const [form] = Form.useForm();

  const { message } = App.useApp();

  const [loading, setLoading] = useState<boolean>(false);

  const [immediate, setImmediate] = useState<boolean>(true);

  const [searchDefaultForm, setSearchDefaultForm] = useState();

  const [defalueOptions, setDefaultOptions] = useState<PortType>({
    POR: [],
    FND: [],
  });

  const columns: TableProps['columns'] = [
    {
      title: 'ETD',
      align: 'center',
      render(value) {
        return <div>{formatTime(value.etd, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: 'ETA',
      align: 'center',
      render(value) {
        return <div>{formatTime(value.eta, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '船名/航次',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div>
            {value.vesselName ?? ''} / {value.voyage ?? ''}
          </div>
        );
      },
    },
    {
      dataIndex: 'routeCode',
      title: '航线代码',
      align: 'center',
    },
    {
      title: '直达/中转',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.transferInfoList ? '中转' : '直达'}</div>;
      },
    },
    {
      dataIndex: 'totalDuration',
      title: '航程',
      align: 'center',
    },
  ];

  useEffect(() => {
    if (!visible) return;
    init();
  }, [visible]);

  const init = async () => {
    setLoading(true);
    form.resetFields();
    let info = filterKeys(
      editRow,
      ['carrier', 'etd', 'voyNo', 'vesselName', 'remark'],
      true
    );

    const porInfo: DefaultOptionType[] = await getSearchPort({
      keyword: editRow.porName.split(',')[0],
      tag: 'POR',
    });
    const fndInfo: DefaultOptionType[] = await getSearchPort({
      keyword: editRow.fndName.split(',')[0],
      tag: 'FND',
    });
    setDefaultOptions({
      POR: porInfo ?? [],
      FND: fndInfo ?? [],
    });
    setTimeout(() => {
      setLoading(false);
      form.setFieldsValue({
        ...params.editRow,
        ...info,
        porCode: porInfo[0].unlocode ?? '',
        fndCode: fndInfo[0].unlocode || '',
        etd: dayjs(info.etd) ?? '',
      });
    }, 500);
  };

  const loadShippingSchedule = () => {
    if (!form.getFieldValue('vesselName')) {
      message.error('填写需要获取船期的船名～');
      return;
    }
    setSearchDefaultForm(
      filterKeys(form.getFieldsValue(), ['porCode', 'fndCode', 'carrier'], true)
    );
    setImmediate(false);
  };

  const getPortSelect = (type: string) => {
    return (
      <Select
        allowClear
        placeholder={`请输入${type === 'POR' ? '起运' : '目的'}港`}
        showSearch
        defaultActiveFirstOption={false}
        suffixIcon={null}
        notFoundContent={null}
        filterOption={false}
        onSearch={(value: string) => handleSearch(value, type)}
        options={(defalueOptions[type] || []).map((d) => ({
          label: (
            <div className="">
              <p>
                {d.localName} - {d.name}
              </p>
              <p>
                {d.countryLocalName} - {d.countryName}
              </p>
            </div>
          ),
          value: d.unlocode,
        }))}
      />
    );
  };

  const handleSearch = (newValue: string, type: 'POR' | 'FND' | string) => {
    if (!newValue || !newValue.trim()) return;
    loadSearchPortData(newValue, type, setDefaultOptions, getSearchPort);
  };

  const changeSelected = (_: string[], checked: any[]) => {
    const { transferInfoList, eta, totalDuration, vesselName, etd } =
      checked[0];
    form.setFieldsValue({
      transshipment: transferInfoList ? 1 : 0,
      eta: dayjs(eta),
      etd: dayjs(etd),
      etaEtdDay: totalDuration,
      vesselName: vesselName,
    });
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        const info = filterKeys(
          form.getFieldsValue(),
          ['etaEtdDay', 'carrier', 'vesselName', 'transshipment'],
          true
        );
        const prices = JSON.parse(form.getFieldValue('price')) ?? {};
        const params = {
          ...info,
          porId: defalueOptions['POR']![0].id || '',
          fndId: defalueOptions['FND']![0].id || '',
          voyageNo: form.getFieldValue('voyNo'),
          haulage: 'CY-CY',
          transitDays: '',
          etd: formatTime(form.getFieldValue('etd'), 'Y-M-D h:m:s'),
          eta: formatTime(form.getFieldValue('eta'), 'Y-M-D h:m:s'),
          validFrom: formatTime(new Date() as unknown as string, 'Y-M-D h:m:s'),
          validTo: formatTime(form.getFieldValue('etd'), 'Y-M-D h:m:s'),
          deadlines: {
            SI: formatTime(form.getFieldValue('etd'), 'Y-M-D h:m:s'),
          },
          remarks: form.getFieldValue('remark'),
          inventories: [
            {
              containerType: Object.keys(
                JSON.parse(form.getFieldValue('inventories'))
              )[0],
              discountPrice: prices?.bas.value,
              inventory: '0',
              price: prices?.bas.value,
              priceCurrency: prices?.bas.currency,
            },
          ],
        };
        onOk({ ...params });
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  return (
    <DragModal
      open={visible}
      width={'60%'}
      title="手动发布"
      onOk={handleOk}
      onCancel={() => {
        setImmediate(true), onCancel();
      }}
      okText="发布"
      loading={loading}
      className={styles['cabinResult']}
    >
      <Form form={form} labelCol={{ span: 6 }} labelAlign="left">
        <Form.Item name="inventories" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="prices" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="起运港" name="porCode">
              {getPortSelect('POR')}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="目的港" name="fndCode">
              {getPortSelect('FND')}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="船公司" name="carrier">
              <Select
                allowClear
                placeholder="请选择船公司"
                showSearch
                defaultActiveFirstOption={false}
                filterOption={false}
                options={carrierOptions.map((d) => ({
                  value: d,
                  label: d,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="船名">
              <Space>
                <Form.Item
                  noStyle
                  name="vesselName"
                  rules={[{ required: true, message: '请输入船名' }]}
                >
                  <Input
                    autoFocus={false}
                    allowClear
                    autoComplete="off"
                    placeholder="请输入船名"
                  />
                </Form.Item>
                <Button type="primary" onClick={loadShippingSchedule}>
                  获取船期
                </Button>
              </Space>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="航次"
              name="voyNo"
              rules={[{ required: true, message: '请输入航次' }]}
            >
              <Input
                autoFocus={false}
                allowClear
                autoComplete="off"
                placeholder="请输入航次"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="直达/中转"
              name="transshipment"
              rules={[{ required: true, message: '请选择直达/中转' }]}
            >
              <Select
                allowClear
                placeholder="请选择直达/中转"
                showSearch
                defaultActiveFirstOption={false}
                filterOption={false}
                options={changeSelectOptionsByLabel(['直达', '中转'])}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="ETD"
              name="etd"
              rules={[{ required: true, message: '请选择ETD' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                showTime={{ format: 'YYYY-MM-DD' }}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="ETA"
              name="eta"
              rules={[{ required: true, message: '请选择ETA' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="航程"
              name="etaEtdDay"
              rules={[{ required: true, message: '请输入航程' }]}
            >
              <Input
                autoFocus={false}
                allowClear
                autoComplete="off"
                placeholder="请输入航程"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="remark">
              <Input
                autoFocus={false}
                allowClear
                autoComplete="off"
                placeholder="请输入备注"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <SearchTable
        columns={columns}
        rowKey="id"
        fetchData={getShippingSchedule}
        searchFilter={searchDefaultForm}
        isSelection={true}
        isPagination={false}
        totalKey="total"
        fetchResultKey="data"
        onUpdatePagination={() => {
          return;
        }}
        selectionParentType="radio"
        immediate={immediate}
        onUpdateSelection={changeSelected}
      />
    </DragModal>
  );
};

export default ManualRelease;

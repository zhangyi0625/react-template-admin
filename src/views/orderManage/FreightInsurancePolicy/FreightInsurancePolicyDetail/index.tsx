import { useCallback, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { getFreightInsurancePolicyDetail } from '@/services/orderManage/freightInsurancePolicy/freightInsurancePolicyApi';
import { FreightInsurancePolicyDetailType } from '@/services/orderManage/freightInsurancePolicy/freightInsurancePolicyModel';
import { safeJsonParse } from '@/utils/tool';

type FreightInsurancePolicyDetailOptionsType = {
  label: string;
  value: string | void;
  key: string;
};

const FreightInsurancePolicyDetail: React.FC = () => {
  const params = useParams();

  const [loading, setLoading] = useState(false);

  const [detail, setDetail] =
    useState<Partial<FreightInsurancePolicyDetailType>>();

  const titleStyle = clsx('text-lg font-semibold');

  const wordStyle = clsx(
    'font-normal text-sm text-[#303133] min-w-[88px] text-right whitespace-nowrap',
  );

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  const getValueByKey = useCallback(
    (key: string) => {
      return detail?.[key as keyof FreightInsurancePolicyDetailType] ?? '';
    },
    [detail],
  );

  const FreightInsurancePolicyDetailOptions: {
    policyholderInfo: FreightInsurancePolicyDetailOptionsType[];
    cargoInfo: FreightInsurancePolicyDetailOptionsType[];
    insuranceConditions: FreightInsurancePolicyDetailOptionsType[];
    insuranceInfo: FreightInsurancePolicyDetailOptionsType[];
  } = {
    policyholderInfo: [
      {
        label: '投保人：',
        value: getValueByKey('customerName'),
        key: 'customerName',
      },
      {
        label: '被保险人：',
        value: getValueByKey('insuredname'),
        key: 'insuredname',
      },
    ],
    cargoInfo: [
      {
        label: '货物大类：',
        value: getValueByKey('cargoname'),
        key: 'cargoname',
      },
      {
        label: '包装方式：',
        value: getValueByKey('packagename'),
        key: 'packagename',
      },
      {
        label: '唛头：',
        value: getValueByKey('labelname'),
        key: 'labelname',
      },
      {
        label: '货物描述：',
        value: getValueByKey('cargodesc'),
        key: 'cargodesc',
      },
      {
        label: '货物包装/数量单位：',
        value: getValueByKey('packageunit'),
        key: 'packageunit',
      },
      {
        label: '发票号：',
        value: getValueByKey('invoice'),
        key: 'invoice',
      },
      {
        label: '提单/运单号：',
        value: getValueByKey('billno'),
        key: 'billno',
      },
      {
        label: '运输方式：',
        value: getValueByKey('transportmode'),
        key: 'transportmode',
      },
      {
        label: '船名/车号：',
        value: getValueByKey('shipname'),
        key: 'shipname',
      },
      {
        label: '起运地：',
        value: getValueByKey('portloading'),
        key: 'portloading',
      },
      {
        label: '目的地：',
        value: getValueByKey('destination'),
        key: 'destination',
      },
      {
        label: '转运地：',
        value: getValueByKey('transhipment'),
        key: 'transhipment',
      },
      {
        label: '起运日期：',
        value: getValueByKey('commitdate'),
        key: 'commitdate',
      },
      {
        label: '查勘代理人：',
        value: getValueByKey('inspectagent'),
        key: 'inspectagent',
      },
      {
        label: '赔付地点：',
        value: getValueByKey('compensationplace'),
        key: 'compensationplace',
      },
      {
        label: '是否做信用证：',
        value: getValueByKey('iscredit'),
        key: 'iscredit',
      },
      {
        label: '信用证号：',
        value: getValueByKey('creditno'),
        key: 'creditno',
      },
    ],
    insuranceConditions: [
      {
        label: '条款内容：',
        value: getValueByKey('mainclausecontent'),
        key: 'mainclausecontent',
      },
      {
        label: '免赔：',
        value: getValueByKey('applyno'),
        key: 'applyno',
      },
      {
        label: '特约:：',
        value: getValueByKey('premium'),
        key: 'premium',
      },
      {
        label: '发票金额:：',
        value: getValueByKey('invoiceamount'),
        key: 'invoiceamount',
      },
      {
        label: '保险金额：',
        value: getValueByKey('insuranceamount'),
        key: 'insuranceamount',
      },
      {
        label: '保险公司：',
        value: getValueByKey('inscompanyname'),
        key: 'inscompanyname',
      },
      {
        label: '费率：',
        value: getValueByKey('insrate'),
        key: 'insrate',
      },
    ],
    insuranceInfo: [
      {
        label: '保费：',
        value: getValueByKey('premium'),
        key: 'premium',
      },
      {
        label: '保单号：',
        value: getValueByKey('applyno'),
        key: 'applyno',
      },
    ],
  };

  const init = async () => {
    try {
      const resp = await getFreightInsurancePolicyDetail(params.id as string);
      const info = safeJsonParse(
        sessionStorage.getItem('freightInsurancePolicyDetail') || '{}',
      );
      setDetail(Object.assign({}, resp.data || {}, info));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <>
      <Spin spinning={loading}>
        <div className="max-w-[1200px] rounded-[6px] py-[30px] bg-white m-auto">
          <div
            className="pb-[30px]"
            style={{ borderBottom: '1px solid #EDEFF2' }}
          >
            <p className="text-lg font-semibold ml-[30px]">投保单详情</p>
            <p className="font-normal ml-[30px] mt-[8px]">
              备注：{getValueByKey('remark')}
            </p>
          </div>
          <div className="flex items-start pt-[30px] mx-[30px]">
            <div className="flex-1">
              <div className={clsx(titleStyle, 'text-base')}>投保人信息</div>
              {FreightInsurancePolicyDetailOptions.policyholderInfo.map(
                (item) => (
                  <div key={item.key} className="flex items-center mt-[12px]">
                    <p className={clsx(wordStyle, 'min-w-[130px]')}>
                      {item.label}
                    </p>
                    <p className="font-semibold">{item.value || ''}</p>
                  </div>
                ),
              )}
              <div
                className={clsx(titleStyle, true && 'text-base', 'mt-[30px]')}
              >
                货物信息
              </div>
              {FreightInsurancePolicyDetailOptions.cargoInfo.map((item) => (
                <div key={item.key} className="flex items-center mt-[12px]">
                  <p className={clsx(wordStyle, 'min-w-[130px]')}>
                    {item.label}
                  </p>
                  <p className="font-semibold">{item.value || ''}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-[330px]">
              <div className="p-[20px]" style={{ background: '#F5F7FA' }}>
                <div className={clsx(titleStyle, 'text-base')}>保险条件</div>
                {FreightInsurancePolicyDetailOptions.insuranceConditions.map(
                  (item) => (
                    <div key={item.key} className="flex items-center mt-[12px]">
                      <p className={clsx(wordStyle)}>{item.label}</p>
                      <p className="font-semibold">{item.value || ''}</p>
                    </div>
                  ),
                )}
              </div>
              <div
                className="mt-[16px] p-[20px]"
                style={{ background: '#F5F7FA' }}
              >
                <div className={titleStyle}>保单信息</div>
                {FreightInsurancePolicyDetailOptions.insuranceInfo.map(
                  (item) => (
                    <div className="flex items-center mt-[12px]" key={item.key}>
                      <p className={clsx(wordStyle)}>{item.label}</p>
                      <p className="font-semibold">{item.value || ''}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default FreightInsurancePolicyDetail;

import { useCallback, useEffect, useState } from 'react';
import { Divider, Spin, Table } from 'antd';
import { useParams } from 'react-router-dom';
import { getCabinManageDetail } from '@/services/cabinInformation/cabinManage/cabinManageApi';
import type { CabinManageType } from '@/services/cabinInformation/cabinManage/cabinManageModel';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';
import CurrentCabinDetail from './CurrentCabinDetail';
import PortDues from './PorttDues';
import { formatTime } from '@/utils/format';

const CabinManageDetail: React.FC = () => {
  const params = useParams();

  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState<CabinManageType>();

  const getBaseOptionsValue = useCallback(
    (key: keyof CabinManageType) => {
      return detail?.[key] ?? '';
    },
    [detail]
  );

  const getPortInfo = useCallback((location: LocationItem) => {
    return `${location?.localName}-${location?.name},${location?.countryName}`;
  }, []);

  const baseOptions = [
    {
      label: '公司名称',
      key: 'companyName',
      value:
        getBaseOptionsValue('productType') === 'CARRIER'
          ? `${getBaseOptionsValue('carrierCode')}直营`
          : '散单客户',
    },
    {
      label: '船公司',
      key: 'carrierCode',
      value: getBaseOptionsValue('carrierCode'),
    },
    {
      label: '航程(天)',
      key: 'voyDays',
      value: getBaseOptionsValue('voyDays'),
    },
    {
      label: '有效截止日期:',
      key: 'validFrom',
      value: formatTime(getBaseOptionsValue('validFrom') as string, 'Y-M-D'),
    },
    {
      label: '起运港',
      key: 'por',
      value:
        typeof getBaseOptionsValue('por') === 'object'
          ? getPortInfo(getBaseOptionsValue('por') as LocationItem)
          : getBaseOptionsValue('por')?.toString() ?? '',
    },
    {
      label: 'ETD',
      key: 'etd',
      value: formatTime(getBaseOptionsValue('etd') as string, 'Y-M-D'),
    },
    {
      label: '直航/中转',
      key: 'transitNum',
      value: getBaseOptionsValue('transitNum') ? '中转' : '直航',
    },
    {
      label: '有效截止日期',
      key: 'validTo',
      value: formatTime(getBaseOptionsValue('validTo') as string, 'Y-M-D'),
    },
    {
      label: '目的港',
      key: 'fnd',
      value:
        typeof getBaseOptionsValue('fnd') === 'object'
          ? getPortInfo(getBaseOptionsValue('fnd') as LocationItem)
          : getBaseOptionsValue('fnd')?.toString() ?? '',
    },
    {
      label: 'ETA',
      key: 'eta',
      value: formatTime(getBaseOptionsValue('eta') as string, 'Y-M-D'),
    },
    {
      label: '预计交货期(天)',
      key: 'voyDay',
      value: getBaseOptionsValue('voyDays'),
    },
    {
      label: '船名航次',
      key: 'vesselName',
      value: `${getBaseOptionsValue('vesselName')} / ${getBaseOptionsValue(
        'voyNo'
      )}`,
    },
    {
      label: '截单日期',
      key: 'deadlines',
      value:
        (getBaseOptionsValue('deadlines') as Record<string, string>)?.SI ?? '',
    },
    {
      label: '条款',
      key: 'transClause',
      value: getBaseOptionsValue('transClause'),
    },
    {
      label: '上传时间',
      key: 'createTime',
      value: formatTime(getBaseOptionsValue('createTime') as string, 'Y-M-D'),
    },
    {
      label: '更新时间',
      key: 'modifytime',
      value: getBaseOptionsValue('modifytime'),
    },
    {
      label: '附加费备注',
      key: 'surchargeRemark',
      value: getBaseOptionsValue('surchargeRemark'),
      hidden: getBaseOptionsValue('productType') === 'CARRIER',
    },
    {
      label: '亏舱费备注',
      key: 'prices',
      value:
        (
          (getBaseOptionsValue('prices') as Record<string, string>)
            ?.notes as unknown as Record<string, string>
        )?.penalty ?? '',
      hidden: getBaseOptionsValue('productType') === 'CARRIER',
    },
    {
      label: '备注',
      key: 'remark',
      value: getBaseOptionsValue('remark'),
    },
  ];

  useEffect(() => {
    setLoading(true);
    init();
  }, [params?.id]);

  const init = async () => {
    const cabinManageDetailId = params?.id ?? '';
    try {
      const resp = await getCabinManageDetail(cabinManageDetailId, {
        type: '',
      });
      setDetail(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <div className="px-[24px] py-[14px] bg-white rounded-[12px]">
          <p className="text-sm font-semibold text-stone-900 mb-[10px]">
            现舱信息
          </p>
          <div className="grid grid-cols-4 text-gray-500 gap-y-[10px] w-full">
            {baseOptions.splice(0, baseOptions.length - 3).map((item) => (
              <div key={item.key}>
                {item.label}：
                <span className="text-stone-900">{item.value as string}</span>
              </div>
            ))}
          </div>
          <Divider />
          <div className="flex items-start justify-between">
            {baseOptions.splice(baseOptions.length - 3, baseOptions.length).map(
              (item) =>
                !item.hidden && (
                  <div key={item.key}>
                    {item.label}
                    <div className="text-stone-900 bg-gray-100 px-[4px] min-h-[70px] min-w-[300px] rounded-[4px]">
                      {item.value as string}
                    </div>
                  </div>
                )
            )}
          </div>
          <CurrentCabinDetail
            tableData={detail?.priceDetails ?? []}
            type={detail?.channel === 'CUSTOMER' ? 'BK03' : 'BK02'}
          />
          <p className="text-stone-900 font-semibold text-base pt-[30px] mb-[10px]">
            港口航线信息
          </p>
          <Table
            dataSource={detail?.references}
            columns={[
              {
                title: '港口名称',
                dataIndex: 'value',
                align: 'center',
              },
              {
                title: '港口标记',
                dataIndex: 'name',
                align: 'center',
              },
            ]}
            rowKey="ctnType"
            size="small"
            pagination={false}
          />
          {['extraDues', 'porDues', 'fndDues'].map((i) => (
            <PortDues
              key={i}
              type={i}
              priceDetails={detail?.priceDetails ?? []}
            />
          ))}
        </div>
      </Spin>
    </>
  );
};

export default CabinManageDetail;

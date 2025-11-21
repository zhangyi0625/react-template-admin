import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { DownloadOutlined, SendOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { CabinResultSearchColumns } from './config';
import useParentSize from '@/hooks/useParentSize';
import type { CabinResultParams } from '@/services/cabinManage/cabinManageModel';
import {
  getCabinResultByPage,
  postBatchProduct,
  postCabinResult,
  postOnRelevance,
  postRelevanceResult,
} from '@/services/orderManage/cabinResult/cabinResultApi';
import CabinResultModal from './CabinResultModal';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

type CtnTypeParams = {
  ctnType: string;
  count: number;
};

const CabinResult: React.FC = () => {
  const { message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<CabinResultParams>(
    {
      pageIndex: 1,
      pageSize: 20,
    }
  );

  const [params, setParams] = useState<{
    visible: boolean;
    carrierOptions: { carrierCode: string }[];
  }>({ visible: false, carrierOptions: [] });

  const [manualReleaseId, setManualReleaseId] = useState<string>('');

  const [selected, setSelected] = useState<string[]>([]);

  const [relevance, setRelevance] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [manualReleaseParams, setManualReleaseParmas] = useState<{
    visible: boolean;
    editRow: any | null;
    carrierOptions?: string[];
  }>({
    visible: false,
    editRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      dataIndex: 'affiliateName',
      title: '公司名称',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'carrier',
      title: '船公司',
      align: 'center',
      width: 80,
    },
    {
      dataIndex: 'porName',
      title: '起运港名称',
      align: 'center',
      width: 200,
    },
    {
      dataIndex: 'fndName',
      title: '目的港名称',
      align: 'center',
      width: 200,
    },
    {
      title: '关联状态',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{value.orderId ? '已关联' : '未关联'}</div>;
      },
    },
    {
      title: '发布状态',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <div>
            {value.publishStatus == 1
              ? '已发布'
              : value.publishMsg
              ? '发布失败'
              : '未发布'}
          </div>
        );
      },
    },
    {
      dataIndex: 'bookingAccount',
      title: '订舱账号',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'bookingNo',
      title: '订舱号',
      align: 'center',
      width: 120,
    },
    {
      title: 'ETD',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.etd, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '箱型/箱量/票',
      align: 'center',
      width: 150,
      render(value) {
        let ctnTypeArr: CtnTypeParams[] = [];
        let inventories = JSON.parse(value.inventories ?? {});
        for (let i in inventories) {
          ctnTypeArr.push({
            ctnType: i,
            count: inventories[i],
          });
        }
        return ctnTypeArr.map((item, index) => (
          <div key={index}>
            {item.ctnType} * {item.count}
          </div>
        ));
      },
    },
    {
      title: '船名航次',
      align: 'center',
      width: 180,
      render(value) {
        return (
          <div>
            {value.vesselName} / {value.voyNo}
          </div>
        );
      },
    },
    {
      title: '价格',
      align: 'center',
      width: 200,
      render(value) {
        let price = JSON.parse(value.price ?? {});
        return value.price ? (
          <div>
            Base:{price.bas?.value} / Total:{price.total?.value}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      title: '导入时间',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.created, 'Y-M-D h:m')}</div>;
      },
    },
    {
      dataIndex: 'remark',
      title: '备注',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 120,
      render(_, record) {
        return (
          <Space direction="vertical" size={0}>
            <div
              className={getClassName(!record.orderId, 'blue')}
              onClick={() => {
                setManualReleaseId(record.id);
                setRelevance(true);
              }}
            >
              关联订单
            </div>
            <div className={getClassName(record.orderId, 'red')}>查看订单</div>
            <div
              className={getClassName(record.orderId, 'blue')}
              onClick={() => cancelRelevance(record.id)}
            >
              取消关联
            </div>
            <div
              className={getClassName(!record.publishStatus, 'blue')}
              onClick={() => openManual(record)}
            >
              手动发布
            </div>
          </Space>
        );
      },
    },
  ];

  const onEditOk = async (params: any) => {
    try {
      await postCabinResult(params);
      message.success('导入成功～');
    } catch {}
  };

  const openCabinResultModal = () => {
    setParams({
      visible: true,
      carrierOptions:
        (CabinResultSearchColumns.find((item) => item.name === 'carrier')
          ?.options as { carrierCode: string }[]) || [],
    });
  };

  const batchIssue = async () => {
    if (selected.length === 0) {
      message.error('请至少选择一条要导出的订单');
      return;
    }
    setLoading(true);
    try {
      const resp = await postBatchProduct(selected);
      let flag =
        resp.data.effected == selected.length &&
        !resp.data.failedItems &&
        resp.data.failedItems.length !== 0
          ? true
          : false;
      let errorMsg = resp.data.failedItems[0].message ?? '';
      flag === true
        ? message.success('批量发布成功')
        : message.error(
            `发布成功${resp.data.effected}条数据，其余发布失败，失败原因：${errorMsg}等...`
          );
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const getClassName = (status: boolean, color: string) => {
    return status ? `cursor-pointer text-${color}-500` : 'hidden';
  };

  const onUpdateSearch = (info?: CabinResultParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined
      )
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize'],
      true
    );
    setSearchDefaultForm({
      ...pageInfo,
      filter: { ...filteredObj },
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const cancelRelevance = async (id: string) => {
    try {
      await postOnRelevance({ ids: [id] });
      message.success('操作成功');
    } catch {}
  };

  const handleOk = (e: string[]) => {
    if (e.length !== 1) message.error('只能选择一条订单导入订舱结果');
    else {
      postRelevanceResult({
        ids: [manualReleaseId],
        orderId: e.join(','),
      }).then(() => {
        message.success('导入成功');
        setRelevance(false);
        setSearchDefaultForm({ ...searchDefaultForm });
      });
    }
  };

  const openManual = (row: any) => {
    let arr = CabinResultSearchColumns.find(
      (item) => item.name === 'carrier'
    )?.options;
    setManualReleaseParmas({
      visible: true,
      editRow: row,
      carrierOptions: arr?.map((item) => item.name),
    });
  };

  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={CabinResultSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 17 },
                sm: { span: 7 },
              },
              wrapperCol: {
                xs: { span: 4 },
                sm: { span: 20 },
              },
            }}
            iconHidden={true}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={openCabinResultModal}
          >
            导入拍舱结果
          </Button>
          <Button
            type="primary"
            style={{ background: '#FA8C16' }}
            icon={<SendOutlined />}
            loading={loading}
            onClick={batchIssue}
          >
            批量发布
          </Button>
        </Space>
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '10px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getCabinResultByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options) => setSelected(options)}
        />
      </Card>
      <CabinResultModal
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, carrierOptions: [] })}
      />
    </>
  );
};

export default CabinResult;

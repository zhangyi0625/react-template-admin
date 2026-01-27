import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
  App,
  Button,
  Col,
  Divider,
  GetProp,
  Row,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import type {
  MemberUnitManageDetailType,
  MemberUnitManageType,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import { MemberUnitDetailBaseInfoType } from './index';
import { postUploadFile } from '@/services/upload';

export type MemberUnitDetailBaseInfoProps = {
  baseInfo: MemberUnitDetailBaseInfoType[];
  detail: MemberUnitManageDetailType;
};

export type MemberUnitDetailBaseInfoRef = {
  onRefresh: () => void;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const MemberUnitDetailBaseInfo = React.forwardRef<
  MemberUnitDetailBaseInfoRef,
  MemberUnitDetailBaseInfoProps
>(({ baseInfo }, ref) => {
  const { message } = App.useApp();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: MemberUnitManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const setDrawerVisible = (visible: boolean) => {
    setParams({ ...params, visible });
  };

  useImperativeHandle(ref, () => ({
    onRefresh: () => onRefresh(),
  }));

  const onRefresh = () => {
    // setBaseInfo([]);
  };

  const CustomUploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    // listType: 'picture-card',
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return false;
    },
    onChange(info) {
      setLoading(true);
      const formdata = new FormData();
      formdata.append('file', info.file as FileType); //将每一个文件图片都加进formdata
      postUploadFile(formdata).then((resp) => {
        console.log(resp, 'resp', info, fileList);
        setLoading(false);
      });
    },
    onRemove() {
      // setImageUrl('');
    },
    fileList,
  };

  return (
    <>
      <div className="flex items-center">
        <p className="mr-[20px] font-semibold">基本信息</p>
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          编辑
        </Button>
      </div>
      <Row gutter={24}>
        {baseInfo.map((item) => (
          <Col key={item.label} span={item.span || 8}>
            <div className="flex items-center whitespace-nowrap mt-[12px]">
              <div className="text-sm text-gray-400">{item.label}</div>
              <div className="text-sm text-stone-900 ml-[8px]">
                {item.value()}
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Divider />
      <p className="mr-[20px] font-semibold">业务信息标签</p>
      <Divider />
      <div className="flex items-center">
        <p className="mr-[20px] font-semibold">企业图鉴</p>
        <Upload {...CustomUploadProps}>
          <Button type="primary" loading={loading}>
            上传图片
          </Button>
        </Upload>
      </div>
    </>
  );
});

export default MemberUnitDetailBaseInfo;

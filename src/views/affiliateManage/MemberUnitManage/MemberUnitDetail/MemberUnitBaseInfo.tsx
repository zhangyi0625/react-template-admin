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
import IconClose from '@/assets/svg/icon/close.svg';
import type { MemberUnitManageDetailType } from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import { AdvantageListType, MemberUnitDetailBaseInfoType } from './index';
import { postUploadFile, previewPreviewFile } from '@/services/upload';
import MemberUnitAdvantage from '../components/MemberUnitAdvantage';
import { filterKeys } from '@/utils/tool';

export type MemberUnitDetailBaseInfoProps = {
  baseInfo: MemberUnitDetailBaseInfoType[];
  detail: MemberUnitManageDetailType;
  companyPicList: string[];
  advantageList: AdvantageListType;
  editBaseInfo: () => void;
  uploadCompanyPic: (imageId: string) => void;
  deleteCompanyPicItem: (imageId: string) => void;
  changeAdvantageItem: (
    item: string,
    key: keyof MemberUnitManageDetailType,
    type: 'delete' | 'create',
  ) => void;
};

export type MemberUnitDetailBaseInfoRef = {
  onRefresh: () => void;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const MemberUnitDetailBaseInfo = React.forwardRef<
  MemberUnitDetailBaseInfoRef,
  MemberUnitDetailBaseInfoProps
>(
  (
    {
      baseInfo,
      detail,
      editBaseInfo,
      companyPicList,
      advantageList,
      uploadCompanyPic,
      deleteCompanyPicItem,
      changeAdvantageItem,
    },
    ref,
  ) => {
    const { message } = App.useApp();

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    useImperativeHandle(ref, () => ({
      onRefresh: () => onRefresh(),
    }));

    const onRefresh = () => {
      // 重置图片缓存，重新加载
      setImageUrls({});
      companyPicList.forEach((item) => getSrc(item));
    };

    // 组件挂载时加载所有图片
    useEffect(() => {
      companyPicList.forEach((item) => getSrc(item));
    }, [companyPicList]);

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
          setLoading(false);
          uploadCompanyPic(resp.data.id as string);
        });
      },
      onRemove() {
        // setImageUrl('');
      },
      fileList,
    };

    const getSrc = async (imageId: string) => {
      if (imageUrls[imageId]) {
        return imageUrls[imageId];
      }
      try {
        const resp = await previewPreviewFile(imageId);
        const image = await getBase64(resp as Blob);
        setImageUrls((prev) => ({ ...prev, [imageId]: image }));
        return image;
      } catch (error) {
        console.error('获取图片失败:', error);
        return '';
      }
    };

    const getBase64 = (file: Blob): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    return (
      <>
        <div className="flex items-center">
          <p className="mr-[20px] font-semibold">基本信息</p>
          <Button type="primary" onClick={editBaseInfo}>
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
        <MemberUnitAdvantage
          business={filterKeys(
            detail,
            [
              'advantageBusiness',
              'advantagePor',
              'porList',
              'advantageFnd',
              'fndList',
              'advantageRoute',
              'routeList',
              'advantageCarrier',
              'carrierList',
            ],
            true,
          )}
          advantageList={advantageList}
          deleteAdvantageItem={(item, key) => {
            changeAdvantageItem(item, key, 'delete');
          }}
          createAdvantageItem={(item, key) => {
            changeAdvantageItem(item, key, 'create');
          }}
        />
        <Divider />
        <div className="flex items-center mb-[20px]">
          <p className="mr-[20px] font-semibold">企业图鉴</p>
          <Upload {...CustomUploadProps}>
            <Button type="primary" loading={loading}>
              上传图片
            </Button>
          </Upload>
        </div>
        <div className="flex flex-wrap items-center">
          {companyPicList.map((item) => (
            <div key={item} className="mr-[12px] relative w-[80px] h-[80px]">
              <img
                src={imageUrls[item] || ''}
                alt={item}
                onClick={() => uploadCompanyPic(item)}
                onError={() => {
                  if (!imageUrls[item]) {
                    getSrc(item);
                  }
                }}
                className="w-full h-auto h-cover"
              />
              <img
                src={IconClose}
                alt="close"
                className="absolute top-[2px] right-[0px] w-[24px] h-[24px] cursor-pointer"
                onClick={() => deleteCompanyPicItem(item)}
              />
            </div>
          ))}
        </div>
      </>
    );
  },
);

export default MemberUnitDetailBaseInfo;

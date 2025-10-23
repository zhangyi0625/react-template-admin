import { ConfigProvider } from 'antd';

const CabinManage: React.FC = () => {
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      ></ConfigProvider>
    </>
  );
};

export default CabinManage;

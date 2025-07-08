import { Card, ConfigProvider } from 'antd'

const CustomerManage: React.FC = () => {
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
      >
        <Card></Card>
      </ConfigProvider>
    </>
  )
}

export default CustomerManage

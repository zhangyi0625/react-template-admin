import { useState } from 'react'
import { Card, ConfigProvider } from 'antd'
import useParentSize from '@/hooks/useParentSize'

const TodayPlan: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const [today, setToday] = useState<string>(
    '日一二三四五六'.charAt(new Date().getDay())
  )

  const getTabsItem = () => {
    const items = [
      {
        label: '周一',
        key: '一',
      },
      {
        label: '周二',
        key: '二',
        children() {
          return <div className="">123</div>
        },
      },
      {
        label: '周三',
        key: '三',
      },
      {
        label: '周四',
        key: '四',
      },
      {
        label: '周五',
        key: '五',
      },
      {
        label: '周六',
        key: '六',
      },
      {
        label: '周日',
        key: '日',
      },
    ]
    return items
  }

  const changeDay = (key: string) => {
    setToday(key)
  }

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
        <Card>
          <div className="w-full flex items-center justify-between">
            {getTabsItem().map((item, index) => (
              <div
                className={`font-semibold text-base cursor-pointer ${
                  new Date().getDay() === 0 || new Date().getDay() === index + 1
                    ? 'text-normal-blue'
                    : 'text-light-grey'
                }`}
                key={item.label}
                onClick={() => changeDay(item.key)}
              >
                <p className="text-center">
                  <span className="mr-[6px]">
                    {new Date().getDay() === 0 ||
                      (new Date().getDay() === index + 1 && '今日')}
                  </span>
                  {item.label}
                </p>
                <div
                  className={`w-[160px] h-[2px] mt-[8px] ${
                    new Date().getDay() === 0 ||
                    new Date().getDay() === index + 1
                      ? 'bg-normal-blue'
                      : 'bg-gray-200'
                  }`}
                ></div>
                <div></div>
              </div>
            ))}
          </div>
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <div className="font-semibold text-base text-dull-grey">账号预登录</div>
      </Card>
    </>
  )
}

export default TodayPlan

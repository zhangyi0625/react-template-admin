import { THEME_PRESET } from '@/enums/constants';
import classNames from 'classnames';
import './theme.scss';
import SwitchItem from '../SwitchItem';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, updateSetting } from '@/stores/store';

/**
 * 主题
 * @returns
 */
const MyTheme: React.FC = () => {
  const dispatch = useDispatch();

  const { theme } = useSelector((state: RootState) => state.preferences);

  const changeMyThemeColor = (name: string) => {
    if (name === 'auto') return;
    dispatch(
      updateSetting({
        category: 'theme',
        key: 'mode',
        value: name,
      })
    );
  };
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      {THEME_PRESET.map((item) => {
        return (
          <div
            key={item.name}
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => changeMyThemeColor(item.name)}
          >
            <div
              style={{
                display: 'flex',
                cursor: 'pointer',
                flexDirection: 'column',
              }}
              onClick={() => {}}
            >
              <div
                className={classNames('outline-box', {
                  'outline-box-active':
                    item.selected && theme.mode === item.name,
                })}
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: 'rgb(113, 113, 122)',
                  marginTop: '8px',
                }}
              >
                {item.name}
              </div>
            </div>
          </div>
        );
      })}
      {/* 深色侧边栏 */}
      <SwitchItem
        style={{ marginTop: '1.5rem' }}
        title="深色侧边栏"
        category="theme"
        pKey="semiDarkSidebar"
      />
      {/* 深色顶栏 */}
      <SwitchItem title="深色顶栏" category="theme" pKey="semiDarkHeader" />
    </div>
  );
};
export default MyTheme;

import { BUILTIN_THEME_PRESETS } from '@/enums/constants';
import './theme.scss';
import { ColorPicker } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, updateSetting } from '@/stores/store';
import classNames from 'classnames';

/**
 * 内置主题
 * @returns
 */
const Buitin: React.FC = () => {
  const dispatch = useDispatch();

  const { theme } = useSelector((state: RootState) => state.preferences);

  const changeBuitinColor = (color: string) => {
    if (!color) return;
    dispatch(
      updateSetting({
        category: 'theme',
        key: 'colorPrimary',
        value: color,
      })
    );
  };
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      {BUILTIN_THEME_PRESETS.map((item) => {
        return (
          <div
            key={item.color}
            style={{
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
            onClick={() => {
              changeBuitinColor(item.color);
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              className={classNames('outline-box', {
                'outline-box-active': item.color === theme.colorPrimary,
              })}
            >
              {item.type === 'custom' ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '0.5rem 2.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      width: '1.25rem',
                      height: '1.25rem',
                      borderRadius: '6px',
                    }}
                  >
                    <ColorPicker>
                      <UserAddOutlined style={{ fontSize: '1.25rem' }} />
                    </ColorPicker>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: item.color,
                    width: '1.25rem',
                    height: '1.25rem',
                    margin: '0.5rem 2.5rem',
                    borderRadius: '6px',
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontSize: '.75rem',
                lineHeight: '1rem',
                textAlign: 'center',
                margin: '.5rem 0',
                color:
                  item.color === theme.colorPrimary
                    ? 'rgb(0, 107, 230)'
                    : 'rgb(113, 113, 122)',
              }}
            >
              {item.type}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Buitin;

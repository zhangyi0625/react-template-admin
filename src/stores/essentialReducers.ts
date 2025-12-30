import { createSlice } from '@reduxjs/toolkit';
import { essentialPreferences } from './storeState';

export type Category = keyof essentialPreferences;

export const initEssential: essentialPreferences = {
  routeData: undefined,
  porPortData: undefined,
  fndPortData: undefined,
  carrierData: undefined,
  countryData: undefined,
};

export const essentialSlice = createSlice({
  name: 'essential',
  initialState: initEssential,
  reducers: {
    setEssential(
      state: essentialPreferences,
      action: {
        payload: { value: essentialPreferences; key: string };
      }
    ) {
      const { key, value } = action.payload;
      state[key] = value;
      sessionStorage.setItem('initEssential', JSON.stringify({ ...state }));
    },
    // 清空所有数据缓存
    cleanEssential() {
      return initEssential;
    },
  },
});

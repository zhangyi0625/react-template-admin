import Password from 'antd/es/input/Password';
import { count } from 'console';
import { defineMock } from 'rspack-plugin-mock/helper';

export default defineMock([
  {
    url: '/api/brash-box/page',
    enabled: true,
    method: 'GET',
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: {
          count: 2,
          list: [
            {
              id: Math.random(),
              carrier: 'COSCO',
              name: '宁波真和',
              no: 'ONEJHDF997687',
              account: 'ed@icupamji.ke',
              vesselName: 'CMA CGM CEOKFGJ KSFJGH SKFJGH ',
              password: '265Y356Y36Y',
              voyNo: '0FMLIW1',
              modifyTime: '2025-12-30 12:00',
            },
            {
              id: Math.random(),
              carrier: 'OOCL',
              name: '宁波真和',
              no: 'CMAVH9384598',
              vesselName: 'COSCO SHIPPI JRTHGIW EJGHIEU',
              account: 'ed@icupamji.ke',
              voyNo: '034W',
              password: '265Y356Y36Y',
              modifyTime: '2025-12-30 12:00',
            },
          ],
        },
      };
    },
  },
  {
    url: '/api/brash-box/account/page',
    enabled: true,
    method: 'GET',
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: {
          count: 2,
          list: [
            {
              id: Math.random(),
              carrier: 'COSCO',
              name: '宁波真和',
              account: 'ed@icupamji.ke',
              password: '265Y356Y36Y',
              modifyTime: '2025-12-30 12:00',
            },
            {
              id: Math.random(),
              carrier: 'OOCL',
              name: '宁波真和',
              account: 'ed@icupamji.ke',
              password: '265Y356Y36Y',
              modifyTime: '2025-12-30 12:00',
            },
          ],
        },
      };
    },
  },
]);

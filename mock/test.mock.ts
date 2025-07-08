import { defineMock } from 'rspack-plugin-mock/helper'

export default defineMock([
  {
    url: '/apis/system/test/carrier',
    enabled: true,
    method: 'GET',
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: [
          {
            carrierCode: 'MSK',
            name: '马士基线上',
            carrierName: 'MAERSK',
            code: 'MAERSK',
          },
          {
            carrierCode: 'COSCO',
            name: 'COSCO Synconhub',
            carrierName: 'COSSYHB',
            code: 'COSSYHB',
          },
          {
            carrierCode: 'HPLQQ',
            name: 'Haplag-Lloyd QQ',
            carrierName: 'HPL QQ',
            code: 'HPL QQ',
          },
        ],
      }
    },
  },
  {
    url: '/apis/system/test/shippingAccount',
    enabled: true,
    method: 'GET',
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: {
          entries: [
            {
              id: '3213123',
              carrier: 'COSCO',
              customer: '宁波真和',
              account: 'itopedunu@etewu.kw',
              accountHeader: '耀阳',
              accountType: 'search',
              vaild: true,
              updated: '2024-06-20 12:00:00',
            },
            {
              id: '3213124',
              carrier: 'MSK',
              customer: '宁波真和',
              account: 'itopedunu@etewu.kw',
              accountHeader: '耀阳',
              accountType: 'order',
              vaild: false,
              updated: '2024-06-20 12:00:00',
            },
          ],
        },
      }
    },
  },
  {
    url: '/apis/system/test/customer',
    enabled: true,
    method: 'GET',
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: {
          entries: [
            {
              id: '3213123',
              customerName: '宁波真和物流科技有限公司',
              customer: '真和',
              code: '678954345678923456@etewu.kw',
              updated: '2024-06-20 12:00:00',
            },
            {
              id: '3213129',
              customerName: '浙江耀阳供应链管理有限公司',
              customer: '耀阳',
              code: '678954345678923456@etewu.kw',
              updated: '2024-06-20 12:00:00',
            },
            {
              id: '3213124',
              customerName: '智链物流科技有限公司',
              customer: '智链',
              code: '678954345678923456@etewu.kw',
              updated: '2024-06-20 12:00:00',
            },
          ],
        },
      }
    },
  },
  {
    url: '/apis/system/test/add/customer',
    method: 'POST',
    enabled: true,
    body() {
      return {
        code: 200,
        message: '操作成功',
      }
    },
  },
  {
    url: '/apis/system/test/customer/3213123',
    method: 'DELETE',
    enabled: true,
    body(request) {
      const query = request.query
      console.log(query, 'query')
      return {
        code: 200,
        message: '操作成功',
      }
    },
  },
])

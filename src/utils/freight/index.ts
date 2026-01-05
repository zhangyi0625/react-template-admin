import type {
  AdditionalChargesModule,
  AdditionalColumnType,
  CostDetailType,
  FreightPriceListType,
} from './type';

/**
 * 排列组合重新划分附加费
 * 1.海运附加费 2.起运港费用 3.目的港费用 4.其他费用
 * chargeMode暂时只有【BL】和 【CONTAINER】
 * CONTAINER 下存在不同箱型的价格需要组合
 * @param price 运费价格列表
 * @returns 分类后的附加费数据
 */
export const loadAdditionalCharges = (
  price: FreightPriceListType[] = []
): Omit<AdditionalChargesModule, 'oceanBase' | 'ddPriceList'> | undefined => {
  // 类型安全的初始对象
  const additionalCharges: Omit<
    AdditionalChargesModule,
    'oceanBase' | 'ddPriceList'
  > = {
    oceanFreight: [],
    porPriceList: [],
    fndPriceList: [],
    otherPriceList: [],
  };

  if (!price.length) return additionalCharges;

  // 使用Map替代数组提高查找效率
  const chargeMaps = {
    por: new Map<string, number>(), // chargeName -> index
    fnd: new Map<string, number>(),
    ocean: new Map<string, number>(),
    other: new Map<string, number>(),
  };

  for (const item of price) {
    for (const el of item.costDetailList) {
      // 区分类型是票价还是箱型费用
      const type = (
        el.chargeType === 'BL' ? 'blPrice' : item.ctnType
      ) as keyof AdditionalColumnType;
      const chargeName = `${el.chargeName}(${el.currency})`;

      switch (el.costCategory) {
        case 'POR':
          getOptimizedPush(
            el,
            type,
            chargeName,
            chargeMaps.por,
            additionalCharges.porPriceList
          );
          break;
        case 'FND':
        case 'LAND':
          getOptimizedPush(
            el,
            type,
            chargeName,
            chargeMaps.fnd,
            additionalCharges.fndPriceList
          );
          break;
        case 'OCEAN_EXTRA':
          getOptimizedPush(
            el,
            type,
            chargeName,
            chargeMaps.ocean,
            additionalCharges.oceanFreight
          );
          break;
        case 'OTHER':
          getOptimizedPush(
            el,
            type,
            chargeName,
            chargeMaps.other,
            additionalCharges.otherPriceList
          );
          break;
      }
    }
  }
  return additionalCharges;
};

/**
 * 优化的费用数据添加或更新函数
 * @param el 费用详情
 * @param type 费用类型 (blPrice 或 箱型)
 * @param chargeName 完整费用名称(包含货币)
 * @param map 用于快速查找的Map
 * @param newArr 目标数组
 * @returns 更新后的目标数组
 */
export const getOptimizedPush = (
  el: CostDetailType,
  type: keyof AdditionalColumnType,
  chargeName: string,
  map: Map<string, number>,
  newArr: AdditionalColumnType[]
): AdditionalColumnType[] => {
  // 获取当前费用在数组中的索引
  const index = map.get(chargeName);

  if (index === undefined) {
    // 创建新的费用项，避免不必要的类型断言
    const newItem: AdditionalColumnType = {
      chargeType: el.chargeType,
      chargeName,
      currency: el.currency,
      isIncludeTotal: el.showOnly ? '否' : '是',
      [type]: el.price,
    };

    // 先获取新索引，再添加元素，避免计算newArr.length - 1
    const newIndex = newArr.length;
    newArr[newIndex] = newItem;
    map.set(chargeName, newIndex);
  } else {
    // 直接更新价格，type已经是keyof类型，无需类型断言
    newArr[index][type] = el.price;
  }

  return newArr;
};

/**
 * 远程搜索系统数据
 * @param value 搜索关键字keyword
 * @param type  搜索类型：'POR' | 'FND' | 'customerId' | 'affiliateId'
 * @param callback 保存数据回调
 * @param API 搜索api
 */
export const fetchSystemSearchData = (
  value: string,
  type: 'POR' | 'FND' | 'customerId' | 'affiliateId' | string,
  callback: (data: any) => void,
  API: (params: { keyword: string; tag?: string }) => Promise<any>
) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  let currentValue: string;

  const fetchData = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const fake = () => {
      (type === 'customerId' || type === 'affiliateId'
        ? API({ keyword: currentValue })
        : API({ keyword: currentValue, tag: type })
      ).then((resp: any[]) => {
        callback({
          [type]: resp.map((item: { id: string; name: string }) => ({
            ...item,
            value: item.id,
            label: item.name,
          })),
        });
      });
    };
    if (value) {
      timeout = setTimeout(fake, 300);
    } else callback({ [type]: [] });
  };
  fetchData();
};

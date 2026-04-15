import { updateSearchFilter } from './index';
import { describe, it, expect } from '@rstest/core';

// 测试 updateSearchFilter 函数
describe('updateSearchFilter', () => {
  it('should call callback with filtered search params and page info', () => {
    const searchDefaultInfo = {
      pageIndex: 1,
      pageSize: 10,
      otherParam: 'value',
    };
    let callbackCalledWith: any = null;
    const callback = (data: any) => {
      callbackCalledWith = data;
    };
    const searchParams = {
      name: 'test',
      age: 25,
      empty: '',
      undefinedValue: undefined,
    };

    updateSearchFilter(
      searchDefaultInfo,
      callback,
      ['pageIndex', 'pageSize'],
      searchParams,
    );

    expect(callbackCalledWith).toEqual({
      pageIndex: 1,
      pageSize: 10,
      filter: {
        name: 'test',
        age: 25,
      },
    });
  });

  it('should call callback with empty filter when no search params', () => {
    const searchDefaultInfo = {
      pageIndex: 1,
      pageSize: 10,
      otherParam: 'value',
    };
    let callbackCalledWith: any = null;
    const callback = (data: any) => {
      callbackCalledWith = data;
    };

    updateSearchFilter(searchDefaultInfo, callback);

    expect(callbackCalledWith).toEqual({
      pageIndex: 1,
      pageSize: 10,
      filter: {},
    });
  });

  it('should call callback with empty filter when searchParams is undefined', () => {
    const searchDefaultInfo = {
      pageIndex: 1,
      pageSize: 10,
      otherParam: 'value',
    };
    let callbackCalledWith: any = null;
    const callback = (data: any) => {
      callbackCalledWith = data;
    };

    updateSearchFilter(
      searchDefaultInfo,
      callback,
      ['pageIndex', 'pageSize'],
      undefined,
    );

    expect(callbackCalledWith).toEqual({
      pageIndex: 1,
      pageSize: 10,
      filter: {},
    });
  });

  it('should call callback with empty filter when searchParams has only empty values', () => {
    const searchDefaultInfo = {
      pageIndex: 1,
      pageSize: 10,
      otherParam: 'value',
    };
    let callbackCalledWith: any = null;
    const callback = (data: any) => {
      callbackCalledWith = data;
    };
    const searchParams = {
      empty: '',
      undefinedValue: undefined,
    };

    updateSearchFilter(
      searchDefaultInfo,
      callback,
      ['pageIndex', 'pageSize'],
      searchParams,
    );

    expect(callbackCalledWith).toEqual({
      pageIndex: 1,
      pageSize: 10,
      filter: {},
    });
  });

  it('should call callback with all page info even if searchDefaultInfo has other params', () => {
    const searchDefaultInfo = {
      pageIndex: 2,
      pageSize: 20,
      otherParam1: 'value1',
      otherParam2: 'value2',
    };
    let callbackCalledWith: any = null;
    const callback = (data: any) => {
      callbackCalledWith = data;
    };
    const searchParams = {
      name: 'test',
    };

    updateSearchFilter(
      searchDefaultInfo,
      callback,
      ['pageIndex', 'pageSize'],
      searchParams,
    );

    expect(callbackCalledWith).toEqual({
      pageIndex: 2,
      pageSize: 20,
      filter: {
        name: 'test',
      },
    });
  });
});

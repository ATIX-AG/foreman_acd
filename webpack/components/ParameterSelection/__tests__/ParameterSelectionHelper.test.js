// import {expect, jest, test} from '@jest/globals';
import {
  transformForemanData,
  filterParameterTypes,
} from '../ParameterSelectionHelper';

describe('transformForemanData', () => {
  const fdata = [
    { id: 1, name: '1-Small' },
    { id: 2, name: '2-Medium' },
    { id: 3, name: '3-Large' },
  ];

  it('returns empty on undefined', () => {
    expect(transformForemanData(undefined)).toEqual('');
  });

  it('returns object with "id" as key and "name" as value', () => {
    expect(transformForemanData(fdata)).toEqual({
      1: '1-Small',
      2: '2-Medium',
      3: '3-Large',
    });
  });
});

describe('filterParameterTypes', () => {
  const parameters = [
    {
      id: 1,
      locked: false,
      name: 'Password',
      description: '',
      type: 'password',
      value: '1234',
      isYaml: false,
    },
    {
      id: 2,
      locked: false,
      name: 'NotAllowed',
      description: '',
      type: 'not_allowed',
      value: '1234',
      isYaml: false,
    },
    {
      id: 3,
      locked: false,
      name: 'HostParameter1',
      description: '',
      type: 'hostparam',
      value: '1234',
      isYaml: false,
    },
    {
      id: 4,
      locked: false,
      name: 'HostParameter2',
      description: '',
      type: 'hostparam',
      value: '1234',
      isYaml: false,
    },
  ];

  it('removes parameter-types present in parameters', () => {
    expect(filterParameterTypes({ password: '' }, parameters)).toEqual({});
  });

  it('keeps "hostparam" in parameter-types', () => {
    expect(filterParameterTypes({ hostparam: '' }, parameters)).toEqual({
      hostparam: '',
    });
  });
});

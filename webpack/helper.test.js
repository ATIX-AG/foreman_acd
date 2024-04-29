import {
  arrayToObject,
  EasyHeaderFormatter,
  supportedPluginsToHiddenParameterTypes,
} from './helper';

describe('helper', () => {
  const testArray = [];
  testArray[0] = { id: 'i1', value: 'v1' };
  testArray[1] = { id: 'i2', value: 'v2' };
  testArray[2] = { id: 'i3', value: 'v3' };

  it('creates an object from an array and select value', () => {
    expect(arrayToObject(testArray, 'id', 'value')).toEqual({
      i1: 'v1',
      i2: 'v2',
      i3: 'v3',
    });
  });

  it('formats a nice, easy header', () => {
    expect(
      EasyHeaderFormatter('MyValue', {
        column: { header: { label: 'TheLabel', props: { p1: '1' } } },
      })
    ).toMatchSnapshot();
  });

  it('creates hidden parameter definition by supported plugins 1', () => {
    expect(supportedPluginsToHiddenParameterTypes({ puppet: false })).toEqual([
      'puppetenv',
    ]);
  });

  it('creates hidden parameter definition by supported plugins 2', () => {
    expect(supportedPluginsToHiddenParameterTypes({ puppet: true })).toEqual(
      []
    );
  });

  it('creates hidden parameter definition by supported plugins 3', () => {
    expect(supportedPluginsToHiddenParameterTypes({})).toEqual([]);
  });
});

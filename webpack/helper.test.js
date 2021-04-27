import {
  arrayToObject,
  arrayToObjectObj,
  EasyHeaderFormatter,
} from './helper';

describe('helper', () => {
  const testArray = []
  testArray[0] = { id: 'i1', value: 'v1' };
  testArray[1] = { id: 'i2', value: 'v2' };
  testArray[2] = { id: 'i3', value: 'v3' };

  it('creates a object from an array', () => {
    expect(arrayToObject(testArray, 'id', 'value')).toEqual(
      {
        i1: 'v1',
        i2: 'v2',
        i3: 'v3'
      }
    );
  });

  it('creates a object from an array', () => {
    expect(arrayToObjectObj(testArray, 'id')).toEqual(
      {
        i1: { id: 'i1', value: 'v1' },
        i2: { id: 'i2', value: 'v2' },
        i3: { id: 'i3', value: 'v3' },
      }
    );
  });

  it('creates a object from an array', () => {
    expect(EasyHeaderFormatter('MyValue', { column: { header: { label: 'TheLabel', props: { p1: '1' } } } })).toMatchSnapshot();
  });
});


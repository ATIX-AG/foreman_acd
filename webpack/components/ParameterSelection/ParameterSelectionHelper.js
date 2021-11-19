import {
  cloneDeep,
} from 'lodash';

export const transformForemanData = (fdata) => {
  if (fdata === undefined) {
    return "";
  }
  const result = {};
  fdata.map(item => result[item.id] = item.name)
  return (result);
}

export const filterParameterTypes = (options, parameters) => {
  const newOptions = cloneDeep(options);

  // hostparam can be used multiple times
  const alreadyUsed = parameters.map(item => item["type"]).filter(item => item != 'hostparam');

  // remove already used items
  alreadyUsed.forEach(item => delete newOptions[item])

  return newOptions;
}

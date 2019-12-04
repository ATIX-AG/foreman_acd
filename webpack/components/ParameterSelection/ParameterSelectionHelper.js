import {
  cloneDeep,
} from 'lodash';

export const isNewDefinition = (mode) => {
  if (mode == "newDefinition")
    return true;
  return false;
}

export const isEditDefinition = (mode) => {
  if (mode == "editDefinition")
    return true;
  return false;
}

export const isDefinition = (mode) => {
  return (isNewDefinition(mode) || isEditDefinition(mode))
}

export const isNewInstance = (mode) => {
  if (mode == "newInstance")
    return true;
  return false;
}

export const isEditInstance = (mode) => {
  if (mode == "editInstance")
    return true;
  return false;
}

export const isInstance = (mode) => {
  return (isNewInstance(mode) || isEditInstance(mode))
}

export const transformForemanData = (fdata) => {
  if (fdata === undefined) {
    return "";
  }
  const result = {};
  fdata.map(item => result[item.id] = item.name)
  return (result);
}

export const filterUsedParameterTypes = (options, parameters) => {
  const newOptions = cloneDeep(options);
  // hostparam can be used multiple times
  const alreadyUsed = parameters.map(item => item["type"]).filter(item => item != 'hostparam');
  alreadyUsed.forEach(item => delete newOptions[item])
  return newOptions;
}

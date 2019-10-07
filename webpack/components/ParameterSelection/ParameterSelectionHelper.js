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


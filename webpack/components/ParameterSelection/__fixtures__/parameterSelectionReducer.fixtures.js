import Immutable from 'seamless-immutable';
import { cloneDeep, findIndex } from 'lodash';

import { parameterSelectionData1 } from '../__fixtures__/parameterSelectionData1.fixtures';

export const successState = Immutable(parameterSelectionData1);

const EDIT_ROW_ID = 2;

const editClone = parameterSelectionData1;
const editIndex = findIndex(editClone.parameters, { id: EDIT_ROW_ID });
editClone.parameters[editIndex].backup = cloneDeep(
  editClone.parameters[editIndex]
);
export const editState = Immutable(editClone);

// Payload Data
export const initParameterSelectionPayload = parameterSelectionData1;
export const addParameterPayload = {};
export const lockParameterPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const deleteParameterPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const activateEditParameterPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const confirmEditParameterPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const cancelEditParameterPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const changeEditParameterPayload = {
  value: 'helloworld',
  property: 'value',
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const sortParameterPayload = {
  selectedColumn: 'type',
};

export const loadParamDataRequestPayload = {
  clearRows: false,
};
export const loadParamDataSuccessPayload = {
  hostgroup_id: 1,
  environments: [
    {
      id: 1,
      name: 'production',
    },
    {
      id: 2,
      name: 'test',
    },
  ],
  lifecycle_environments: [],
  domains: [],
  computeprofiles: [],
  ptables: [
    {
      id: 105,
      name: 'Kickstart default',
    },
    {
      id: 104,
      name: 'Kickstart default thin',
    },
  ],
};
export const loadParamDataFailurePayload = {
  error: 'Something really bad happend',
};

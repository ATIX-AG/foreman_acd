import Immutable from 'seamless-immutable';
import {
   cloneDeep,
   findIndex,
   findLastIndex,
} from 'lodash';

import {
  parameterSelectionData_1,
} from '../__fixtures__/parameterSelectionData_1.fixtures';

export const successState = Immutable(parameterSelectionData_1);

const EDIT_ROW_ID = 5;

const editClone = parameterSelectionData_1;
const editIndex = findIndex(editClone.rows, { id: EDIT_ROW_ID })
editClone["rows"][editIndex].backup = cloneDeep(editClone["rows"][editIndex]);
export const editState = Immutable(editClone);

export const initParameterSelectionPayload = parameterSelectionData_1;
export const addParameterPayload = { };
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
  value: "helloworld",
  property: "value",
  rowData: {
    id: EDIT_ROW_ID,
  }
};
export const sortParameterPayload = {
  selectedColumn: "type",
};

export const loadForemanDataRequestPayload = {
  clearRows: false,
};
export const loadForemanDataSuccessPayload = {
  hostgroup_id: 1,
  environments: [
    {
      id: 1,
      name: "production"
    },
    {
      id: 2,
      name: "test"
    }
  ],
  lifecycle_environments: [],
  domains: [],
  computeprofiles: [],
  ptables: [
    {
      id: 105,
      name: "Kickstart default"
    },
    {
      id: 104,
      name: "Kickstart default thin"
    }
  ]
};
export const loadForemanDataFailurePayload = {
  error: "Something really bad happend",
};

export const loadParameterSelectionRequestPayload = { };
export const loadParameterSelectionSuccessPayload = {
  app_definition: {
    id: 2,
    name: "sowasvonneu",
    description: "",
    hostgroup_id: 1,
    parameters: "[{\"id\":0,\"name\":\"richtigneu\",\"description\":\"\",\"type\":\"puppetenv\",\"value\":\"1\"},{\"id\":1,\"name\":\"ganzgut\",\"description\":\"\",\"type\":\"ip\",\"value\":\"1.1.1.2\"}]",
    created_at: "2019-11-13 17:47:27 +0100",
    updated_at: "2019-11-13 17:47:27 +0100"
  },
  fdata: {
    hostgroup_id: 1,
    environments: [
      {
        id: 1,
        name: "production"
      },
      {
        id: 2,
        name: "test"
      }
    ],
    lifecycle_environments: [],
    domains: [],
    computeprofiles: [],
    ptables: [
      {
        id: 105,
        name: "Kickstart default"
      },
      {
        id: 104,
        name: "Kickstart default thin"
      }
    ]
  }
};
export const loadParameterSelectionFailurePayload = {
  error: "Something really bad happend",
};

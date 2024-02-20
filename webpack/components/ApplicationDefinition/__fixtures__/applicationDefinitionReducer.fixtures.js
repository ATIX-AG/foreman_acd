import Immutable from 'seamless-immutable';
import { cloneDeep, findIndex, findLastIndex } from 'lodash';

import { applicationDefinitionConfData1 } from '../__fixtures__/applicationDefinitionConfData1.fixtures';

export const successState = Immutable(applicationDefinitionConfData1);

const EDIT_ROW_ID = 2;

const editClone = applicationDefinitionConfData1;
const editIndex = findIndex(editClone.services, { id: EDIT_ROW_ID });
editClone.services[editIndex].backup = cloneDeep(editClone.services[editIndex]);
export const editState = Immutable(editClone);

// Payload Data
export const initApplicationDefinitionPayload = applicationDefinitionConfData1;
export const addServicePayload = {};
export const deleteServicePayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const activateEditServicePayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const confirmEditServicePayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const cancelEditServicePayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const changeEditServicePayload = {
  value: 'helloworld',
  property: 'name',
  rowData: {
    id: EDIT_ROW_ID,
  },
};

export const loadAnsibleDataRequestPayload = {
  clearRows: false,
};

export const loadAnsibleDataSuccessPayload = {
  id: 2,
  name: 'LAMP',
  groups: {
    webservers: {
      dummy_var: '0',
    },
    dbservers: {
      mysqlservice: 'mysqld',
      mysql_port: '3306',
      dbuser: 'webapp',
      dbname: 'ANSAP01',
      upassword: 'Bond@007',
      masterpassword: 'MySQL@007',
    },
    all: {
      repository: 'https://github.com/bennojoy/mywebapp.git',
    },
  },
};

export const loadAnsibleDataFailurePayload = {
  error: 'Something really bad happend',
};

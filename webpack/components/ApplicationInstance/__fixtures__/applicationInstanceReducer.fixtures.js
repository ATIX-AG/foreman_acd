import Immutable from 'seamless-immutable';
import { cloneDeep, findIndex, findLastIndex } from 'lodash';

import { applicationInstanceConfData_1 } from '../__fixtures__/applicationInstanceConfData_1.fixtures';

export const successState = Immutable(applicationInstanceConfData_1);

const EDIT_ROW_ID = 2;

const editClone = applicationInstanceConfData_1;
const editIndex = findIndex(editClone.hosts, { id: EDIT_ROW_ID });
editClone.hosts[editIndex].backup = cloneDeep(editClone.hosts[editIndex]);
export const editState = Immutable(editClone);

// Payload Data
export const initApplicationInstancePayload = applicationInstanceConfData_1;

export const closeAlertModalPayload = {};
export const addHostPayload = {};
export const deleteHostPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const activateEditHostPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const confirmEditHostPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const cancelEditHostPayload = {
  rowData: {
    id: EDIT_ROW_ID,
  },
};
export const changeEditHostPayload = {
  value: 'helloworld',
  property: 'name',
  rowData: {
    id: EDIT_ROW_ID,
  },
};

export const loadApplicationDefinitionRequestPayload = {
  clearRows: false,
};

export const loadApplicationDefinitionSuccessPayload = {
  app_definition: {
    id: 1,
    name: 'LAMP',
    description: '',
    services:
      '[{"id":1,"name":"web","description":"","hostgroup":"1","ansibleGroup":"webservers","minCount":"2","maxCount":"","foremanParameters":[{"id":1,"locked":false,"name":"CP","description":"","type":"computeprofile","value":"1"},{"id":2,"locked":true,"name":"LE","description":"","type":"lifecycleenv","value":"1"}],"ansibleParameters":[{"id":0,"name":"dummy_var","value":"0"}]},{"id":2,"name":"db","description":"","hostgroup":"1","ansibleGroup":"dbservers","minCount":"1","maxCount":"","foremanParameters":[],"ansibleParameters":[{"id":0,"name":"mysqlservice","value":"mysqld"},{"id":1,"name":"mysql_port","value":"3306","locked":true},{"id":2,"name":"dbuser","value":"webapp"},{"id":3,"name":"dbname","value":"ANSAP01"},{"id":4,"name":"upassword","value":"Bond@007"},{"id":5,"name":"masterpassword","value":"MySQL@007"}]}]',
    ansible_vars_all:
      '[{"id":0,"name":"repository","value":"https://github.com/bennojoy/mywebapp.git"}]',
    location_ids: [2],
    organization_ids: [1],
    created_at: '2021-03-11 12:51:34 +0100',
    updated_at: '2021-03-13 00:06:12 +0100',
  },
  foreman_data: null,
  ansible_data: null,
};

export const loadApplicationDefinitionFailurePayload = {
  error: 'Something really bad happend',
};

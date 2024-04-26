import Immutable from 'seamless-immutable';
import { cloneDeep, findIndex } from 'lodash';

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
  error: {
    errorMsg: 'Something really bad happend',
    statusText: {
      message: 'Request failed with status code 500',
      name: 'Error',
      stack:
        'Error: Request failed with status code 500\n    at createError (https://alma8-katello-devel.example.com/webpack/foreman-vendor.bundle-v13.0.1-development-5d3e5360b2af8f65b096.js:406679:15)\n    at settle (https://alma8-katello-devel.example.com/webpack/foreman-vendor.bundle-v13.0.1-development-5d3e5360b2af8f65b096.js:406954:12)\n    at XMLHttpRequest.handleLoad (https://alma8-katello-devel.example.com/webpack/foreman-vendor.bundle-v13.0.1-development-5d3e5360b2af8f65b096.js:406146:7)',
      config: {
        url: '/acd/ui_acd_ansible_data/1',
        method: 'get',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token':
            'gDtRPi6lnKE-V65O-datPQ2mGRQwbw3i-y_hAjjKAYQ5WC_oqTwluCJZfsGkpihmJAi3IvAi1ZAc9N47KcjCbQ',
        },
        params: {},
        transformRequest: [null],
        transformResponse: [null],
        timeout: 0,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        maxContentLength: -1,
        maxBodyLength: -1,
      },
    },
  },
};

import Immutable from 'seamless-immutable';

import { cloneDeep, findIndex, findLastIndex } from 'lodash';

import { translate as __ } from 'foremanReact/common/I18n';

import {
  APPLICATION_DEFINITION_IMPORT_INIT,
  APPLICATION_DEFINITION_IMPORT_SERVICE_EDIT_CHANGE,
  APPLICATION_DEFINITION_IMPORT_FILE_FAILURE,
  APPLICATION_DEFINITION_IMPORT_FILE_REQUEST,
  APPLICATION_DEFINITION_IMPORT_FILE_SUCCESS,
  APPLICATION_DEFINITION_IMPORT_CLOSE_ALERT_MODAL,
} from './ApplicationDefinitionImportConstants';

export const initialState = Immutable({
  name: false,
  error: { errorMsg: '', status: '', statusText: '' },
});

const applicationDefinitionImportConf = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case APPLICATION_DEFINITION_IMPORT_INIT: {
      return state.merge(payload);
    }

    case APPLICATION_DEFINITION_IMPORT_CLOSE_ALERT_MODAL: {
      return state.merge({
        showAlertModal: false,
        alertModalTitle: '',
        alertModalText: '',
      });
    }

    case APPLICATION_DEFINITION_IMPORT_SERVICE_EDIT_CHANGE: {
      const services = cloneDeep(state.ansiblePlaybookServices);
      const index = findIndex(services, { id: payload.rowData.id });

      services[index][payload.property] = payload.value;

      return state.set('ansiblePlaybookServices', services);
    }

    case APPLICATION_DEFINITION_IMPORT_FILE_FAILURE: {
      return state.merge({ error: payload.error, loading: false });
    }
    case APPLICATION_DEFINITION_IMPORT_FILE_REQUEST: {
      return state.set('loading', true);
    }
    case APPLICATION_DEFINITION_IMPORT_FILE_SUCCESS: {
      let newState = {};
      const ansibleServices = [];
      const ansiblePlaybookServices =
        payload.ansiblePlaybookServices.ansible_services;

      for (const ind in ansiblePlaybookServices) {
        const value = ansiblePlaybookServices[ind];
        const newRow = { id: value.id, name: value.value, hostgroup: '' };
        newRow.backup = cloneDeep(newRow);
        ansibleServices.push(newRow);
      }

      newState = {
        ansiblePlaybookServices: ansibleServices,
      };

      return state.merge(newState);
    }
    default:
      return state;
  }
};

export default applicationDefinitionImportConf;

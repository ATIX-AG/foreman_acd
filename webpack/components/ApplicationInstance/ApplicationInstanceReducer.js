import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import {
  APPLICATION_INSTANCE_INIT,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_FAILURE,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_REQUEST,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_SUCCESS,
  APPLICATION_INSTANCE_HOST_DELETE,
  APPLICATION_INSTANCE_HOST_ADD,
  APPLICATION_INSTANCE_HOST_EDIT_ACTIVATE,
  APPLICATION_INSTANCE_HOST_EDIT_CONFIRM,
  APPLICATION_INSTANCE_HOST_EDIT_CHANGE,
  APPLICATION_INSTANCE_HOST_EDIT_CANCEL,
  APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_CLOSE,
} from './ApplicationInstanceConstants';

export const initialState = Immutable({
  name: false,
  error: { errorMsg: '', status: '', statusText: '' },
});

const applicationInstanceConf = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case APPLICATION_INSTANCE_INIT: {
      return state.merge(payload);
    }
   case APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_FAILURE: {
      return state.merge({ error: payload.error, loading: false });
    }
    case APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_REQUEST: {
      return state.set('loading', true);
    }
    case APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_SUCCESS: {
      return state.merge({
        appDefinition: payload.app_definition,
        services: JSON.parse(payload.app_definition.services),
        loading: false,
      });
    }
    case APPLICATION_INSTANCE_HOST_ADD: {
      let hosts = [];
      let index = 0;

      if ('hosts' in state && state.hosts !== undefined && state.hosts.length > 0) {
        hosts = cloneDeep(state.hosts);
        index = Math.max(...hosts.map(e => e.id)) + 1;
      }

      const newRow = {id: index, name: "", description: '', service: '', parameters: [], newEntry: true };
      newRow.backup = cloneDeep(newRow)
      hosts.push(newRow);

      return state.merge({
        editMode: true,
        hosts: hosts
      });
    }
    case APPLICATION_INSTANCE_HOST_DELETE: {
      const hosts = state.hosts.filter(v => v.id !== payload.rowData.id);
      return state.merge({
        hosts: hosts,
      })
    }
    case APPLICATION_INSTANCE_HOST_EDIT_ACTIVATE: {
      const hosts = cloneDeep(state.hosts);
      const index = findIndex(hosts, { id: payload.rowData.id });

      hosts[index].backup = cloneDeep(hosts[index]);

      return state.merge({
        editMode: true,
        hosts: hosts
      });
    }
    case APPLICATION_INSTANCE_HOST_EDIT_CONFIRM: {
      const hosts = cloneDeep(state.hosts);
      const index = findIndex(hosts, { id: payload.rowData.id });

      delete hosts[index].backup;
      delete hosts[index].newEntry;

      return state.merge({
        editMode: false,
        hosts: hosts
      });
    }
    case APPLICATION_INSTANCE_HOST_EDIT_CHANGE: {
      const hosts = cloneDeep(state.hosts);
      const index = findIndex(hosts, { id: payload.rowData.id });

      hosts[index][payload.property] = payload.value;

      return state.set('hosts', hosts);
    }
    case APPLICATION_INSTANCE_HOST_EDIT_CANCEL: {
      const hosts = cloneDeep(state.hosts);
      const index = findIndex(hosts, { id: payload.rowData.id });

      hosts[index] = cloneDeep(hosts[index].backup);
      delete hosts[index].backup;

      if (hosts[index].newEntry === true) {
        hosts.splice(index, 1);
      }

      return state.merge({
        editMode: false,
        hosts: hosts
      });
    }
    case APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_OPEN: {
      let parametersData = {};

      if (payload && payload.rowData) {
        const selectedService = state.services.filter(entry => entry.id == payload.rowData.service)[0];

        parametersData.serviceDefinition = {
          id: selectedService.id,
          name: selectedService.name,
          hostgroup_id: selectedService.hostgroup,
          hostId: payload.rowData.id,
        };
        parametersData.parameters = payload.rowData.parameters;

        if (parametersData.parameters.length > 0) {
          parametersData.mode = 'editInstance';
        } else {
          parametersData.mode = 'newInstance';
          // Initialize the new Instance with the parameters of the appDefinition.
          parametersData.parameters = selectedService.parameters;
        }
      }
      return state.merge({
        isModalOpen: true,
        parametersData: parametersData,
      });
    }
    case APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_CLOSE: {
      const hosts = cloneDeep(state.hosts);
      const index = findIndex(hosts, { id: state.parametersData.serviceDefinition.hostId });
      hosts[index].parameters = cloneDeep(payload.hostParameterSelection);

      return state.merge({
        isModalOpen: false,
        parametersData: null,
        hosts: hosts
      });
    }
    default:
      return state;
  }
};

export default applicationInstanceConf;

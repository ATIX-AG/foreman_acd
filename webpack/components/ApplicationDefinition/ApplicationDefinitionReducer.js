import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import {
  APPLICATION_DEFINITION_INIT,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_REQUEST,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_SUCCESS,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_FAILURE,
  APPLICATION_DEFINITION_SERVICE_DELETE,
  APPLICATION_DEFINITION_SERVICE_ADD,
  APPLICATION_DEFINITION_SERVICE_EDIT_ACTIVATE,
  APPLICATION_DEFINITION_SERVICE_EDIT_CONFIRM,
  APPLICATION_DEFINITION_SERVICE_EDIT_CHANGE,
  APPLICATION_DEFINITION_SERVICE_EDIT_CANCEL,
  APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_DEFINITION_CHANGE_PARAMETER_SELECTION_MODE,
} from './ApplicationDefinitionConstants';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelection/ParameterSelectionConstants';

import {
  transformAnsiblePlaybook,
} from './ApplicationDefinitionHelper';

export const initialState = Immutable({
  name: false,
  error: { errorMsg: '', status: '', statusText: '' },
});

const applicationDefinitionConf = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case APPLICATION_DEFINITION_INIT: {
      return state.merge(payload);
    }

   case APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_FAILURE: {
      return state.merge({ error: payload.error, loading: false });
    }
    case APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_REQUEST: {
      return state.set('loading', true);
    }
    case APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_SUCCESS: {
      let newState = {};
      let allVars = [];

      const ansiblePlaybook = transformAnsiblePlaybook(payload);

      if (ansiblePlaybook.hasOwnProperty('groups')) {
        allVars = ansiblePlaybook.groups['all']
      }

      newState = {
        ansiblePlaybook: ansiblePlaybook,
        ansibleVarsAll: allVars
      }

      return state.merge(newState);
    }
    case APPLICATION_DEFINITION_SERVICE_ADD: {
      let services = [];
      let index = 1;

      if ('services' in state && state.services !== undefined && state.services.length > 0) {
        services = cloneDeep(state.services);
        index = Math.max(...services.map(e => e.id)) + 1;
      }

      const newRow = { id: index, name: "", description: '', hostgroup: '',
                       ansibleGroup: '', minCount: '', maxCount: '',
                       foremanParameters: [], ansibleParameters: [], newEntry: true };
      newRow.backup = cloneDeep(newRow)
      services.push(newRow);

      return state.merge({
        editMode: true,
        services: services
      });
    }
    case APPLICATION_DEFINITION_SERVICE_DELETE: {
      const services = state.services.filter(v => v.id !== payload.rowData.id);
      return state.merge({
        services: services,
      })
    }
    case APPLICATION_DEFINITION_SERVICE_EDIT_ACTIVATE: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: payload.rowData.id });

      services[index].backup = cloneDeep(services[index]);

      return state.merge({
        editMode: true,
        services: services
      });
    }
    case APPLICATION_DEFINITION_SERVICE_EDIT_CONFIRM: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: payload.rowData.id });

      const thisService = services[index];

      if (thisService.name == '') {
        window.alert("Every service needs to have a valid name.");
        return state;
      }

      if (thisService.hostgroup == '') {
        window.alert("Every service needs to be assigned to a hostgroup.");
        return state;
      }

      if (thisService.ansibleGroup == '') {
        window.alert("Every service needs to be assigned to a ansible group.");
        return state;
      }

      if (state.services.filter(v => v.name === thisService.name && v.id != thisService.id).length > 0) {
        window.alert("Service name already used in this Application Definition. Please make sure that every service name is unique.");
        return state;
      }

      delete services[index].backup;
      delete services[index].newEntry;

      let ansibleParameters = [];
      const selectedGroup = services[index].ansibleGroup;

      if (selectedGroup) {
        services[index].ansibleParameters = state.ansiblePlaybook.groups[selectedGroup];
      }

      return state.merge({
        editMode: false,
        services: services,
      });
    }
    case APPLICATION_DEFINITION_SERVICE_EDIT_CHANGE: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: payload.rowData.id });

      services[index][payload.property] = payload.value;

      return state.set('services', services);
    }
    case APPLICATION_DEFINITION_SERVICE_EDIT_CANCEL: {
      const services = cloneDeep(state.services);
      const index = findIndex(services, { id: payload.rowData.id });

      services[index] = cloneDeep(services[index].backup);
      delete services[index].backup;

      if (services[index].newEntry === true) {
        services.splice(index, 1);
      }

      return state.merge({
        editMode: false,
        services: services
      });
    }
    case APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_OPEN: {
      let parametersData = {};

      parametersData.paramDefinition = {
        id: payload.rowData.id,
        name: payload.rowData.name,
        dataId: payload.rowData.hostgroup
      }

      parametersData.type = PARAMETER_SELECTION_PARAM_TYPE_FOREMAN;
      parametersData.parameters = payload.rowData.foremanParameters;
      parametersData.useDefaultValue = true;
      parametersData.allowRowAdjustment = true;
      parametersData.allowNameAdjustment = true;
      parametersData.allowDescriptionAdjustment = true;

      return state.merge({
        parametersData: parametersData,
      });
    }
    case APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE: {
      if (payload.mode == 'save') {
        const services = cloneDeep(state.services);
        const index = findIndex(services, { id: state.parametersData.paramDefinition.id });
        services[index].foremanParameters = cloneDeep(payload.parameterSelection);

        return state.merge({
          parametersData: null,
          services: services,
        });
      } else {
        return state.merge({
          parametersData: null,
        });
      }
    }
    case APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_OPEN: {
      let parametersData = {};

      if ((payload.hasOwnProperty('isAllGroup')) && (payload.isAllGroup == true)) {
        parametersData.parameters = state.ansibleVarsAll;
        parametersData.paramDefinition = {
          isAllGroup: true,
        }
      } else  {
        parametersData.parameters = payload.rowData.ansibleParameters;
        parametersData.paramDefinition = {
          id: payload.rowData.id,
          name: payload.rowData.name,
        }
      }

      parametersData.type = PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE;
      parametersData.useDefaultValue = false;
      parametersData.allowRowAdjustment = true;
      parametersData.allowNameAdjustment = true;
      parametersData.allowDescriptionAdjustment = true;

      return state.merge({
        parametersData: parametersData,
      });
    }
    case APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE: {
      let newState = {};
      if (payload.mode == 'save') {
        if ((state.parametersData.paramDefinition.hasOwnProperty('isAllGroup')) && (state.parametersData.paramDefinition.isAllGroup == true)) {
          newState = {
            parametersData: null,
            ansibleVarsAll: cloneDeep(payload.parameterSelection),
          };
        } else {
          const services = cloneDeep(state.services);
          const index = findIndex(services, { id: state.parametersData.paramDefinition.id });
          services[index].ansibleParameters = cloneDeep(payload.parameterSelection);

          newState = {
            parametersData: null,
            services: services,
          };
        }
      } else {
        newState = {
          parametersData: null,
        };
      }
      return state.merge(newState);
    }
    case APPLICATION_DEFINITION_CHANGE_PARAMETER_SELECTION_MODE: {
      return state.merge({ paramEditMode: payload.mode });
    }
    default:
      return state;
  }
};

export default applicationDefinitionConf;

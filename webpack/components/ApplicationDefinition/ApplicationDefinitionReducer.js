import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import {
  APPLICATION_DEFINITION_INIT,
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
} from './ApplicationDefinitionConstants';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelection/ParameterSelectionConstants';

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

      delete services[index].backup;
      delete services[index].newEntry;

      return state.merge({
        editMode: false,
        services: services
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

      // FIXME: use the state playbookId.
      const playbookId = $('#foreman_acd_app_definition_acd_ansible_playbook_id').val();

      if ((payload.hasOwnProperty('isAllGroup')) && (payload.isAllGroup == true)) {
        parametersData.parameters = state.ansibleVarsAll;
        parametersData.paramDefinition = {
          isAllGroup: true,
          dataId: playbookId,
          dataSubId: 'all'
        }
      } else  {
        parametersData.paramDefinition = {
          id: payload.rowData.id,
          name: payload.rowData.name,
          dataId: playbookId,
          dataSubId: payload.rowData.ansibleGroup
        }
        parametersData.parameters = payload.rowData.ansibleParameters;
      }

      parametersData.type = PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE;
      parametersData.useDefaultValue = false;
      parametersData.allowRowAdjustment = false;
      parametersData.allowNameAdjustment = false;
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
    default:
      return state;
  }
};

export default applicationDefinitionConf;

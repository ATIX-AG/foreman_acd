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
  APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
} from './ApplicationInstanceConstants';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelection/ParameterSelectionConstants';

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
      let newState = {};
      const services = payload.app_definition.services;

      // initialize all services count with 0
      services.map(serv => {
        serv['currentCount'] = 0;
      })

      // Update count
      if (state.hosts !== undefined) {
        state.hosts.map((host, index) => {
          const hostServiceId = Number(host.service);
          const service = services.find(serv => serv['id'] == hostServiceId);
          service['currentCount'] += 1;
        });
      }

      newState = {
        appDefinition: payload.app_definition,
        services: services,
        loading: false,
      };

      // Initialize ansibleGroupVarsAll if there is no data available in app instance
      if (state.ansibleGroupVarsAll.length <= 0) {
        newState['ansibleGroupVarsAll'] = payload.app_definition.ansible_gv_all;
      }

      return state.merge(newState);
    }
    case APPLICATION_INSTANCE_HOST_ADD: {
      let hosts = [];
      let index = 1;

      if ('hosts' in state && state.hosts !== undefined && state.hosts.length > 0) {
        hosts = cloneDeep(state.hosts);
        index = Math.max(...hosts.map(e => e.id)) + 1;
      }

      const newRow = {id: index, hostname: "", description: '', service: '', foremanParameters: [], ansibleParameters: [], newEntry: true };
      newRow.backup = cloneDeep(newRow)
      hosts.push(newRow);

      return state.merge({
        editMode: true,
        hosts: hosts
      });
    }
    case APPLICATION_INSTANCE_HOST_DELETE: {
      const services = cloneDeep(state.services);
      const host = state.hosts.find(v => v.id == payload.rowData.id);
      const hostServiceId = Number(host.service);
      const hosts = state.hosts.filter(v => v.id !== host.id);

      // Update count
      const service = services.find(serv => serv['id'] == hostServiceId);
      service['currentCount'] -= 1;

      return state.merge({
        hosts: hosts,
        services: services,
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
      const services = cloneDeep(state.services);

      const thisHost = hosts[index];

      if (thisHost.hostname == '') {
        window.alert("Every host needs to have a valid name");
        return state;
      }

      if (thisHost.service == '') {
        window.alert("Every host needs to be assigned to a service");
        return state;
      }

      if (state.hosts.filter(v => v.hostname === thisHost.hostname && v.id != thisHost.id).length > 0) {
        window.alert("Host name already used for this Application Instance. Please make sure that every host name is unique");
        return state;
      }

      // Initialize the new Instance with the parameters of the Application Definition.
      if (thisHost.newEntry === true) {
          const selectedService = state.services.filter(entry => entry.id == payload.rowData.service)[0];
          hosts[index].foremanParameters = selectedService.foremanParameters;
          hosts[index].ansibleParameters = selectedService.ansibleParameters;

          const hostServiceId = Number(thisHost.service);
          const service = services.find(serv => serv['id'] == hostServiceId);
          if ('currentCount' in service) {
            service['currentCount'] += 1;
          } else {
            service['currentCount'] = 1;
          }
      }

      delete hosts[index].backup;
      delete hosts[index].newEntry;

      return state.merge({
        editMode: false,
        services: services,
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
    case APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_OPEN: {
      let parametersData = {};

      const selectedService = state.services.filter(entry => entry.id == payload.rowData.service)[0];

      parametersData.paramDefinition = {
        id: selectedService.id,
        name: selectedService.name,
        dataId: selectedService.hostgroup,
        hostId: payload.rowData.id,
        // TODO: is this really correct? Guess it shoud be dataId and we should get rid of them
        //hostgroup_id: selectedService.hostgroup,
      };
      parametersData.type = PARAMETER_SELECTION_PARAM_TYPE_FOREMAN;
      parametersData.parameters = payload.rowData.foremanParameters;
      parametersData.useDefaultValue = false;
      parametersData.allowRowAdjustment = false;
      parametersData.allowNameAdjustment = false;
      parametersData.allowDescriptionAdjustment = false;

      return state.merge({
        parametersData: parametersData,
      });
    }
    case APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE: {
      if (payload.mode == 'save') {
        const hosts = cloneDeep(state.hosts);
        const index = findIndex(hosts, { id: state.parametersData.paramDefinition.hostId });
        hosts[index].foremanParameters = cloneDeep(payload.parameterSelection);

        return state.merge({
          parametersData: null,
          hosts: hosts
        });
      } else {
        return state.merge({
          parametersData: null,
        });
      }
    }
    case APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_OPEN: {
      let parametersData = {};

      if ((payload.hasOwnProperty('isAllGroup')) && (payload.isAllGroup == true)) {
        parametersData.parameters = state.ansibleGroupVarsAll;
        parametersData.paramDefinition = {
          isAllGroup: true,
        }
      } else {
        const selectedService = state.services.filter(entry => entry.id == payload.rowData.service)[0];

        parametersData.paramDefinition = {
          id: selectedService.id,
          name: selectedService.name,
          hostId: payload.rowData.id,
          // TODO: is this really correct? Guess it shoud be dataId and we should get rid of them
          //hostgroup_id: selectedService.hostgroup,
        };
        parametersData.parameters = payload.rowData.ansibleParameters;
      }

      parametersData.type = PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE;
      parametersData.useDefaultValue = false;
      parametersData.allowRowAdjustment = false;
      parametersData.allowNameAdjustment = false;
      parametersData.allowDescriptionAdjustment = false;

      return state.merge({
        parametersData: parametersData,
      });
    }
    case APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE: {
      let newState = {};
      if (payload.mode == 'save') {
        if ((state.parametersData.paramDefinition.hasOwnProperty('isAllGroup')) && (state.parametersData.paramDefinition.isAllGroup == true)) {
          newState = {
            parametersData: null,
            ansibleGroupVarsAll: cloneDeep(payload.parameterSelection),
          };
        } else {
          const hosts = cloneDeep(state.hosts);
          const index = findIndex(hosts, { id: state.parametersData.paramDefinition.hostId });
          hosts[index].ansibleParameters = cloneDeep(payload.parameterSelection);

          newState = {
            parametersData: null,
            hosts: hosts
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

export default applicationInstanceConf;

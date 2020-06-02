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
      const services = JSON.parse(payload.app_definition.services);

      // initialize all services count with 0
      services.map(serv => {
        serv['currentCount'] = 0;
      })

      // Update count
      state.hosts.map((host, index) => {
        const hostServiceId = Number(host.service);
        const service = services.find(serv => serv['id'] == hostServiceId);
        service['currentCount'] += 1;
      });

      return state.merge({
        appDefinition: payload.app_definition,
        services: services,
        loading: false,
      });
    }
    case APPLICATION_INSTANCE_HOST_ADD: {
      let hosts = [];
      let index = 1;

      if ('hosts' in state && state.hosts !== undefined && state.hosts.length > 0) {
        hosts = cloneDeep(state.hosts);
        index = Math.max(...hosts.map(e => e.id)) + 1;
      }

      const newRow = {id: index, hostname: "", description: '', service: '', parameters: [], newEntry: true };
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
          hosts[index].parameters = selectedService.parameters;

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

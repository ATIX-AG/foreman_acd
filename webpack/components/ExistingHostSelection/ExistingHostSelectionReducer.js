import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import { shortHostname } from '../../helper';
import * as sort from 'sortabular';

import {
  EXISTING_HOST_SELECTION_INIT,
  EXISTING_HOST_SELECTION_LOAD_HOSTS_SUCCESS,
  EXISTING_HOST_SELECTION_LOAD_HOSTS_FAILURE,
  EXISTING_HOST_SELECTION_SELECTION_CHANGED,
} from './ExistingHostSelectionConstants';

export const initialState = Immutable({
  serviceId: undefined,
  error: { errorMsg: '', status: '', statusText: '' },
});

const existingHostSelectionConf = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case EXISTING_HOST_SELECTION_INIT: {
      return state.merge(payload);
    }
    case EXISTING_HOST_SELECTION_LOAD_HOSTS_SUCCESS: {
      let alreadyUsedHosts = [];

      console.log(state.allHosts);
      console.log(payload);

      state.allHosts.forEach(host => {
        if ((host.service == payload.serviceId) && (host.isExistingHost == true)) {
          alreadyUsedHosts.push({
            value: host.hostname,
            label: host.hostname,
            disabled: true,
            tooltipText: __('Host already used for this application instance'),
          });
        }
      });

      let availableHosts = [];
      let hostsInHostgroup = {};
      payload.hosts.forEach(host => {
        let shortName = shortHostname(host.name);
        if (state.allHosts.find(h => h.hostname == shortName) == undefined) {
          availableHosts.push({
            value: shortName,
            label: shortName,
          });
        }
        hostsInHostgroup[shortName] = host;
      });

      return state.merge({
        hostsInHostgroup: hostsInHostgroup,
        availableHosts: availableHosts,
        alreadyUsedHosts: alreadyUsedHosts,
        serviceId: payload.serviceId,
      });
    }
    case EXISTING_HOST_SELECTION_LOAD_HOSTS_FAILURE: {
      return state.merge({ error: payload.error });
    }
    case EXISTING_HOST_SELECTION_SELECTION_CHANGED: {
      let selectedHosts = [];

      payload.selection.forEach(selHost => {
        let hostData = state.hostsInHostgroup[selHost.value];
        selectedHosts.push({
          fqdn: hostData.name,
          hostname: shortHostname(hostData.name),
          hostgroupId: hostData.hostgroup_id,
          serviceId: state.serviceId,
        });
      });

      return state.merge({
        selectedHosts: selectedHosts,
      });
    }
    default:
      return state;
  }
};

export default existingHostSelectionConf;

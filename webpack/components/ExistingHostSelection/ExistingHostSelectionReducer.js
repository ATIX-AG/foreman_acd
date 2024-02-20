import Immutable from 'seamless-immutable';

import { cloneDeep, findIndex, findLastIndex } from 'lodash';

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
      const alreadyUsedHosts = [];

      state.allHosts.forEach(host => {
        if (host.service == payload.serviceId && host.isExistingHost == true) {
          alreadyUsedHosts.push({
            value: host.hostname,
            label: host.hostname,
            disabled: true,
            tooltipText: __('Host already used for this application instance'),
          });
        }
      });

      const availableHosts = [];
      const hostsInHostgroup = {};
      payload.hosts.forEach(host => {
        const shortName = shortHostname(host.name);
        if (state.allHosts.find(h => h.hostname == shortName) == undefined) {
          availableHosts.push({
            value: shortName,
            label: shortName,
          });
        }
        hostsInHostgroup[shortName] = host;
      });

      return state.merge({
        hostsInHostgroup,
        availableHosts,
        alreadyUsedHosts,
        serviceId: payload.serviceId,
      });
    }
    case EXISTING_HOST_SELECTION_LOAD_HOSTS_FAILURE: {
      return state.merge({ error: payload.error });
    }
    case EXISTING_HOST_SELECTION_SELECTION_CHANGED: {
      const selectedHosts = [];

      payload.selection.forEach(selHost => {
        const hostData = state.hostsInHostgroup[selHost.value];
        selectedHosts.push({
          fqdn: hostData.name,
          hostname: shortHostname(hostData.name),
          hostgroupId: hostData.hostgroup_id,
          serviceId: state.serviceId,
        });
      });

      return state.merge({
        selectedHosts,
      });
    }
    default:
      return state;
  }
};

export default existingHostSelectionConf;

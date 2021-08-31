const existingHostState = state => state.foremanAcd.existingHostSelectionConf;

export const selectServiceId = state => existingHostState(state).serviceId;
export const selectAllHosts = state => existingHostState(state).allHosts;
export const selectHostsInHostgroup = state => existingHostState(state).selectHostsInHostgroup;
export const selectAvailableHosts = state => existingHostState(state).availableHosts;
export const selectAlreadyUsedHosts = state => existingHostState(state).alreadyUsedHosts;
export const selectSelectedHosts = state => existingHostState(state).selectedHosts;

const applicationInstanceConf = state => state.foremanAcd.applicationInstanceConf;

export const selectEditMode = state => applicationInstanceConf(state).editMode;
export const selectAppDefinition = state => applicationInstanceConf(state).appDefinition;
export const selectHosts = state => applicationInstanceConf(state).hosts;
export const selectColumns = state => applicationInstanceConf(state).columns;
export const selectServices = state => applicationInstanceConf(state).services;
export const selectParametersData = state => applicationInstanceConf(state).parametersData;
export const selectAnsibleVarsAll = state => applicationInstanceConf(state).ansibleVarsAll;
export const selectParamEditMode = state => applicationInstanceConf(state).paramEditMode;

const syncGitRepoConf = state => state.foremanAcd.syncGitRepoConf;

export const selectScmType = state => syncGitRepoConf(state).scmType;
export const selectPath = state => syncGitRepoConf(state).path;
export const selectGitCommit = state => syncGitRepoConf(state).gitCommit;
export const selectGitUrl = state => syncGitRepoConf(state).gitUrl;

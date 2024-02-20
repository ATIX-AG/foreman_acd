import Immutable from 'seamless-immutable';
import { cloneDeep, findIndex, findLastIndex } from 'lodash';

import { syncGitRepoConfData_1 } from '../__fixtures__/syncGitRepoConfData_1.fixtures';

export const successState = Immutable(syncGitRepoConfData_1);

// Payload Data
export const initSyncGitRepoPayload = syncGitRepoConfData_1;

export const loadPathPayload = {
  path: 'https://example.com',
};

export const loadGitCommitPayload = {
  gitCommit: 'master',
};

export const loadGitUrlPayload = {
  gitUrl: 'https://github.com/alpha.git',
};

export const loadScmTypePayload = {
  scmType: {
    git: 'git',
  },
};

export const handleGitRepoSyncRequestPayload = {
  clearRows: false,
};

export const handleGitRepoSyncSuccessPayload = {};

export const handleGitRepoSyncFailurePayload = {
  error: 'Something really bad happend',
};

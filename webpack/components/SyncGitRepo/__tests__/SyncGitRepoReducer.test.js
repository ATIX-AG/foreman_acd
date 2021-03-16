import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer, { initialState } from '../SyncGitRepoReducer';

import {
  successState,
  initSyncGitRepoPayload,
  loadPathPayload,
  loadGitCommitPayload,
  loadScmTypePayload,
  loadGitUrlPayload,
  handleGitRepoSyncRequestPayload,
  handleGitRepoSyncSuccessPayload,
  handleGitRepoSyncFailurePayload,
} from '../__fixtures__/syncGitRepoReducer.fixtures';

import {
  SYNC_GIT_REPO_INIT,
  SYNC_GIT_REPO_LOAD_SCM_TYPE,
  SYNC_GIT_REPO_LOAD_PATH,
  SYNC_GIT_REPO_LOAD_GIT_COMMIT,
  SYNC_GIT_REPO_LOAD_GIT_URL,
  SYNC_GIT_REPO_REQUEST,
  SYNC_GIT_REPO_FAILURE,
  SYNC_GIT_REPO_SUCCESS,
} from '../SyncGitRepoConstants';

const fixtures = {
  'should return initial state': {
    state: initialState,
    action: {
      type: undefined,
      payload: {},
    },
  },

  'should initialize component': {
    state: initialState,
    action: {
      type: SYNC_GIT_REPO_INIT,
      payload: initSyncGitRepoPayload,
    },
  },
  'should load path': {
    state: successState,
    action: {
      type: SYNC_GIT_REPO_LOAD_PATH,
      path: loadPathPayload,
    },
  },
  'should load git commit': {
    state: successState,
    action: {
      type: SYNC_GIT_REPO_LOAD_GIT_COMMIT,
      gitCommit: loadGitCommitPayload,
    },
  },
  'should load git url': {
    state: successState,
    action: {
      type: SYNC_GIT_REPO_LOAD_GIT_URL,
      gitCommit: loadGitUrlPayload,
    },
  },
  'should load scm_type': {
    state: successState,
    action: {
      type: SYNC_GIT_REPO_LOAD_SCM_TYPE,
      scmType: loadScmTypePayload,
    },
  },
  'should request handle git repo sync': {
    state: successState,
    action: {
      type: SYNC_GIT_REPO_REQUEST,
      payload: handleGitRepoSyncRequestPayload,
    },
  },
  'should handle git repo sync be successful': {
    state: successState,
    action: {
      type: SYNC_GIT_REPO_SUCCESS,
      payload: handleGitRepoSyncSuccessPayload,
    },
  },
  'should handle git repo sync be erroneous': {
    state: successState,
    action: {
      type: SYNC_GIT_REPO_FAILURE,
      payload: handleGitRepoSyncFailurePayload,
    },
  },
};

describe('SyncGitRepoReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));

import Immutable from 'seamless-immutable';

import {
  SYNC_GIT_REPO_INIT,
  SYNC_GIT_REPO_LOAD_SCM_TYPE,
  SYNC_GIT_REPO_LOAD_PATH,
  SYNC_GIT_REPO_LOAD_GIT_COMMIT,
  SYNC_GIT_REPO_LOAD_GIT_URL,
  SYNC_GIT_REPO_FAILURE,
  SYNC_GIT_REPO_REQUEST,
  SYNC_GIT_REPO_SUCCESS,
} from './SyncGitRepoConstants';

export const initialState = Immutable({
  loading: false,
});

const syncGitRepoConf = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case SYNC_GIT_REPO_INIT: {
      return state.merge(payload);
    }
    case SYNC_GIT_REPO_LOAD_SCM_TYPE: {
      let newState = {};
      const scmType = action.scmType;

      newState = {
        scmType: scmType,
      };

      return state.merge(newState);
    }
    case SYNC_GIT_REPO_LOAD_PATH: {
      let newState = {};
      const path = action.path;

      newState = {
        path: path,
      };

      return state.merge(newState);
    }
    case SYNC_GIT_REPO_LOAD_GIT_COMMIT: {
      let newState = {};
      const gitCommit = action.gitCommit;

      newState = {
        gitCommit: gitCommit,
      };

      return state.merge(newState);
    }
    case SYNC_GIT_REPO_LOAD_GIT_URL: {
      let newState = {};
      const gitUrl = action.gitUrl;

      newState = {
        gitUrl: gitUrl,
      };

      return state.merge(newState);
    }
    case SYNC_GIT_REPO_FAILURE: {
       return state.merge({ error: payload.error, loading: false });
     }
     case SYNC_GIT_REPO_REQUEST: {
       return state.set('loading', true);
     }
     case SYNC_GIT_REPO_SUCCESS: {
       let newState = {};
       return state.merge(newState);
     }
    default:
      return state;
  }
};

export default syncGitRepoConf;

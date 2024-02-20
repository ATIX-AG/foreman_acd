import React from 'react';
import { API, actionTypeGenerator } from 'foremanReact/redux/API';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/components/ToastsList';

import {
  SYNC_GIT_REPO_INIT,
  SYNC_GIT_REPO_LOAD_SCM_TYPE,
  SYNC_GIT_REPO_LOAD_PATH,
  SYNC_GIT_REPO_LOAD_GIT_COMMIT,
  SYNC_GIT_REPO_LOAD_GIT_URL,
  SYNC_GIT_REPO_REQUEST,
  SYNC_GIT_REPO_FAILURE,
  SYNC_GIT_REPO_SUCCESS,
} from './SyncGitRepoConstants';

export const initSyncGitRepo = (
  scmType,
  path,
  gitCommit,
  gitUrl
) => dispatch => {
  const initialState = {};

  initialState.scmType = scmType;
  initialState.path = path;
  initialState.gitCommit = gitCommit;
  initialState.gitUrl = gitUrl;

  dispatch({
    type: SYNC_GIT_REPO_INIT,
    payload: initialState,
  });
};

const errorHandler = (msg, err) => {
  const error = {
    errorMsg: __('Failed to fetch data from server.'),
    statusText: err,
  };
  return { type: msg, payload: { error } };
};

export const handleGitRepoSync = (
  gitUrl,
  gitCommit,
  scmType,
  e
) => async dispatch => {
  e.preventDefault();
  // const { REQUEST, SUCCESS, FAILURE } = actionTypeGenerator(SYNC_GIT_REPOSITORY);
  dispatch({
    type: SYNC_GIT_REPO_REQUEST,
    payload: {
      git_commit: gitCommit,
      scm_type: scmType,
      git_url: gitUrl,
    },
  });
  try {
    const { data } = await API.post('/acd/ansible_playbooks/sync_git_repo', {
      ansible_playbook: {
        git_commit: gitCommit,
        scm_type: scmType,
        git_url: gitUrl,
      },
    });
    dispatch(
      addToast({
        type: 'success',
        message: sprintf(__('Sucessfully synced git repository ')),
        key: SYNC_GIT_REPO_SUCCESS,
      })
    );
    return dispatch({
      type: SYNC_GIT_REPO_SUCCESS,
      payload: {
        git_commit: gitCommit,
        git_url: gitUrl,
        scm_type: scmType,
      },
      response: data,
    });
  } catch (error) {
    dispatch(
      addToast({
        type: 'error',
        message: sprintf(
          __('Error occurred while syncing git repository: %s'),
          error.response.data.message
        ),
        key: SYNC_GIT_REPO_FAILURE,
      })
    );
    return dispatch({
      type: SYNC_GIT_REPO_FAILURE,
      payload: {
        error,
      },
      response: error,
    });
  }
};

export const loadScmType = scmType => ({
  type: SYNC_GIT_REPO_LOAD_SCM_TYPE,
  scmType,
});

export const loadPath = path => ({
  type: SYNC_GIT_REPO_LOAD_PATH,
  path,
});

export const loadGitCommit = gitCommit => ({
  type: SYNC_GIT_REPO_LOAD_GIT_COMMIT,
  gitCommit,
});

export const loadGitUrl = gitUrl => ({
  type: SYNC_GIT_REPO_LOAD_GIT_URL,
  gitUrl,
});

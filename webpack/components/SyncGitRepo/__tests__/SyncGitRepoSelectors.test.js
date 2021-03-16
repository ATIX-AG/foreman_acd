import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectScmType,
  selectPath,
  selectGitCommit,
  selectGitUrl,
} from '../SyncGitRepoSelectors';

import {
  syncGitRepoConfData_1,
} from '../__fixtures__/syncGitRepoConfData_1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    syncGitRepoConf: obj,
  },
});

const fixtures = {
  'should return scmType from syncGitRepoConfData_1 fixtures': () =>
    selectScmType(stateFactory(syncGitRepoConfData_1)),
  'should return path from syncGitRepoConfData_1 fixtures': () =>
    selectPath(stateFactory(syncGitRepoConfData_1)),
  'should return gitCommit from syncGitRepoConfData_1 fixtures': () =>
    selectGitCommit(stateFactory(syncGitRepoConfData_1)),
  'should return gitUrl from syncGitRepoConfData_1 fixtures': () =>
    selectGitUrl(stateFactory(syncGitRepoConfData_1)),
};

describe('SyncGitRepoSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));

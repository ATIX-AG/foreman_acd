import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectScmType,
  selectPath,
  selectGitCommit,
  selectGitUrl,
} from '../SyncGitRepoSelectors';

import { syncGitRepoConfData1 } from '../__fixtures__/syncGitRepoConfData1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    syncGitRepoConf: obj,
  },
});

const fixtures = {
  'should return scmType from syncGitRepoConfData1 fixtures': () =>
    selectScmType(stateFactory(syncGitRepoConfData1)),
  'should return path from syncGitRepoConfData1 fixtures': () =>
    selectPath(stateFactory(syncGitRepoConfData1)),
  'should return gitCommit from syncGitRepoConfData1 fixtures': () =>
    selectGitCommit(stateFactory(syncGitRepoConfData1)),
  'should return gitUrl from syncGitRepoConfData1 fixtures': () =>
    selectGitUrl(stateFactory(syncGitRepoConfData1)),
};

describe('SyncGitRepoSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));

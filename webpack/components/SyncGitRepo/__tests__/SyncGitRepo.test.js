import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SyncGitRepo from '../SyncGitRepo';

const noop = () => {};

const fixtures = {
  'should render ansible playbook': {
    data: {
      scmType: "",
      path: "",
      gitCommit: "",
      appDefinitions: "",
      gitUrl: "",
      scmTypes: {},
    },
    initSyncGitRepo: noop,
    loadScmType: noop,
    loadPath: noop,
    loadGitCommit: noop,
    loadGitUrl: noop,
    handleGitRepoSync: noop,
  },
};

describe('SyncGitRepo', () =>
  testComponentSnapshotsWithFixtures(SyncGitRepo, fixtures));

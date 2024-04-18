import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SyncGitRepo from '../SyncGitRepo';

const noop = () => {};

const fixtures = {
  'should render empty ansible playbook': {
    data: {
      path: '',
      gitCommit: '',
      appDefinitions: [],
      gitUrl: '',
      scmTypes: {},
      scmType: '',
    },
    initSyncGitRepo: noop,
    loadScmType: noop,
    loadPath: noop,
    loadGitCommit: noop,
    loadGitUrl: noop,
    handleGitRepoSync: noop,
  },
  'should render ansible playbook git-form': {
    data: {
      path: '',
      gitCommit: '',
      appDefinitions: [],
      gitUrl: '',
      scmTypes: {},
      scmType: '',
    },
    scmType: 'git',
    initSyncGitRepo: noop,
    loadScmType: noop,
    loadPath: noop,
    loadGitCommit: noop,
    loadGitUrl: noop,
    handleGitRepoSync: noop,
  },
  'should render ansible playbook directory-form': {
    data: {
      path: '',
      gitCommit: '',
      appDefinitions: [],
      gitUrl: '',
      scmTypes: {},
      scmType: '',
    },
    scmType: 'directory',
    initSyncGitRepo: noop,
    loadScmType: noop,
    loadPath: noop,
    loadGitCommit: noop,
    loadGitUrl: noop,
    handleGitRepoSync: noop,
  },
  'should render ansible playbook git-form with server-data': {
    data: {
      path: '',
      gitCommit: '',
      appDefinitions: [],
      gitUrl: '',
      scmTypes: { directory: 'directory', git: 'git' },
      scmType: '',
    },
    path: '/ansible/play_hello.yaml',
    gitCommit: 'main',
    gitUrl: 'https://git.example.com/playbooks.git',
    scmType: 'git',
    initSyncGitRepo: noop,
    loadScmType: noop,
    loadPath: noop,
    loadGitCommit: noop,
    loadGitUrl: noop,
    handleGitRepoSync: noop,
  },
  'should render ansible playbook directory-form with server-data': {
    data: {
      path: '',
      gitCommit: '',
      appDefinitions: [],
      gitUrl: '',
      scmTypes: { directory: 'directory', git: 'git' },
      scmType: 'directory',
    },
    gitUrl: '',
    path: '/ansible/play_hello.yaml',
    gitCommit: '',
    scmType: 'directory',
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

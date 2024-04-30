import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectServiceId,
  selectAvailableHosts,
  selectAlreadyUsedHosts,
  selectSelectedHosts,
  selectHostsInHostgroup,
} from '../ExistingHostSelectionSelectors';

import { existingHostSelectionConfData1 } from '../__fixtures__/existingHostSelectionConfData1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    existingHostSelectionConf: obj,
  },
});

const fixtures = {
  'should return serviceId from existingHostSelectionConfData1 fixtures': () =>
    selectServiceId(stateFactory(existingHostSelectionConfData1)),
  'should return availableHosts from existingHostSelectionConfData1 fixtures': () =>
    selectAvailableHosts(stateFactory(existingHostSelectionConfData1)),
  'should return alreadyUsedHosts from existingHostSelectionConfData1 fixtures': () =>
    selectAlreadyUsedHosts(stateFactory(existingHostSelectionConfData1)),
  'should return selectedHosts from existingHostSelectionConfData1 fixtures': () =>
    selectSelectedHosts(stateFactory(existingHostSelectionConfData1)),
  'should return hostsInHostgroup from existingHostSelectionConfData1 fixtures': () =>
    selectHostsInHostgroup(stateFactory(existingHostSelectionConfData1)),
};

describe('ExistingHostSelectionSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));

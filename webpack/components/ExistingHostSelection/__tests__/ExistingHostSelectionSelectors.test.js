import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectServiceId,
  selectAvailableHosts,
  selectAlreadyUsedHosts,
  selectSelectedHosts,
  selectHostsInHostgroup,
} from '../ExistingHostSelectionSelectors';

import {
  existingHostSelectionConfData_1,
} from '../__fixtures__/existingHostSelectionConfData_1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    existingHostSelectionConf: obj,
  },
});

const fixtures = {
  'should return serviceId from existingHostSelectionConfData_1 fixtures': () =>
    selectServiceId(stateFactory(existingHostSelectionConfData_1)),
  'should return availableHosts from existingHostSelectionConfData_1 fixtures': () =>
    selectAvailableHosts(stateFactory(existingHostSelectionConfData_1)),
  'should return alreadyUsedHosts from existingHostSelectionConfData_1 fixtures': () =>
    selectAlreadyUsedHosts(stateFactory(existingHostSelectionConfData_1)),
  'should return selectedHosts from existingHostSelectionConfData_1 fixtures': () =>
    selectSelectedHosts(stateFactory(existingHostSelectionConfData_1)),
  'should return hostsInHostgroup from existingHostSelectionConfData_1 fixtures': () =>
    selectHostsInHostgroup(stateFactory(existingHostSelectionConfData_1)),
};

describe('ExistingHostSelectionSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));


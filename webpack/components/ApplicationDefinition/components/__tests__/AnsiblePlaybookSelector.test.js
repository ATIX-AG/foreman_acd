import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import AnsiblePlaybookSelector from '../AnsiblePlaybookSelector';

const noop = () => {};

const fixtures = {
  'should render ansible playbook selector': {
    label: 'myLabel',
    hidden: false,
    editable: true,
    viewText: 'myText',
    selectValue: '1',
    onChange: noop,
    options: { first: 'first', second: 'second'},
    additionalData: { moreData: 'moooore' },
  },
  'should render hidden ansible playbook selector': {
    label: 'myLabel',
    hidden: true,
    editable: true,
    viewText: 'myText',
    selectValue: '1',
    onChange: noop,
    options: { first: 'first', second: 'second'},
    additionalData: { moreData: 'moooore' },
  },
  'should render not editable ansible playbook selector': {
    label: 'myLabel',
    hidden: false,
    editable: false,
    viewText: 'myText',
    selectValue: '1',
    onChange: noop,
    options: { first: 'first', second: 'second'},
    additionalData: { moreData: 'moooore' },
  },
};

describe('AnsiblePlaybookSelector', () =>
  testComponentSnapshotsWithFixtures(AnsiblePlaybookSelector, fixtures));

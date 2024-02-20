import Immutable from 'seamless-immutable';
import { cloneDeep, findIndex, findLastIndex } from 'lodash';

import { applicationDefinitionImportConfData_1 } from '../__fixtures__/applicationDefinitionImportConfData_1.fixtures';

export const successState = Immutable(applicationDefinitionImportConfData_1);

const EDIT_ROW_ID = 2;

const editClone = applicationDefinitionImportConfData_1;
const editIndex = findIndex(editClone.ansiblePlaybookServices, {
  id: EDIT_ROW_ID,
});
editClone.ansiblePlaybookServices[editIndex].backup = cloneDeep(
  editClone.ansiblePlaybookServices[editIndex]
);
export const editState = Immutable(editClone);

// Payload Data
export const initApplicationDefinitionImportPayload = applicationDefinitionImportConfData_1;
export const changeEditServicePayload = {
  value: 'helloworld',
  property: 'name',
  rowData: {
    id: EDIT_ROW_ID,
  },
};

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ApplicationDefinitionImport.scss';
import ApplicationDefinitionImport from './ApplicationDefinitionImport';
import * as ApplicationDefinitionImportActions from './ApplicationDefinitionImportActions';

import {
  selectEditMode,
  selectColumns,
  selectAnsiblePlaybookServices,
  selectShowAlertModal,
  selectAlertModalText,
  selectAlertModalTitle,
} from './ApplicationDefinitionImportSelectors';

const mapStateToProps = state => ({
  editMode: selectEditMode(state),
  columns: selectColumns(state),
  showAlertModal: selectShowAlertModal(state),
  alertModalText: selectAlertModalText(state),
  alertModalTitle: selectAlertModalTitle(state),
  ansiblePlaybookServices: selectAnsiblePlaybookServices(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ApplicationDefinitionImportActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationDefinitionImport);

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ApplicationDefinition.scss';
import ApplicationDefinition from './ApplicationDefinition';
import * as ApplicationDefinitionActions from './ApplicationDefinitionActions';

import {
  selectShowAlertModal,
  selectAlertModalText,
  selectAlertModalTitle,
  selectEditMode,
  selectAnsiblePlaybook,
  selectServices,
  selectColumns,
  selectHiddenForemanParameterTypes,
  selectParametersData,
  selectAnsibleVarsAll,
  selectParamEditMode,
} from './ApplicationDefinitionSelectors';

const mapStateToProps = state => ({
  showAlertModal: selectShowAlertModal(state),
  alertModalText: selectAlertModalText(state),
  alertModalTitle: selectAlertModalTitle(state),
  editMode: selectEditMode(state),
  ansiblePlaybook: selectAnsiblePlaybook(state),
  services: selectServices(state),
  columns: selectColumns(state),
  hiddenForemanParameterTypes: selectHiddenForemanParameterTypes(state),
  parametersData: selectParametersData(state),
  ansibleVarsAll: selectAnsibleVarsAll(state),
  paramEditMode: selectParamEditMode(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ApplicationDefinitionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationDefinition);


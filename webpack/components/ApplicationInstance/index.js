import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ApplicationInstance.scss';
import ApplicationInstance from './ApplicationInstance';
import * as ApplicationInstanceActions from './ApplicationInstanceActions';

import {
  selectShowAlertModal,
  selectAlertModalText,
  selectAlertModalTitle,
  selectEditMode,
  selectAppDefinition,
  selectHosts,
  selectServices,
  selectColumns,
  selectHiddenForemanParameterTypes,
  selectParametersData,
  selectAnsibleVarsAll,
  selectParamEditMode,
} from './ApplicationInstanceSelectors';

const mapStateToProps = state => ({
  showAlertModal: selectShowAlertModal(state),
  alertModalText: selectAlertModalText(state),
  alertModalTitle: selectAlertModalTitle(state),
  editMode: selectEditMode(state),
  appDefinition: selectAppDefinition(state),
  hosts: selectHosts(state),
  services: selectServices(state),
  columns: selectColumns(state),
  hiddenForemanParameterTypes: selectHiddenForemanParameterTypes(state),
  parametersData: selectParametersData(state),
  ansibleVarsAll: selectAnsibleVarsAll(state),
  paramEditMode: selectParamEditMode(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ApplicationInstanceActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationInstance);

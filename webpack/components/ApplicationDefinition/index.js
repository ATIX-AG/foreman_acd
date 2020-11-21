import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ApplicationDefinition.scss';
import ApplicationDefinition from './ApplicationDefinition';
import * as ApplicationDefinitionActions from './ApplicationDefinitionActions';

import {
  selectEditMode,
  selectAnsiblePlaybook,
  selectServices,
  selectColumns,
  selectParametersData,
  selectAnsibleVarsAll,
} from './ApplicationDefinitionSelectors';

const mapStateToProps = state => ({
  editMode: selectEditMode(state),
  ansiblePlaybook: selectAnsiblePlaybook(state),
  services: selectServices(state),
  columns: selectColumns(state),
  parametersData: selectParametersData(state),
  ansibleVarsAll: selectAnsibleVarsAll(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ApplicationDefinitionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationDefinition);


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ApplicationInstance.scss';
import ApplicationInstance from './ApplicationInstance';
import * as ApplicationInstanceActions from './ApplicationInstanceActions';

import {
  selectEditMode,
  selectAppDefinition,
  selectHosts,
  selectServices,
  selectColumns,
  selectIsModalOpen,
  selectParametersData,
} from './ApplicationInstanceSelectors';

const mapStateToProps = state => ({
  editMode: selectEditMode(state),
  appDefinition: selectAppDefinition(state),
  hosts: selectHosts(state),
  services: selectServices(state),
  columns: selectColumns(state),
  isModalOpen: selectIsModalOpen(state),
  parametersData: selectParametersData(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ApplicationInstanceActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationInstance);


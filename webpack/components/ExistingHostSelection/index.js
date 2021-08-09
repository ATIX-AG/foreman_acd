import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ExistingHostSelection.scss';
import ExistingHostSelection from './ExistingHostSelection';
import * as ExistingHostSelectionActions from './ExistingHostSelectionActions';

import {
  selectServiceId,
  selectAvailableHosts,
  selectAlreadyUsedHosts,
} from './ExistingHostSelectionSelectors';

const mapStateToProps = state => ({
  serviceId: selectServiceId(state),
  availableHosts: selectAvailableHosts(state),
  alreadyUsedHosts: selectAlreadyUsedHosts(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ExistingHostSelectionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExistingHostSelection);

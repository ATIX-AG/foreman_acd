import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ApplicationInstanceDeploy.scss';
import ApplicationInstanceDeploy from './ApplicationInstanceDeploy';
import * as ApplicationInstanceDeployActions from './ApplicationInstanceDeployActions';

import {
  selectHosts,
  selectReport,
  selectActiveHostId,
} from './ApplicationInstanceDeploySelectors';

const mapStateToProps = state => ({
  hosts: selectHosts(state),
  report: selectReport(state),
  activeHostId: selectActiveHostId(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ApplicationInstanceDeployActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationInstanceDeploy);


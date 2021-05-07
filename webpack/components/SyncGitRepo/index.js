import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './SyncGitRepo.scss';
import SyncGitRepo from './SyncGitRepo';
import * as SyncGitRepoActions from './SyncGitRepoActions';

import {
  selectScmType,
  selectPath,
  selectGitCommit,
  selectGitUrl,
} from './SyncGitRepoSelectors';

const mapStateToProps = state => ({
  scmType: selectScmType(state),
  gitCommit: selectGitCommit(state),
  path: selectPath(state),
  gitUrl: selectGitUrl(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(SyncGitRepoActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncGitRepo);

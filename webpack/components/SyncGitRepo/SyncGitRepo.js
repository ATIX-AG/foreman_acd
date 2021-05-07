import React, { useState } from 'react'
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'patternfly-react';
import {
  sprintf,
  translate as __
} from 'foremanReact/common/I18n';
import {Select, TextInput} from 'foremanReact/components/common/forms/Select';
import RailsData from '../common/RailsData';
import ScmTypeSelector from './components/ScmTypeSelector';
import FormTextInput from './components/FormTextInput'
import { arrayToObject } from '../../helper';
import CommonForm from 'foremanReact/components/common/forms/CommonForm';
import $ from 'jquery';

import {
  FormControl,
  inlineEditFormatterFactory,
} from 'patternfly-react';

class SyncGitRepo extends React.Component {
  constructor(props) {
    super(props);
  }

  validateParameters() {
    let result = true;
    let msg = "";

    if (this.props.path == '' && this.props.scmType == 'directory') {
      result = false;

      if (msg == "") {
        msg += __("Directory path cannot be blank");
      }
    }

    if (this.props.gitUrl == '' && this.props.scmType == 'git') {
      result = false;

      if (msg == "") {
        msg += __("Git URL cannot be blank");
      }
    }

    return {
      validateResult: result,
      validateMsg: msg
    }
  }

  componentDidMount() {
    const {
      data: {mode, scmType, path, gitCommit, gitUrl, appDefinitions},
      initSyncGitRepo,
      loadScmType,
      loadPath,
      loadGitCommit,
      loadGitUrl,
      handleGitRepoSync,
    } = this.props;

    if (mode === 'editInstance') {
      loadScmType(scmType);
      loadPath(path);
      loadGitCommit(gitCommit);
      loadGitUrl(gitUrl);
      handleGitRepoSync(this.props.scmType, this.props.path, this.props.gitCommit)
    }

    initSyncGitRepo(
      scmType,
      path,
      gitCommit,
      gitUrl,
    );
  };

  render() {
    const {
      data: {mode, scmTypes, organization, location, appDefinitions},
      scmType,
      path,
      gitCommit,
      gitUrl,
      loadScmType,
      loadPath,
      loadGitCommit,
      loadGitUrl,
      handleGitRepoSync,
    } = this.props;

    var url_validator = /^(ftp|http|https):\/\/[^ "]+$/;

    let { validateResult, validateMsg } = this.validateParameters();

    if (validateResult == false) {
      $('input[type="submit"][name="commit"]').attr("disabled", true);
    } else {
      $('input[type="submit"][name="commit"]').attr("disabled", false);
    }

    return (
      <span>
        <div>
          <ScmTypeSelector
            label="SCM Type"
            editable={ appDefinitions.length == 0 }
            viewText={ scmTypes[scmType] }
            options={ scmTypes }
            onChange={ loadScmType }
            selectValue={ scmType }
          />
          {(scmType === 'directory') ? (
          <FormTextInput
            label= 'Directory Path *'
            editable= { appDefinitions.length == 0 }
            viewText={ path }
            onChange={ loadPath }
            parameter="path"
          /> ) : null }
          {(scmType === 'git') ? (
          <FormTextInput
            label= 'Git Url *'
            editable= { appDefinitions.length == 0 }
            viewText={ gitUrl }
            onChange={ loadGitUrl }
            parameter="git_url"
          /> ) : null }
          {(!url_validator.test(gitUrl) && gitUrl)? (
          <div className="form-group">
            <div className="col-md-2"></div>
            <div className="col-md-4"><pre>{ __("Git URL is wrong") }</pre></div>
          </div>
        ) : (<div></div>)}
        {validateResult == false ? (
            <div className="form-group">
              <div className="col-md-2"></div>
              <div className="col-md-4"><pre>{validateMsg}</pre></div>
            </div>
        ) : (<div></div>)}
          {(scmType === "git") ? (
          <FormTextInput
            label="Git Branch/Commit/Tag"
            editable= { appDefinitions.length == 0 }
            viewText={ gitCommit }
            onChange={ loadGitCommit }
            parameter="git_commit"
          /> ) : null }
          {(scmType === "git") ? (
          <CommonForm>
          <span className="help-block help-inline">
          <Button
            bsStyle="default"
            onClick={ (e) => handleGitRepoSync(gitUrl, gitCommit, scmType, e) }
            >
            {__('Sync Repository')} </Button>
            </span>
            </CommonForm>
        ) : null }

        </div>
          </span>
        )};
}

SyncGitRepo.defaultProps = {
  error: {},
  scmType: "",
  path: "",
  gitCommit: "",
  gitUrl: "",

}

SyncGitRepo.propTypes = {
  initSyncGitRepo: PropTypes.func,
  loadScmType: PropTypes.func,
  loadGitCommit: PropTypes.func,
  loadPath: PropTypes.func,
  loadGitUrl: PropTypes.func,
  handleGitRepoSync: PropTypes.func,
  scmType: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  gitCommit: PropTypes.string,
  gitUrl: PropTypes.string,
};

export default SyncGitRepo;

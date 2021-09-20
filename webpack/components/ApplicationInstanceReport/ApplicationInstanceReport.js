import React, { useState } from 'react'
import PropTypes from 'prop-types';

import {
  Icon,
  Spinner,
} from 'patternfly-react';

import {
  VerticalTabs,
} from 'patternfly-react-extensions';

import {
  translate as __
} from 'foremanReact/common/I18n';

import PowerStatus from 'foremanReact/components/hosts/powerStatus';
import ReportViewer from './components/ReportViewer';

class ApplicationInstanceReport extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      data: { hosts, deploymentState, initialConfigureState, initialConfigureJobUrl },
      initApplicationInstanceReport,
      setActiveHost,
    } = this.props;

    initApplicationInstanceReport(hosts, deploymentState, initialConfigureState, initialConfigureJobUrl);
    this.reloadReportData();
  };

  reloadReportData() {
    const {
      data: { appInstanceId, reportDataUrl },
      deploymentState, initialConfigureState,
      loadReportData,
    } = this.props;

    // if both states are unknown, it means, that the component was just loaded. try again after a short timeout.
    if (deploymentState == 'unknown' && initialConfigureState == 'unknown') {
      setTimeout(() => {
        this.reloadReportData();
      }, 1000);

      return;
    }

    if ((deploymentState != 'new' && deploymentState != 'finished' && deploymentState != 'failed') ||
        (initialConfigureState == 'unconfigured' || initialConfigureState == 'scheduled' || initialConfigureState == 'pending')) {

      loadReportData(reportDataUrl, appInstanceId);

      setTimeout(() => {
        this.reloadReportData();
      }, 5000);
    }
  }

  isActive(id) {
    return (this.props.activeHostId === id);
  }

  collectLastReportData(hosts) {
    const {
      setActiveHost,
    } = this.props;

    const tabs = []
    for (const [index, value] of hosts.entries()) {
      tabs.push(
        <VerticalTabs.Tab
          id={index}
          key={"vt_tab_"+index}
          title={ value.name }
          wrapStyle='nowrap'
          onActivate={() => setActiveHost(index)}
          active={this.isActive(index)}
        />
      );
    }

    return tabs;
  }

  lastReportStatus(host) {
    if (!host['id']) {
      return (
        <div>
          <span>Host: { host['name'] }</span>
          <span>&nbsp;|&nbsp;</span>
          <span>State: { __('not build') }</span>
          <span>&nbsp;|&nbsp;</span>
          <span>Power Status: { __('unknown') }</span>
        </div>
      )
    } else {
      const already_deployed_msg = __("Already existing host which was added to the application instance");
      return (
        <div>
          <span>Host: <a href={ host['hostUrl'] }>{ host['name'] }</a></span>
          <span>&nbsp;|&nbsp;</span>
          <span>State: { host['build'] == true ? "in Build" : "Deployed" }</span>
          <span>&nbsp;|&nbsp;</span>
          <span>Power Status: <PowerStatus key={ "power_status_"+ host['id'] } id={ host['id'] } url={ host['powerStatusUrl'] } data={{ id: host['id'], url: host['powerStatusUrl'] }} /></span>
          {host['isExistingHost'] ? (
            <span>
              &nbsp;|&nbsp; Existing host &nbsp;
              <Icon style={{marginRight: 8, marginLeft: 2}} type="pf" name="info" title={already_deployed_msg} />
            </span>
          ) : (<span></span>)}
        </div>
      )
    }
  }

  render() {
    const {
      data: { appInstanceId, appInstanceName, deployTaskUrl, configureJobUrl, reportDataUrl },
      activeHostId, hosts,
      deploymentState,
      initialConfigureState, initialConfigureJobUrl, showInitialConfigureJob,
      loadReportData,
    } = this.props;

    let tabs = [];
    let reportStatus = undefined;
    let report = undefined;

    // This handles the first call to render() in which the state hosts is always empty
    if (hosts.length == 0) {
      return (<span>No host</span>);
    }

    tabs = this.collectLastReportData(hosts);
    reportStatus = this.lastReportStatus(hosts[activeHostId]);

    if (hosts[activeHostId]['progress_report']) {
      report = hosts[activeHostId]['progress_report'];
    }

    return (
      <span>
        <div className="deploy_status">
          <div>
            <div className="deploy_status_head">Host deployment state</div>
            <div className="deploy_status_content">
              { (deploymentState != 'new' && deploymentState != 'finished' && deploymentState != 'failed') ? (<span><Spinner loading size='sm' /> &nbsp;</span>) : (<span></span>) }
              { deploymentState }
            </div>
          </div>
          <div>
            <div className="deploy_status_head">Deployment task</div>
            <div className="deploy_status_content"><a href={ deployTaskUrl } >Last deployment task</a></div>
          </div>
          { (showInitialConfigureJob == true) ? (
          <div>
            <div className="deploy_status_head">Configuration job</div>
            <div className="deploy_status_content">
              { (initialConfigureState == 'scheduled' || initialConfigureState == 'pending') ? (<span><Spinner loading size='sm' /> &nbsp;</span>) : (<span></span>) }
              { (initialConfigureState != 'unconfigured' && initialConfigureState != 'scheduled') ? (<a href={ initialConfigureJobUrl }>Configuration job</a>) : (<span></span>) }
              { (initialConfigureState != 'unconfigured') ? (<span>&nbsp; State: { initialConfigureState }</span>) : (<span></span>) }
            </div>
          </div>
          ) : (
          <div>
            <div className="deploy_status_head">Configuration job</div>
            <div className="deploy_status_content"><a href={ configureJobUrl }>Configuration jobs</a></div>
          </div>
          ) }
        </div>
        <div className="deploy_report_hosts">
          Hosts
          <VerticalTabs id="vertical_tabs">
            {tabs}
          </VerticalTabs>
        </div>
        <div className="deploy_report_status">
          {reportStatus}
        </div>
        <div className="deploy_report_tasks">
          <ReportViewer report={report} />
        </div>
      </span>
    )};
}

ApplicationInstanceReport.defaultProps = {
  error: {},
  appInstanceName: '',
  deployTaskUrl: '',
  configureJobUrl: '',
  hosts: [],
  report: [],
  activeHostId: 0,
  deploymentState: 'unknown',
  initialConfigureState: 'unknown',
  initialConfigureJobUrl: '',
  showInitialConfigureJob: false,
}

ApplicationInstanceReport.propTypes = {
  initApplicationInstanceReport: PropTypes.func,
  appInstanceName: PropTypes.string,
  deployTaskUrl: PropTypes.string,
  configureJobUrl: PropTypes.string,
  deploymentState: PropTypes.string,
  initialConfigureState: PropTypes.string,
  initialConfigureJobUrl: PropTypes.string,
  showInitialConfigureJob: PropTypes.bool,
  hosts: PropTypes.array,
  deploymentState: PropTypes.string,
  report: PropTypes.array,
  setActiveHost: PropTypes.func,
  loadReportData: PropTypes.func,
  activeHostId: PropTypes.number,
};

export default ApplicationInstanceReport;

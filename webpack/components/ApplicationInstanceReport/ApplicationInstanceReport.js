import React, { useState } from 'react'
import PropTypes from 'prop-types';

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
      data: { hosts, mode },
      initApplicationInstanceReport,
      setActiveHost,
    } = this.props;

    initApplicationInstanceReport(hosts);
  };

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
      return (
        <div>
          <span>Host: <a href={ host['hostUrl'] }>{ host['name'] }</a></span>
          <span>&nbsp;|&nbsp;</span>
          <span>State: { host['build'] == true ? "in Build" : "Deployed" }</span>
          <span>&nbsp;|&nbsp;</span>
          <span>Power Status: <PowerStatus data={{ id: host['id'], url: host['powerStatusUrl'] }} /></span>
        </div>
      )
    }
  }

  render() {
    const {
      data: { hosts, mode, appInstanceName, deployTaskUrl, configureJobUrl },
      activeHostId,
    } = this.props;

    let tabs = [];
    let reportStatus = undefined;
    let report = undefined;

    tabs = this.collectLastReportData(hosts);
    reportStatus = this.lastReportStatus(hosts[activeHostId]);

    if (hosts[activeHostId]['progress_report']) {
      report = hosts[activeHostId]['progress_report'];
    }

    return (
      <span>
        <div className="deploy_status">
          <div>
            <div className="deploy_status_head">Deployment task</div>
            <div className="deploy_status_content"><a href={ deployTaskUrl } >Last deployment task</a></div>
          </div>
          <div>
            <div className="deploy_status_head">Configuration job</div>
            <div className="deploy_status_content"><a href={ configureJobUrl }>Configuration jobs</a></div>
          </div>
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
}

ApplicationInstanceReport.propTypes = {
  initApplicationInstanceReport: PropTypes.func,
  appInstanceName: PropTypes.string,
  deployTaskUrl: PropTypes.string,
  configureJobUrl: PropTypes.string,
  hosts: PropTypes.array,
  report: PropTypes.array,
  setActiveHost: PropTypes.func,
  activeHostId: PropTypes.number,

};

export default ApplicationInstanceReport;

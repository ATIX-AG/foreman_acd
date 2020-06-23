import React, { useState } from 'react'
import PropTypes from 'prop-types';

import {
  VerticalTabs,
} from 'patternfly-react-extensions';

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
      setActiveAndLoadLiveReport,
    } = this.props;

    initApplicationInstanceReport(hosts);

    if (mode == 'liveReport') {
      if (hosts.length > 0) {
        const index = 0;
        const url = `/api/v2/orchestration/${hosts[index].progress_report_id}/tasks`;
        setActiveAndLoadLiveReport(index, url);
      }
    }
  };

  isActive(id) {
    return (this.props.activeHostId === id);
  }

  collectLiveData(hosts) {
    const {
      setActiveAndLoadLiveReport,
    } = this.props;
    const tabs = []

    for (const [index, value] of hosts.entries()) {
      const url = `/api/v2/orchestration/${hosts[index].progress_report_id}/tasks`

      tabs.push(
        <VerticalTabs.Tab
          id={index}
          key={"vt_tab_"+index}
          title={ value.name }
          wrapStyle='nowrap'
          onActivate={() => setActiveAndLoadLiveReport(index, url)}
          active={this.isActive(index)}
        />
      );
    }

    return tabs;
  }

  collectLastReportData(hosts) {
    const {
      setActiveAndLoadLastReport,
    } = this.props;
    // FIXME
    const url = undefined;

    const tabs = []
    for (const [index, value] of hosts.entries()) {
      tabs.push(
        <VerticalTabs.Tab
          id={index}
          key={"vt_tab_"+index}
          title={ value.name }
          wrapStyle='nowrap'
          onActivate={() => setActiveAndLoadLastReport(index, url)}
          active={this.isActive(index)}
        />
      );
    }

    return tabs;
  }

  liveReportStatus(host) {
    return (
      <span>Host: <a href={ host['hostUrl'] }>{ host['hostname'] }</a></span>
    );
  }

  lastReportStatus(host) {
    return (
      <div>
        <span>Host: <a href={ host['hostUrl'] }>{ host['hostname'] }</a></span>
        <span>&nbsp;|&nbsp;</span>
        <span>Power Status: <PowerStatus data={{ id: host['id'], url: host['powerStatusUrl'] }} /></span>
      </div>
    )
  }

  render() {
    const {
      data: { hosts, mode },
      report,
      activeHostId,
    } = this.props;

    let tabs = [];
    let reportStatus = undefined;

    if (mode == 'liveReport') {
      tabs = this.collectLiveData(hosts);
      reportStatus = this.liveReportStatus(hosts[activeHostId])
    } else if (mode == 'lastReport') {
      tabs = this.collectLastReportData(hosts);
      reportStatus = this.lastReportStatus(hosts[activeHostId])
    }

    return (
      <span>
        <div className="deploy_report_hosts">
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
  hosts: [],
  report: [],
  activeHostId: 0,
}

ApplicationInstanceReport.propTypes = {
  initApplicationInstanceReport: PropTypes.func,
  hosts: PropTypes.array,
  report: PropTypes.array,
  setActiveAndLoadLiveReport: PropTypes.func,
  setActiveAndLoadLastReport: PropTypes.func,
  activeHostId: PropTypes.number,

};

export default ApplicationInstanceReport;

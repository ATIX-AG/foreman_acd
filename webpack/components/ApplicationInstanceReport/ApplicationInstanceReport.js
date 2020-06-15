import React, { useState } from 'react'
import PropTypes from 'prop-types';

import {
  VerticalTabs,
} from 'patternfly-react-extensions';

import ReportViewer from './components/ReportViewer';

class ApplicationInstanceReport extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      data: { hosts, },
      initApplicationInstanceReport,
      setActiveAndLoadReport,
    } = this.props;

    initApplicationInstanceReport(hosts);

    if (hosts.length > 0) {
      const index = 0;
      const url = `/api/v2/orchestration/${hosts[index].progress_report_id}/tasks`;
      setActiveAndLoadReport(index, url);
    }
  };

  isActive(id) {
    return (this.props.activeHostId === id);
  }

  collectLiveData(hosts) {
    const tabs = []
    for (const [index, value] of hosts.entries()) {
      const url = `/api/v2/orchestration/${hosts[index].progress_report_id}/tasks`

      tabs.push(
        <VerticalTabs.Tab
          id={index}
          key={"vt_tab_"+index}
          title={value.name}
          wrapStyle='nowrap'
          onActivate={() => setActiveAndLoadReport(index, url)}
          active={this.isActive(index)}
        />
      );
    }

    return tabs;
  }

  collectLastReportData(hosts) {
    return "hallo";
  }

  render() {
    const {
      data: { hosts, mode },
      setActiveAndLoadReport,
      report,
    } = this.props;

    let tabs = [];

    if (mode == 'liveReport') {
      tabs = this.collectLiveData(hosts);
    } else if (mode == 'lastReport') {
      tabs = this.collectLastReportData(hosts);
    }

    return (
      <span>
        <div className="deploy_report_hosts">
          <VerticalTabs id="vertical_tabs">
            {tabs}
          </VerticalTabs>
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
  activeHostId: -1,
}

ApplicationInstanceReport.propTypes = {
  initApplicationInstanceReport: PropTypes.func,
  hosts: PropTypes.array,
  report: PropTypes.array,
  setActiveAndLoadReport: PropTypes.func,
  activeHostId: PropTypes.number,

};

export default ApplicationInstanceReport;

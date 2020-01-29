import React from 'react';
import PropTypes from 'prop-types';

const ReportViewer= ({
  hidden,
  report,
}) =>{
  if (hidden) {
    return null;
  }

  if (report === undefined) {
    return null;
  }

  return report.map((task, id) => (
    <span key={"report_task_"+id} className="report_task">{task.name}</span>
  ));
};

ReportViewer.propTypes = {
  hidden: PropTypes.bool,
  report: PropTypes.array,
};

export default ReportViewer;

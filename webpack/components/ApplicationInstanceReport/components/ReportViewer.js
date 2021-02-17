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
    <div key={"report_task_"+id} className="report_task">{task.name} -- {task.status}</div>
  ));
};

ReportViewer.propTypes = {
  hidden: PropTypes.bool,
  report: PropTypes.array,
};

export default ReportViewer;

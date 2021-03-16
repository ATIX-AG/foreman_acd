import React from 'react';
import PropTypes from 'prop-types';
import ExtSelect from '../../common/ExtSelect';
import RailsData from '../../common/RailsData'

const ScmTypeSelector= ({
  label,
  hidden,
  editable,
  viewText,
  selectValue,
  onChange,
  options,
}) =>{
  return (
    <div className="form-group">
      <label className="col-md-2 control-label">{label}</label>
      <div className="col-md-4">
        <ExtSelect
          editable={ editable }
          viewText={viewText}
          selectValue={selectValue}
          onChange={onChange}
          options={options}
        />
        <RailsData
          key='ansible_playbook_id'
          view='ansible_playbook'
          parameter='scm_type'
          value={selectValue}
        />
      </div>
    </div>
  );
};

ScmTypeSelector.propTypes = {
  label: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  viewText: PropTypes.string,
  selectValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object,
};

export default ScmTypeSelector;

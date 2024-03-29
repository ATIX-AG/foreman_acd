import React from 'react';
import PropTypes from 'prop-types';
import ExtSelect from '../../common/ExtSelect';
import RailsData from '../../common/RailsData'

const AnsiblePlaybookSelector= ({
  label,
  hidden,
  editable,
  viewText,
  selectValue,
  onChange,
  options,
  additionalData,
}) =>{
  return (
    <div className="form-group">
      <label className="col-md-2 control-label">{label}</label>
      <div className="col-md-4">
        <ExtSelect
          hidden={hidden}
          editable={editable}
          viewText={viewText}
          selectValue={selectValue}
          onChange={onChange}
          options={options}
          additionalData={additionalData}
        />
        <RailsData
          key='ansible_playbook_data'
          view='app_definition'
          parameter='acd_ansible_playbook_id'
          value={selectValue}
        />
      </div>
    </div>
  );
};

AnsiblePlaybookSelector.propTypes = {
  label: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  viewText: PropTypes.string,
  selectValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  additionalData: PropTypes.object,
};

export default AnsiblePlaybookSelector;

import React from 'react';
import PropTypes from 'prop-types';
import ExtTextInput from '../../common/ExtTextInput';
import RailsData from '../../common/RailsData'

const FormTextInput= ({
  label,
  hidden,
  editable,
  viewText,
  onChange,
  parameter,
}) =>{
  return (
    <div >
      <div  >
        <ExtTextInput
          label={label}
          editable={editable}
          viewText={viewText}
          onChange={onChange}
        />
        <RailsData
          key='ansible_playbook_id'
          view='ansible_playbook'
          parameter={parameter}
          value={viewText}
        />
      </div>
    </div>
  );
};

FormTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  viewText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  parameter: PropTypes.string,
};

export default FormTextInput;

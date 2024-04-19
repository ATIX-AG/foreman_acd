import React from 'react';
import PropTypes from 'prop-types';
import ExtTextInput from '../../common/ExtTextInput';
import RailsData from '../../common/RailsData';

const FormTextInput = ({
  label,
  hidden,
  editable,
  viewText,
  onChange,
  parameter,
}) => (
  <div>
    <div>
      <ExtTextInput
        hidden={false}
        label={label}
        editable={editable}
        viewText={viewText}
        onChange={onChange}
      />
      <RailsData
        key="ansible_playbook_form_data"
        view="ansible_playbook"
        parameter={parameter}
        value={viewText}
      />
    </div>
  </div>
);

FormTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  editable: PropTypes.bool.isRequired,
  viewText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  parameter: PropTypes.string,
};
FormTextInput.defaultProps = {
  hidden: false,
  viewText: '',
  parameter: '',
};

export default FormTextInput;

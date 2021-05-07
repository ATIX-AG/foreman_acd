import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'foremanReact/components/common/forms/TextInput';

const ExtTextInput= ({
  hidden,
  editable,
  viewText,
  label,
  onChange,
  additionalData,
}) =>{
  if (hidden) {
    return null;
  }

  if (!editable) {
    return (
      <div className="form-group">
       <label className="col-md-2 control-label">{label}</label>
       <div className="col-md-4">{viewText}</div>
      </div>
    );
  }

  return (
    <TextInput
       label={label}
       value={viewText}
       onChange={e => onChange(e.target.value, additionalData) }
    />
  );
};

ExtTextInput.propTypes = {
  hidden: PropTypes.bool.isRequired,
  editable: PropTypes.bool.isRequired,
  viewText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  additionalData: PropTypes.object,
};

export default ExtTextInput;

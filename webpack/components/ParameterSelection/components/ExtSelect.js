import React from 'react';
import PropTypes from 'prop-types';
import Select from 'foremanReact/components/common/forms/Select';

const ExtSelect= ({
  hidden,
  editable,
  viewText,
  selectValue,
  onChange,
  options,
  additionalData,
}) =>{
  if (hidden) {
    return null;
  }

  if (!editable) {
    return (
     <div>{viewText}</div>
    );
  }

  return (
    <Select
       value={selectValue}
       onChange={e => onChange(e.target.value, additionalData) }
       options={options}
    />
  );
};

ExtSelect.propTypes = {
  hidden: PropTypes.bool.isRequired,
  editable: PropTypes.bool.isRequired,
  viewText: PropTypes.string,
  selectValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  additionalData: PropTypes.object,
};

export default ExtSelect;

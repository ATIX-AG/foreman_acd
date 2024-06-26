import React from 'react';
import PropTypes from 'prop-types';
import ExtSelect from '../../common/ExtSelect';
import RailsData from '../../common/RailsData';

const ServiceSelector = ({
  label,
  hidden,
  viewText,
  selectValue,
  onChange,
  options,
  additionalData,
}) => (
  <div className="form-group">
    <label className="col-md-2 control-label">{label}</label>
    <div className="col-md-4">
      <ExtSelect
        hidden={hidden}
        editable
        viewText={viewText}
        selectValue={selectValue}
        onChange={onChange}
        options={options}
        additionalData={additionalData}
      />
      <RailsData
        key="service_id"
        view="existing_host_selection"
        parameter="service_id"
        value={selectValue}
      />
    </div>
  </div>
);

ServiceSelector.propTypes = {
  hidden: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  viewText: PropTypes.string,
  selectValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  additionalData: PropTypes.object,
};

ServiceSelector.defaultProps = {
  additionalData: {},
  options: {},
  selectValue: '',
  viewText: undefined,
};

export default ServiceSelector;

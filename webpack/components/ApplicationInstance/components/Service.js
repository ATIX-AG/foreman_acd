import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

const Service = ({ name, currentCount, minCount, maxCount }) => (
  <div>
    <label>{name}:</label> {currentCount} ({__('Min/Max')}: {minCount}/
    {maxCount})
  </div>
);

Service.propTypes = {
  name: PropTypes.string.isRequired,
  minCount: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  currentCount: PropTypes.number.isRequired,
};

export default Service;

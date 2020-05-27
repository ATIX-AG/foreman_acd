import React from 'react';
import PropTypes from 'prop-types';

const Service= ({
  label,
  currentCount,
  maxCount,
}) =>{
  return (
    <div>
      <label>{label}</label>{currentCount} (Max: {maxCount})
    </div>
  );
};

Service.propTypes = {
  label: PropTypes.string.isRequired,
  maxCount: PropTypes.number.isRequired,
  currentCount: PropTypes.number.isRequired,
};

export default Service;

import React from 'react';
import PropTypes from 'prop-types';

const Service= ({
  name,
  currentCount,
  minCount,
  maxCount,
}) =>{
  return (
    <div>
      <label>{name}:</label> {currentCount} ({__("Min/Max")}: {minCount}/{maxCount})
    </div>
  );
};

Service.defaultProps = {
  minCount: 0,
  maxCount: 0,
  currentCount: 0,
};

Service.propTypes = {
  name: PropTypes.string.isRequired,
  minCount: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  currentCount: PropTypes.number.isRequired,
};

export default Service;

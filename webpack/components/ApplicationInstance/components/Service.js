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
      <label>{name}:</label> {currentCount} (Min/Max: {minCount}/{maxCount})
    </div>
  );
};

Service.propTypes = {
  name: PropTypes.string.isRequired,
  minCount: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  currentCount: PropTypes.number.isRequired,
};

export default Service;

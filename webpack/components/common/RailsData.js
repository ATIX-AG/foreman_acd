import React from 'react';
import PropTypes from 'prop-types';

const RailsData = ({
  view,
  parameter,
  value,
}) => {
  const id = "foreman_acd_"+ view +"_"+ parameter;
  const name = "foreman_acd_"+ view +"["+ parameter +"]";

  return (
    <input
      id={id}
      name={name}
      value={value}
      type="hidden"
    />
  );
}

RailsData.propTypes = {
  view: PropTypes.string.isRequired,
  parameter: PropTypes.string.isRequired,
};

export default RailsData;

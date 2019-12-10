import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'patternfly-react';

const AddParameter = ({
  hidden,
  disabled,
  onAddParameter,
}) =>{
  if (hidden) {
    return null;
  }

  return (
    <Button bsStyle="default" disabled={disabled} onClick={onAddParameter}>
      <Icon type="fa" name="plus" />
    </Button>
  );
};

AddParameter.propTypes = {
  hidden: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onAddParameter: PropTypes.func.isRequired
};

export default AddParameter;

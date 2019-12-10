import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'patternfly-react';

const DeleteParameter = ({
  hidden,
  disabled,
  onDeleteParameter,
  additionalData,
}) =>{
  if (hidden) {
    return null;
  }

  return (
    <span>
      &nbsp;
      <Button
        bsStyle="default"
        disabled={disabled}
        onClick={() => window.confirm("Are you sure you wish to delete this item?") && onDeleteParameter(additionalData) }
      >
        <Icon type="pf" name="delete" />
      </Button>
    </span>
  );
};

DeleteParameter.propTypes = {
  hidden: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onDeleteParameter: PropTypes.func.isRequired,
  additionalData: PropTypes.object.isRequired,
};

export default DeleteParameter;

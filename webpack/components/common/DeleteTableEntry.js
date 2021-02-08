import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';

const DeleteTableEntry = ({
  hidden,
  disabled,
  onDeleteTableEntry,
  additionalData,
}) =>{
  if (hidden) {
    return null;
  }

  return (
    <span>
      <Button
        bsStyle="default"
        disabled={disabled}
        onClick={() => window.confirm(__("Are you sure you wish to delete this item?")) && onDeleteTableEntry(additionalData) }
      >
        <Icon type="pf" name="delete" title={__("Delete entry")} />
      </Button>
    </span>
  );
};

DeleteTableEntry.propTypes = {
  hidden: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onDeleteTableEntry: PropTypes.func.isRequired,
  additionalData: PropTypes.object.isRequired,
};

export default DeleteTableEntry;

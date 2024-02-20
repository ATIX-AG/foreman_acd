import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';

const EditTableEntry = ({
  hidden,
  disabled,
  handleLocking,
  onEditTableEntry,
  additionalData,
}) => {
  if (hidden) {
    return null;
  }

  let title = 'edit this entry';

  if (handleLocking === true) {
    if (additionalData.rowData.locked === true) {
      disabled = true;
      title = 'This entry is locked and can not be changed.';
    }
  }

  return (
    <span>
      <Button
        bsStyle="default"
        disabled={disabled}
        onClick={() => onEditTableEntry(additionalData)}
      >
        <Icon type="pf" name="edit" title={__(title)} />
      </Button>
    </span>
  );
};

EditTableEntry.propTypes = {
  hidden: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  handleLocking: PropTypes.bool.isRequired,
  onEditTableEntry: PropTypes.func.isRequired,
  additionalData: PropTypes.object.isRequired,
};

export default EditTableEntry;

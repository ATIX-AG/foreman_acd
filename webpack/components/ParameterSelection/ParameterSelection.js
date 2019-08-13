import React from 'react';
import JSONTree from 'react-json-tree';
import PropTypes from 'prop-types';

const theme = {
  scheme: 'foreman',
  backgroundColor: 'rgba(0, 0, 0, 255)',
  base00: 'rgba(0, 0, 0, 0)',
};

class ParameterSelection extends React.Component {
  componentDidMount() {
    const {
    } = this.props.data;
  }

  render() {
    const {
      loading,
      simple,
      loadIt,
      unloadIt,
    } = this.props;

    return(
      <div className="parameter-selection">
        <button onClick={loadIt}>Loading</button>
        <button onClick={unloadIt}>Unloading</button>
        <span>MOTD is {simple}</span>
        <br />
        { loading ? <span>Loading aktiv</span> : <span>Loading inaktiv</span>}
      </div>
    );
  }
}

ParameterSelection.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ParameterSelection;

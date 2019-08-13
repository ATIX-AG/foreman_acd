import api from 'foremanReact/API';
import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

export const loadIt = () => dispatch => {
  dispatch({
    type: 'LOADIT',
    payload: { x: 'load it now' },
  });
};

export const unloadIt = () => dispatch => {
  dispatch({
    type: 'UNLOAD',
    payload: { x: 'UN load it now' },
  });
};

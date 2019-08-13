import Immutable from 'seamless-immutable';

export const initialState = Immutable({
  loading: false,
  simple: "Hallo Welt",
});

const parameterSelectionParameters = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case 'LOADIT':
      return state.merge({
        loading: true,
        simple: "Wasn los?"
      })
    case 'UNLOAD':
      return state.merge({
        loading: false,
        simple: "unloaded"
      })
    default:
      return state;
  }
};

export default parameterSelectionParameters;

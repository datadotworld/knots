import {
  UPDATE_TAPS,
  TAPS_LOADING,
  UPDATE_TAP_FIELDS,
  SET_TAP_FIELDS,
  DISCOVER_SCHEMA,
  SCHEMA_RECEIVED
} from '../actions/connect';

import { UPDATE_SCHEMA, SCHEMA_LOADING } from '../actions/schema';

export type tapsStateType = {
  +loading: boolean,
  +taps: Array<string>,
  +dockerInstalled: boolean,
  +dockerVersion: string,
  +tapFields: Array<{}>,
  +fieldValues: {},
  +tapSchema: [],
  +liveLogs: string
};

const defaultState = {
  loading: false,
  taps: [],
  dockerVersion: '',
  tapFields: [],
  fieldValues: {},
  tapSchema: [],
  liveLogs: ''
};

export default function taps(state = defaultState, action) {
  const fields = state.tapFields;
  const values = state.fieldValues;
  const schema = state.tapSchema;
  switch (action.type) {
    case TAPS_LOADING:
      return Object.assign({}, state, { loading: false });
    case UPDATE_TAPS:
      return Object.assign({}, state, { taps: action.taps, loading: false });
    case SCHEMA_LOADING:
      return Object.assign({}, state, { loading: true });
    case DISCOVER_SCHEMA:
      return Object.assign({}, state, {
        loading: true,
        liveLogs: action.liveLogs,
        tapSchema: action.schema
      });
    case UPDATE_TAP_FIELDS:
      return Object.assign({}, state, {
        taps: action.taps,
        loading: false,
        dockerVersion: action.dockerVersion,
        tapFields: action.tapFields
      });
    case SET_TAP_FIELDS:
      fields[action.index].value = action.value;
      values[action.key] = action.value;

      return Object.assign({}, state, {
        tapFields: fields,
        fieldValues: values
      });
    case SCHEMA_RECEIVED:
      return Object.assign({}, state, {
        tapSchema: action.schema,
        loading: false
      });
    case UPDATE_SCHEMA:
      if (schema[action.index]) {
        switch (action.field) {
          case 'selected':
            schema[action.index].metadata[0].metadata[action.field] =
              action.value;

            return Object.assign({}, state, {
              tapSchema: schema
            });
          case 'replication_key':
            schema[action.index].replication_key = action.value;

            return Object.assign({}, state, {
              tapSchema: schema
            });
          default:
            return state;
        }
      }
      return state;
    case 'persist/REHYDRATE':
      return { ...state };
    default:
      return state;
  }
}

import { queryTodos, removeTodo, updateTodo, toggleTodo, archiveTodo } from '@/services/api';

export default {
  namespace: 'todos',

  state: {
    list: [],
    filters: {
      done: false,
      archived: false,
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const filters = payload;
      const response = yield call(queryTodos, { ...payload });
      yield put({
        type: 'save',
        payload: {
          list: Array.isArray(response.list) ? response.list : [],
          filters,
        }
      });
      if (callback) callback();
    },
    *remove({ payload }, { call, put }) {
      const id = payload;
      const response = yield call(removeTodo, payload);
      yield put({
        type: 'pop',
        payload: {
          id,
          response,
        }
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateTodo, payload);
      yield put({
        type: 'save',
        payload: response.list,
      });
    },
    *toggle({ payload, callback }, { call, put }) {
      const id = payload;
      yield put({
        type: 'toggleCheckbox',
        payload: {
          id,
        },
      });
      const response = yield call(toggleTodo, id);
      if (!response.error && callback) callback();
    },
    *archive({ payload, callback }, { call, put }) {
      const id = payload;
      yield put({
        type: 'archiveTodo',
        payload: {
          id,
        },
      });
      const response = yield call(archiveTodo, payload);
      if (!response.error && callback) callback();
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        list: payload.list,
        filters: payload.filters,
      };
    },
    toggleCheckbox(state, { payload }) {
      let todos = state.list.map(todo => {
        if (todo.id === payload.id) {
          Object.assign(todo, {
            done: !todo.done,
          });
        }
        return todo;
      });
      return {
        ...state,
        list: todos,
      };
    },
    archiveTodo(state, { payload }) {
      let todos = state.list.map(todo => {
        if (todo.id === payload.id) {
          Object.assign(todo, {
            archive: !todo.archive,
          });
        }
        return todo;
      });
      return {
        ...state,
        list: todos,
      };
    },
    pop(state, { payload }) {
      let todos = state.list.filter(todo => payload.id.indexOf(todo.id) === -1);
      return {
        ...state,
        list: todos,
      }
    },
    clear() {
      return {
        list: [],
        filters: {
          done: false,
          archived: false,
        },
      };
    },
  },
};

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { doGetTask } from 'app/services/taskApi';
import { AxiosResponse } from 'axios';
import { State } from '../rootReducer';

type getTasksProps = {
  route: string;
  token: string;
};

export type Task = {
  description: string;
  detail: string;
  id: string;
};

export const getTasks = createAsyncThunk(
  'taskUser/getTasks',
  async (requisitionParams: getTasksProps) => {
    const { route, token } = requisitionParams;
    const response = await doGetTask(route, token);
    return response as AxiosResponse;
  }
);

const tasksAdapter = createEntityAdapter<Task>({
  selectId: (task) => task.id,
});

const initialState = {
  adapter: tasksAdapter.getInitialState(),
  loading: false,
};

const taskUserSlice = createSlice({
  name: 'taskUser',
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getTasks.fulfilled, (state, { payload }) => {
      tasksAdapter.setAll(state.adapter, payload.data?.data);
      state.loading = false;
      return state;
    });
    addCase(getTasks.pending, (state, { payload }) => {
      state.loading = true;
      return state;
    });
  },
});

export default taskUserSlice.reducer;
export const tasksSelector = (state: State) => state.tasks.adapter;
export const loadingSelector = (state: State) => state.tasks.loading;
export const { selectAll, selectById } = tasksAdapter.getSelectors(tasksSelector);

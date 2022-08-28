import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { doGet } from 'app/services/taskApi';
import doPost from 'app/services/userApi';
import { userProps } from 'app/services/userApi';
import { string } from 'prop-types';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6ImZlYTlkMTBmLTdiNmYtNDljYS04ZTVhLTA1MzhjNjQyOGNiMiIsInVzZXJOYW1lIjoiZGlvZ28xMjM0NUBnbWFpbC5jb20ifSwiaWF0IjoxNjYxNTYwODgxLCJleHAiOjE2NjE1NjQ0ODF9.dIUqFHg4Uu3vfPaMaGxBmOvHVlYn8nmzlAP0edKcJGA';

type getTasksProps = {
  route: string;
  token: string;
};

type postTasksProps = {
  route: string;
  body: any;
};

export const getTasks = createAsyncThunk(
  'taskUser/getTasks',
  async (requisitionParams: getTasksProps) => {
    const { route, token } = requisitionParams;
    const response = await doGet(route, token);
    return response as getTaskResponse;
  }
);

export const postTasks = createAsyncThunk(
  'taskUser/postTasks',
  async (requisitionParams: postTasksProps, { dispatch }) => {
    const { route, body } = requisitionParams;
    const response = await doPost(route, body);
    return response;
  }
);

type getTaskResponse = {
  ok: boolean;
  data: [];
};

const initialState: getTaskResponse = {
  ok: false,
  data: [],
};

const taskUserSlice = createSlice({
  name: 'taskUser',
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getTasks.fulfilled, (state, { payload }) => payload);
    addCase(postTasks.fulfilled, (state) => {
      const getParams = {
        route: 'task/readTaskByUserId',
        token,
      };

      getTasks(getParams);
    });
  },
});

export default taskUserSlice.reducer;

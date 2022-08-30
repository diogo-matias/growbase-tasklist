/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import settingsConfig from 'app/configs/settingsConfig';
import doPostUser from 'app/services/userApi';
import jwtService from '../auth/services/jwtService';
import { Navigate } from 'react-router-dom';

export const setUser = createAsyncThunk('user/setUser', async (user, { dispatch, getState }) => {
  /*
    You can redirect the logged-in user to a specific route depending on his role
    */
  if (user.loginRedirectUrl) {
    settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
  }

  return user;
});

export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  'user/updateShortucts',
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: '/',
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  jwtService
    .updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: 'User data saved with api' }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

export const loginUser = createAsyncThunk('user/loginUser', async (value, {dispatch, rejectWithValue}) => {
  const { route, data } = value;


 const response = await doPostUser(route, data);

  if (response.data.ok) {
    
    history.push({
      pathname: '/tasks',
    });
    return response
  }

  return rejectWithValue(response)

});

const initialState = {
  role: [], // guest
  data: {
    displayName: 'displayName',
    photoURL: 'assets/images/avatars/brian-hughes.jpg',
    email: 'johndoe@withinpixels.com',
    shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
  },
  api: {},
  ok: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedOut: (state, action) => {
      return initialState
    },
    setRole: (state, { payload }) => {
      state.role.push(payload);
      return state;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(updateUserSettings.fulfilled, (state, action) => action.payload);
    addCase(updateUserShortcuts.fulfilled, (state, action) => action.payload);
    addCase(loginUser.fulfilled, (state, { payload }) => {
      const name = payload.data.data.userName.split('@', 1)[0]
      state.api = payload.data;
      state.data.photoURL = `https://robohash.org/${name}?set=set4`
      state.role = 'admin';
      state.ok = true
      state.data.email = payload.data.data.userName
      state.data.displayName = name
    });
    addCase(loginUser.rejected, (state, { error }) => {
      state.api = error
      state.ok = false
    });
  },
});

export const { userLoggedOut, setRole, } = userSlice.actions;

export const selectUser = ({ user }) => user;
export const selectApi = ({ user }) => user.api;
export const selectToken = ({ user }) => user.api.data.token;
export const selectOk = ({ user }) => user.ok;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;

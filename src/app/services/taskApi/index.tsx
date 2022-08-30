import Axios from 'axios';

export type postProps = {
  description: string;
  detail: string;
  token: string;
};

export type putProps = {
  id: string;
  description: string;
  detail: string;
  token: string;
};

const api = Axios.create({
  baseURL: 'https://api-tasks-list.herokuapp.com/',
});

export async function doPost(route: string, body: postProps) {
  try {
    const response = api.post(route, body);
    return response;
  } catch (err) {
    return err;
  }
}

export async function doGetTask(route: string, token: string) {
  try {
    const response = api.get(`${route}?token=${token}`);
    return response;
  } catch (err) {
    return err;
  }
}

export async function doDeleteTask(route: string, token: string, id: string) {
  try {
    const response = api.delete(`${route}/${id}?token=${token}`);
    return response;
  } catch (err) {
    return err;
  }
}

export async function doPutTask(route: string, body: putProps) {
  try {
    const response = api.put(route, body);
    return response;
  } catch (err) {
    return err;
  }
}

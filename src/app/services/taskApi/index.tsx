import Axios, { AxiosResponse } from 'axios';

export type postProps = {
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
    console.log('error api tasks', err);
    return err;
  }
}

export async function doGet(route: string, token: string) {
  try {
    const response = api.get(`${route}?token=${token}`);
    return response;
  } catch (err) {
    return err;
  }
}

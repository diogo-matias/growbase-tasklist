import Axios, { AxiosResponse } from 'axios';

export type userProps = {
  name: string;
  pass: string;
  Rpass?: string;
};

const api = Axios.create({
  baseURL: 'https://api-tasks-list.herokuapp.com/',
});

export default async function doPost(route: string, data: userProps) {
  try {
    const response = api.post(route, data);
    return response;
  } catch (err) {
    console.log('error api', err);
    return err;
  }
}

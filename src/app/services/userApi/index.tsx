import Axios from 'axios';

export type userProps = {
  name: string;
  pass: string;
  Rpass?: string;
};

const api = Axios.create({
  baseURL: 'https://api-tasks-list.herokuapp.com/',
});

export default async function doPostUser(route: string, data: userProps) {
  try {
    const response = api.post(route, data);
    return response;
  } catch (err) {
    return err;
  }
}

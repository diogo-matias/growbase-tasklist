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
    const response = await api.post(route, data);
    
    return response;
  } catch (err: any) {
    return Promise.reject(new Error(err.response.data.error))
  }
}

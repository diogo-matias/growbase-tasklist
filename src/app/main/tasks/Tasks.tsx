import { useSelect } from '@mui/base';
import doPost from 'app/services/userApi';
import { getTasks, postTasks } from 'app/store/tasks/taskUserSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Axios from 'axios';

export default function Tasks() {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6ImZlYTlkMTBmLTdiNmYtNDljYS04ZTVhLTA1MzhjNjQyOGNiMiIsInVzZXJOYW1lIjoiZGlvZ28xMjM0NUBnbWFpbC5jb20ifSwiaWF0IjoxNjYxNTYwODgxLCJleHAiOjE2NjE1NjQ0ODF9.dIUqFHg4Uu3vfPaMaGxBmOvHVlYn8nmzlAP0edKcJGA';
  const dispatch = useDispatch<any>();
  const tasksRedux = useSelector((state: any) => state.tasks);

  useEffect(() => {
    console.log(tasksRedux);
  }, [tasksRedux]);

  async function handleClick() {
    const requisitonParams = {
      route: 'task/readTasksByUserId',
      token,
    };

    dispatch(getTasks(requisitonParams));
  }

  async function handleAddTask() {
    const postParams = {
      route: 'task',
      body: {
        description: 'Estudar algo',
        detail: 'rapido',
        token,
      },
    };

    await dispatch(postTasks(postParams));
    handleClick();
  }

  return (
    <>
      <h1>Deu bom dmais</h1>
      <label htmlFor="">Description</label>
      <input type="text" />

      <button onClick={handleClick}>testar api</button>
      <button onClick={handleAddTask}>ADD TASK TEST</button>
    </>
  );
}

import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  AlertColor,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  CircularProgress,
  Stack,
} from '@mui/material';
import { doDeleteTask, doPost, doPutTask } from 'app/services/taskApi';
import { State } from 'app/store/rootReducer';
import { getTasks, loadingSelector, selectAll, selectById } from 'app/store/tasks/taskSlice';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectToken } from 'app/store/userSlice';
import CustomSnackbar from '../../../theme-layouts/shared-components/task/Snackbar';

type TaskType = {
  description: string;
  detail: string;
  id: string;
};

export default function Content() {
  const token: string = useSelector(selectToken);
  const loading: boolean = useSelector(loadingSelector);
  const dispatch = useDispatch<any>();
  const tasksRedux = useSelector(selectAll);
  const [currentId, setCurrentId] = useState<string>('');
  const currentSelectedTask = useSelector((state: State) => selectById(state, currentId));
  const [editDescription, setEditDescription] = useState<string>('');
  const [editDetail, setEditDetail] = useState<string>('');

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('Sucesso');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const [description, setDescription] = useState('');
  const [detail, setDetail] = useState('');
  const [openModal, setOpenModal] = useState<boolean>(false);

  const style = {
    position: 'absolute' as const,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,

    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  useEffect(() => {
    handleGetTasks();
  }, []);

  useEffect(() => {
    if (currentSelectedTask) {
      setEditDescription(currentSelectedTask?.description);
      setEditDetail(currentSelectedTask?.detail);
    }
  }, [currentSelectedTask]);

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  async function handleGetTasks() {
    const requisitonParams = {
      route: 'task/readTasksByUserId',
      token,
    };

    dispatch(getTasks(requisitonParams));
  }

  async function handleAddTask() {
    const body = {
      description,
      detail,
      token,
    };

    try {
      await doPost('task', body);
      setOpenSnackbar(true);
      setSnackbarMessage('Tarefa acionada com sucesso');
      setSeverity('success');
    } catch (err: any) {
      console.log(err?.response.data.error);
      setOpenSnackbar(true);
      setSnackbarMessage(err?.response.data.error);
      setSeverity('error');
    }
    handleGetTasks();
  }

  async function handleDeleteTask(e: React.MouseEvent) {
    const { id } = e.target as HTMLButtonElement;

    try {
      await doDeleteTask('task', token, id);
      setOpenSnackbar(true);
      setSnackbarMessage('Deletado');
      setSeverity('error');
    } catch (err: any) {
      setOpenSnackbar(true);
      setSnackbarMessage(err?.response.data.error);
      setSeverity('error');
    }

    handleGetTasks();
  }

  async function handleEditTask(e: React.MouseEvent) {
    const { id } = e.target as HTMLButtonElement;
    setCurrentId(id);

    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  async function handleEditModal() {
    const body = {
      id: currentId,
      description: editDescription,
      detail: editDetail,
      token,
    };

    try {
      await doPutTask('task', body);
      setOpenSnackbar(true);
      setSnackbarMessage('Tarefa editada com sucesso');
      setSeverity('success');
    } catch (err: any) {
      setOpenSnackbar(true);
      setSnackbarMessage(err?.response.data.error);
      setSeverity('error');
    }

    setOpenModal(false);
    handleGetTasks();
  }

  return (
    <Box>
      <Grid container spacing={2} marginTop={2} sx={{ paddingX: 10 }}>
        <Grid item xs={12}>
          <Typography variant="h3" fontWeight="bold">
            Recados
          </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="descri????o"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            fullWidth
            label="detalhamento"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            type="button"
            onClick={handleAddTask}
            fullWidth
            variant="contained"
            color="primary"
          >
            Adicionar
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Stack
          sx={{
            color: 'grey.500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}
          spacing={2}
          direction="row"
        >
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <Table sx={{ marginTop: 5 }} stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'red' }}>
              <TableCell align="center">Descri????o</TableCell>
              <TableCell align="center">Detalhamento</TableCell>
              <TableCell align="center">A????es</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksRedux.map((task: any) => {
              return (
                <TableRow>
                  <TableCell align="center">{task.description}</TableCell>
                  <TableCell align="center">{task.detail}</TableCell>
                  <TableCell sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      id={task.id}
                      onClick={handleEditTask}
                      variant="contained"
                      color="primary"
                    >
                      Editar
                    </Button>
                    <Button
                      id={task.id}
                      onClick={handleDeleteTask}
                      variant="contained"
                      color="secondary"
                    >
                      Apagar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <CustomSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        message={snackbarMessage}
        severity={severity}
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editar Tarefa
            </Typography>
            <Typography sx={{ cursor: 'pointer' }} onClick={handleCloseModal}>
              X
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ mt: 2 }}>Descri????o</Typography>
            <TextField
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              fullWidth
            />
          </Box>
          <Box>
            <Typography sx={{ mt: 2 }}>Detalhe</Typography>
            <TextField
              value={editDetail}
              onChange={(e) => setEditDetail(e.target.value)}
              fullWidth
            />
          </Box>
          <Button onClick={handleEditModal} variant="contained" fullWidth color="secondary">
            Salvar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

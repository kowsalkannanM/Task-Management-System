import { Router, Express } from 'express';
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskById
} from '../controllers/taskController';
import { getTaskHistory } from '../controllers/taskHistoryController';

const router = Router();

const routes = (app: Express) => {

 // tasks
  router.post('/create-task', createTask);
  router.patch('/task/:id', updateTask);
  router.delete('/task/:id', deleteTask);
  router.get('/tasks', getTasks);
  router.get('/task/:id', getTaskById);

  //task history
  router.get('/task-history/:id', getTaskHistory);
  
  app.use(router);
};

export default routes;

import request from 'supertest';
import app from '../src/index';
import Task from '../src/models/tasks';

jest.mock('../src/models/tasks');

describe('POST /create-task', () => {
  it('should create a new task and return it', async () => {
    const newTask = {
      title: 'New Task',
      description: 'Task description',
      status: 'Pending',
      due_date: new Date().toISOString(),
      priority: 'Medium',
    };

    (Task.create as jest.Mock).mockResolvedValue(newTask);

    const response = await request(app).post('/create-task').send({
      title: 'New Task',
      description: 'Task description',
      status: 'Pending',
      due_date: new Date().toISOString(),
      priority: 'Medium',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      statusCode: 201,
      status: true,
      message: 'Task created successfully',
      data: {
        ...newTask,
        due_date: newTask.due_date,
      },
    });
  });

  it('should handle validation errors and return 400 status code', async () => {
    const response = await request(app).post('/create-task').send({ title: 'Task' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      statusCode: 400,
      error: {
        message: 'Missing required fields',
        errorCode: 'AU101',
      },
    });
  });

  it('should handle invalid priority values and return 400 status code', async () => {
    const response = await request(app).post('/create-task').send({
      title: 'Task',
      description: 'Task description',
      status: 'Pending',
      due_date: new Date().toISOString(),
      priority: 'InvalidPriority',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      statusCode: 400,
      error: {
        message: 'Invalid priority value',
        errorCode: 'AU101',
      },
    });
  });

  it('should handle database errors and return 500 status code', async () => {
    (Task.create as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).post('/create-task').send({
      title: 'Task',
      description: 'Task description',
      status: 'Pending',
      due_date: new Date().toISOString(),
      priority: 'Medium',
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: false,
      statusCode: 500,
      error: {
        message: 'Internal server error',
        errorCode: 'AU101',
      },
    });
  });
});

import request from 'supertest';
import app from '../src/index';
import Task from '../src/models/tasks';
import { TaskHistory } from '../src/models/taskHistory';

jest.mock('../src/models/tasks');
jest.mock('../src/models/taskHistory');

describe('PATCH /task/:id', () => {
  it('should update an existing task and return it', async () => {
    const updatedTask = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated description',
      status: 'In Progress',
      due_date: '2024-08-16T08:27:13.407Z',
      priority: 'Medium'
    };

    (Task.findByPk as jest.Mock).mockResolvedValue({
      ...updatedTask,
      update: jest.fn().mockResolvedValue(updatedTask),
    });

    (TaskHistory.create as jest.Mock).mockResolvedValue({});

    const response = await request(app).patch('/task/1').send(updatedTask);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      status: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  });

  it('should return 404 if task is not found', async () => {
    (Task.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app).patch('/task/1').send({ title: 'Updated Task' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      statusCode: 404,
      error: {
        message: 'Task not found',
        errorCode: 'AU101', 
      },
    });
  });

  it('should return 400 for invalid status value', async () => {
    (Task.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Existing Task',
      update: jest.fn(),
    });

    const response = await request(app).patch('/task/1').send({ status: 'Invalid Status' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      statusCode: 400,
      error: {
        message: 'Invalid status value',
        errorCode: 'AU101', 
      },
    });
  });

  it('should return 400 for invalid date format', async () => {
    (Task.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Existing Task',
      update: jest.fn(),
    });

    const response = await request(app).patch('/task/1').send({ due_date: 'Invalid Date' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      statusCode: 400,
      error: {
        message: 'Invalid date format',
        errorCode: 'AU101',
      },
    });
  });

  it('should handle errors and return 500 status code', async () => {
    (Task.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).patch('/task/1').send({ title: 'Task' });

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

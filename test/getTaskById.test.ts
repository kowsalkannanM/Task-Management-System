import request from 'supertest';
import app from '../src/index';
import Task from '../src/models/tasks';

jest.mock('../src/models/tasks'); // Ensure this path matches your setup

describe('GET /task/:id', () => {
  it('should retrieve a task by its ID', async () => {
    const mockTask = {
      id: 1,
      title: 'Task 1',
      description: 'Sample task',
    };

    (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);

    const response = await request(app).get('/task/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      statusCode: 200,
      message: 'Data fetched successfully',
      data: mockTask,
    });
  });

  it('should return 404 if task is not found', async () => {
    (Task.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get('/task/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      statusCode: 404,
      error: {
        errorCode: 'AU102',
        message: 'Task not found',
      },
    });
  });

  it('should handle errors and return 500 status code', async () => {
    (Task.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/task/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: false,
      statusCode: 500,
      error: {
        errorCode: 'AU102',
        message: 'Internal server error',
      },
    });
  });
});

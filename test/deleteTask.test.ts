import request from 'supertest';
import app from '../src/index';
import Task from '../src/models/tasks';

jest.mock('../src/models/tasks');

describe('DELETE /task/:id', () => {
  it('should delete an existing task and return success message', async () => {
    (Task.findByPk as jest.Mock).mockResolvedValue({
      destroy: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true), // Ensure save is mocked
    });

    const response = await request(app).delete('/task/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      statusCode: 200,
      message: "Task deleted successfully",
      data: {
        message: 'Task deleted successfully',
      },
    });
  });


  it('should return 404 if task is not found', async () => {
    (Task.findByPk as jest.Mock).mockResolvedValue(null);

    const response = await request(app).delete('/task/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      statusCode: 404,
      error: {
        errorCode: 'AU101',
        message: 'Task not found',
      },
    });
  });


  it('should handle errors and return 500 status code', async () => {
    (Task.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).delete('/task/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: false,
      statusCode: 500,
      error: {
        errorCode: 'AU101',
        message: 'Internal server error',
      },
    });
  });

});

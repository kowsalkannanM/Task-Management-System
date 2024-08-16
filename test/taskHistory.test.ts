import request from 'supertest';
import app from '../src/index';
import { TaskHistory } from '../src/models/taskHistory';

jest.mock('../src/models/taskHistory');

describe('GET /task-history/:id', () => {
  it('should retrieve the history of a task by its ID', async () => {
    const mockHistory = [
      {
        action: 'Updated',
        field_name: 'status',
        old_value: 'Pending',
        new_value: 'Completed',
        changed_at: '2024-08-16T14:35:00Z',
        changed_by: 'User123'
      },
    ];

    (TaskHistory.findAll as jest.Mock).mockResolvedValue(mockHistory);

    const response = await request(app).get('/task-history/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      statusCode: 200,
      message: 'Task history fetched successfully',
      data: mockHistory
    });
  });

  it('should return 404 if no history is found for the task', async () => {
    (TaskHistory.findAll as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get('/task-history/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      statusCode: 404,
      error: {
        errorCode: 'AU102',
        message: 'No history found for this task'
      }
    });
  });

  it('should handle errors and return 500 status code', async () => {
    (TaskHistory.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/task-history/1');

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

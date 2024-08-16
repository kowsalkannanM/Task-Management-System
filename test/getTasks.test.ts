import request from 'supertest'
import app from '../src/index';
import Task from '../src/models/tasks';

jest.mock('../src/models/tasks'); 

describe('GET /tasks', () => {
  it('should return a list of tasks with pagination and sorting', async () => {
    (Task.findAll as jest.Mock).mockResolvedValue([{ id: 1, title: 'Task 1' }]);
    (Task.count as jest.Mock).mockResolvedValue(1);
  
    const response = await request(app).get('/tasks?page=1&limit=10&sort=title&order=ASC');
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      statusCode: 200,
      message: "Data fetched successfully",
      data: {
        tasks: [{ id: 1, title: 'Task 1' }],
        pagination: {
          total: 1,
          limit: 10,
          page: 1,
        },
      },
    });
  });
  

  it('should handle errors and return 500 status code', async () => {
    (Task.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));
  
    const response = await request(app).get('/tasks');
  
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

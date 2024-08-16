import { Request, Response } from 'express';
import Task from '../models/tasks';
import { STATUS_CODE } from '../helpers/constants/status-code';
import { STATUS_MESSAGE } from '../helpers/constants/status-message';
import { sendResponse, sendErrorResponse } from '../helpers/responses';
import { TaskHistory } from '../models/taskHistory';

interface CustomRequest extends Request {
  user?: { username: string };
}


// Create  a task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, due_date, priority } = req.body;

    // Validate required fields
    if (!title || !description || !status || !due_date) {
      return sendErrorResponse(req, res, STATUS_CODE.BAD_REQUEST, {
        message: 'Missing required fields',
      });
    }

    // Optional validation for priority
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
      return sendErrorResponse(req, res, STATUS_CODE.BAD_REQUEST, {
        message: 'Invalid priority value',
      });
    }

    // Create the task without `assigned_to`
    const task = await Task.create({ title, description, status, due_date, priority });

    sendResponse(req, res, STATUS_CODE.CREATED, STATUS_MESSAGE.TASK_CREATED, task);
  } catch (error) {
    sendErrorResponse(req, res, STATUS_CODE.INTERNAL_SERVER_ERROR, {
      message: STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};

// Update a task

export const updateTask = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, status, due_date, priority } = req.body;

  try {
      const task = await Task.findByPk(id);

      if (!task) {
          return sendErrorResponse(req, res, STATUS_CODE.NOT_FOUND, {
              message: 'Task not found',
          });
      }

      const updatedFields: Partial<Task> = {};
      const changes: Array<{ field_name: string; old_value: string | Date | null; new_value: string | Date | null }> = [];

      if (title && title !== task.title) {
          updatedFields.title = title;
          changes.push({
              field_name: 'title',
              old_value: task.title ?? null,
              new_value: title,
          });
      }

      if (description && description !== task.description) {
          updatedFields.description = description;
          changes.push({
              field_name: 'description',
              old_value: task.description ?? null,
              new_value: description,
          });
      }

      if (status && status !== task.status) {
          if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
              return sendErrorResponse(req, res, STATUS_CODE.BAD_REQUEST, {
                  message: 'Invalid status value',
              });
          }
          updatedFields.status = status;
          changes.push({
              field_name: 'status',
              old_value: task.status ?? null,
              new_value: status,
          });
      }

      if (due_date) {
          const parsedDate = new Date(due_date);
          if (isNaN(parsedDate.getTime())) {
              return sendErrorResponse(req, res, STATUS_CODE.BAD_REQUEST, {
                  message: 'Invalid date format',
              });
          }
          updatedFields.due_date = parsedDate;
          changes.push({
              field_name: 'due_date',
              old_value: task.due_date ?? null,
              new_value: parsedDate,
          });
      }

      if (priority && priority !== task.priority) {
          updatedFields.priority = priority;
          changes.push({
              field_name: 'priority',
              old_value: task.priority ?? null,
              new_value: priority,
          });
      }

      const changedBy = req.user?.username || 'system';

      await task.update(updatedFields);

      // Ensure that all required fields are populated for TaskHistory
      await Promise.all(
          changes.map(change =>
              TaskHistory.create({
                  task_id: task.id,
                  field_name: change.field_name,
                  old_value: change.old_value,
                  new_value: change.new_value,
                  action: 'update',
                  changed_by: changedBy,
              })
          )
      );

      sendResponse(req, res, STATUS_CODE.SUCCESS, STATUS_MESSAGE.TASK_UPDATED, task);
  } catch (error) {
      sendErrorResponse(req, res, STATUS_CODE.INTERNAL_SERVER_ERROR, {
          message: STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
      });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return sendErrorResponse(req, res, STATUS_CODE.NOT_FOUND, {
        errorCode: 'AU101',
        message: 'Task not found',
      });
    }

    // Optionally: If you are using soft deletes, set the `deleted_at` field
    task.deleted_at = new Date();
    await task.save();

    sendResponse(req, res, STATUS_CODE.SUCCESS, STATUS_MESSAGE.TASK_DELETED, {
      message: 'Task deleted successfully',
    });
  } catch (error) {
    sendErrorResponse(req, res, STATUS_CODE.INTERNAL_SERVER_ERROR, {
      errorCode: 'AU101',
      message: 'Internal server error',
    });
  }
};

// Get a tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { status, description, priority, sort, page = 1, limit = 10, order = 'ASC', due_date } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const whereCondition: { status?: string; priority?: string; description?: string; due_date?: Date } = {};
    if (status) {
      whereCondition.status = status as string;
    }
    if (priority) {
      whereCondition.priority = priority as string;
    }
    if (description) {
      whereCondition.description = description as string;
    }
    if (due_date) {
      const parsedDate = new Date(due_date as string);
      if (!isNaN(parsedDate.getTime())) {
        whereCondition.due_date = parsedDate;
      }
    }

    const orderDirection: 'ASC' | 'DESC' = (order as 'ASC' | 'DESC') || 'ASC';
    const orderBy: [string, 'ASC' | 'DESC'][] = sort ? [[sort as string, orderDirection]] : [];

    const tasks = await Task.findAll({
      where: whereCondition,
      order: orderBy,
      limit: Number(limit),
      offset,
    });

    const total = await Task.count({ where: whereCondition });

    sendResponse(req, res, STATUS_CODE.SUCCESS, STATUS_MESSAGE.SUCCESS, {
      tasks,
      pagination: {
        total,
        limit: Number(limit),
        page: Number(page),
      },
    });
  } catch (error) {
    sendErrorResponse(req, res, STATUS_CODE.INTERNAL_SERVER_ERROR, {
      errorCode: 'AU101',
      message: STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};


export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return sendErrorResponse(req, res, STATUS_CODE.NOT_FOUND, {
        errorCode: 'AU102',
        message: 'Task not found',
      });
    }

    sendResponse(req, res, STATUS_CODE.SUCCESS, 'Data fetched successfully', task);
  } catch (error) {
    sendErrorResponse(req, res, STATUS_CODE.INTERNAL_SERVER_ERROR, {
      errorCode: 'AU102',
      message: 'Internal server error',
    });
  }
};
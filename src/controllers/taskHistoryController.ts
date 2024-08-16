import { Request, Response } from 'express';
import { TaskHistory } from '../models/taskHistory';
import { STATUS_CODE } from '../helpers/constants/status-code';
import { STATUS_MESSAGE } from '../helpers/constants/status-message';
import { sendResponse, sendErrorResponse } from '../helpers/responses';


export const getTaskHistory = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const history = await TaskHistory.findAll({
        where: { task_id: id },
        order: [['changed_at', 'DESC']],
      });
  
      if (history.length === 0) {
        return sendErrorResponse(req, res, STATUS_CODE.NOT_FOUND, {
          errorCode: 'AU102',
          message: 'No history found for this task',
        });
      }
  
      sendResponse(req, res, STATUS_CODE.SUCCESS, STATUS_MESSAGE.TASK_HISTORY, history);
    } catch (error) {
      console.error("getTaskHistory", error);
      sendErrorResponse(req, res, STATUS_CODE.INTERNAL_SERVER_ERROR, {
        message: STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
      });
    }
  };
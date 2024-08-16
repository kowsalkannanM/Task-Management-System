import { Request, Response } from "express";
import { STATUS_CODE } from "../constants/status-code";
import { STATUS_MESSAGE } from "../constants/status-message";

interface ErrorResponse {
  message: string;
  errorCode?: string;
}

interface SuccessResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: any;
  error_code?: string;
}

const sendResponse = (
  req: Request,
  res: Response,
  code?: number,
  message?: string,
  data?: any,
  errorCode?: string
): Response => {
  try {
    const statusCode = code || STATUS_CODE.SUCCESS;
    const responseMessage = message || STATUS_MESSAGE.SUCCESS;
    const responseData = data || {};
    const response: SuccessResponse = {
      statusCode,
      status: true,
      message: responseMessage,
      data: responseData,
    };
    
    if (data === "error") {
      (response as any).error_code = errorCode || "AU101";
    }

    return res.status(statusCode).send(response);
  } catch (error) {
    console.error("sendResponse", error);
    throw error;
  }
};

const sendErrorResponse = async (
  req: Request,
  res: Response,
  code?: number,
  error?: ErrorResponse,
  log: object = {}
): Promise<Response> => {
  try {
    const statusCode = code || STATUS_CODE.INTERNAL_SERVER_ERROR;
    const responseMessage: ErrorResponse = {
      message: error?.message || STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
      errorCode: error?.errorCode || "AU101",
    };
    return res.status(statusCode).send({
      status: false,
      statusCode,
      error: responseMessage,
    });
  } catch (error) {
    console.error("sendErrorResponse", error);
    throw error;
  }
};


export {
  sendResponse,
  sendErrorResponse
};

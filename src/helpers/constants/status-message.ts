export const STATUS_MESSAGE = {
    CONNECTIONFAILURE: "Connection Failure",
    INTERNAL_SERVER_ERROR: "Internal server error",
    SUCCESS: "Data fetched successfully",
    TASK_HISTORY: "Task history fetched successfully",
    TASK_CREATED: "Task created successfully",
    TASK_UPDATED: "Task updated successfully",
    TASK_DELETED: "Task deleted successfully"
  } as const;
  
  export type StatusMessage = (typeof STATUS_MESSAGE)[keyof typeof STATUS_MESSAGE];
  
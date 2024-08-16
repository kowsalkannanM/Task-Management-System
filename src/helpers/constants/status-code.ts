export const STATUS_CODE = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INVALID: 422,
    EXPIRED: 410,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
  } as const;
  
  export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];
  
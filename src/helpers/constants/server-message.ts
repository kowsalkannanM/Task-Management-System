export const serverMessages = {
    AU101: "Error",
    AU105: "Unauthorized access",
  } as const;
  
  export type ServerMessageCode = keyof typeof serverMessages;
  export type ServerMessage = (typeof serverMessages)[ServerMessageCode];
  
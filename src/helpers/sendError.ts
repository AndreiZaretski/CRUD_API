import { ServerResponse } from 'http';

export const sendError = (res: ServerResponse, code: number, message: string) => {
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  res.end(message);
};

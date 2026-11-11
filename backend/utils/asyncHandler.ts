import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Express 4 không tự bắt lỗi của handler async: lỗi thành unhandled rejection
 * (request treo, Node ≥ 15 có thể sập tiến trình). Bọc handler bằng hàm này để
 * mọi lỗi đi vào error middleware.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

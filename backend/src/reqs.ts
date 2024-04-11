import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import { sessions, CLIENT_SECRET } from "./consts";

export function storeRequest(req: Request, res: Response) {
  const requestToAdd = req.query.req_url
  if (typeof requestToAdd === "string") {
    console.log(requestToAdd)
    sessions.push(requestToAdd)
    console.log(sessions)
  }
}

export function fetchRequests(req: Request, res: Response) {
  console.log(sessions)
  const admin_token = req.query.token as string || '';
  try {
    var decoded: any = jwt.verify(admin_token, CLIENT_SECRET);
  } catch {
    return res.json([]);
  }
  if (decoded?.isAdmin) {
    res.json(sessions)
  } else {
    res.json([])
  }
  return res;
}

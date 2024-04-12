import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CLIENT_SECRET } from "./consts";

export function protectRoute(callback: (req: Request, res: Response) => Response | Promise<Response>) {
  return (req: Request, res: Response) => {
    const auth = req.header("Authorization");
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      if (verifyToken(token)) {
        return callback(req, res);
      }
    }
    return res.status(401).end();
  }
}

export function locallogin(req: Request, res: Response) {
  if (req.query.userLogin) {
    res.send(getUserToken());
  } else if (req.query.password === 'admin') {
    res.send(getAdminToken());
  } else {
    res.status(401).end();
  }
  return res;
}

function getUserToken() {
  return jwt.sign({ isAdmin: false }, CLIENT_SECRET);
}

function getAdminToken() {
  return jwt.sign({ isAdmin: true }, CLIENT_SECRET);
}

export function verifyToken(token: string) {
  try {
    var decoded: any = jwt.verify(token, CLIENT_SECRET);
  } catch {
    return false;
  }
  return decoded?.isAdmin
}


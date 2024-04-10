import { Request, Response } from "express";

export function uploadFile(req: Request, res: Response) {
  console.log('body: ', req.body)
  return res.status(200).header('Access-Control-Allow-Origin', '*');
}

export function extraUrls(req: Request, res: Response) {
  console.log(req.body);
  return res.json([{id: "test", preview_url: 'url'}]);
}

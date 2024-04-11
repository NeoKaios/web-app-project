import { Request, Response } from "express";
import fileUpload from "express-fileupload";

export function uploadFile(req: Request, res: Response) {
  console.log('body: ', req.body)
  
  console.log(req.files ? req.files["0Z7nGFVCLfixWctgePsRk9"] : null)
  if (req.files){
    let file : any = req.files["0Z7nGFVCLfixWctgePsRk9"];
    file.mv("./uploads/" + "ok");
  }

  return res.send("OK");//.header('Access-Control-Allow-Origin', '*');
}

export function extraUrls(req: Request, res: Response) {
  console.log(req.body);
  
  return res.json([{id: "test", preview_url: 'url'}]);
}

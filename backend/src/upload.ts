import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { ALLOWED_MIME, UPLOADS_DIR } from "./consts";
import fs from "fs";

export function deleteFile(req: Request, res: Response) {
  try {
    fs.unlinkSync(UPLOADS_DIR + req.params.track_id)
    return res.end();
  } catch {
    return res.status(500).end();
  }
}

export function uploadFile(req: Request, res: Response) {
  const uploaded_files: string[] = []
  if (req.files) {
    for (let [file_name, _file] of Object.entries(req.files)) {
      const file = _file as fileUpload.UploadedFile;
      if (ALLOWED_MIME.includes(file.mimetype)) {
        console.log('Moving ', file.name, ' in ', UPLOADS_DIR + file_name);
        file.mv(UPLOADS_DIR + file_name); // TODO fix this as it's unsecure...
        uploaded_files.push(file_name);
      } else {
        console.log('Bad MIME');
      }
    }
  }
  return res.json(uploaded_files);
}

export async function extraUrls(req: Request, res: Response) {
  const tracks: string = req.body.tracks;
  if (!tracks) {
    return res.json([])
  }
  const extraUrls: string[] = [];
  tracks.split(',').forEach(track => {
    try {
      fs.accessSync(UPLOADS_DIR + track, fs.constants.R_OK);
      extraUrls.push(track)
    } catch { }
  });
  return res.json(extraUrls);
}

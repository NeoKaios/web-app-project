import { Request, Response } from "express";
import { Database } from "./setup";

/**
 * Create a user request for a playlist
 */
export function dbStoreRequest(req: Request, res: Response) {
  Database.UserRequest.findOrCreate({
    where: { id: req.query.playlist_id }
  });
  return res.end();
}

/**
 * Fetch all requested playlists
 */
export async function dbFetchAllRequests(req: Request, res: Response) {
  const requests = await Database.UserRequest.findAll();
  return res.json(requests.map(request => request.dataValues.id));
}


/**
 * Delete a user request
 */
export function dbDeleteRequest(req: Request, res: Response) {
  Database.UserRequest.destroy({
    where: {
      id: req.query.playlist_id,
    }
  });
  return res.end();
}


import { Request, Response } from "express";
import { Database } from "./setup";

export async function dbTest(req: Request, res: Response) {
    const micronoyau = await Database.User.create({ username: 'micronoyau' });
    const progression = await Database.Progression.create({
      user: micronoyau.get('id'),
      playlist: 1,
      song: 1,
      repetitions: 0,
      ef: 2.5,
      interval: 1
    });
    return res.send();
  }

/**
 * Register user in DB
 */
export async function dbRegisterUser(req: Request<{ user_id: string, username: string }>, res: Response) {
  const user = await Database.User.findOrCreate({
    where: {
      id: req.params.user_id,
      username: req.params.username
    }
  });
  return res.send();
}

/**
 * Get registered user data
 */
export async function dbGetUserData(req: Request<{ user_id: string }>, res: Response) {
  const username = await Database.User.findAll({
    where: {
      id: req.params.user_id
    }
  });
  if (username.length == 0) return res.send({});
  return res.send(username[0]);
}

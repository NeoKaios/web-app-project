import { Request, Response } from "express";
import { Model, QueryTypes } from "sequelize";
import { UPDATE_OK } from "../consts";
import { INITIAL_EF, INITIAL_INTERVAL, INITIAL_REPETITIONS, INTERVAL_DURATION, updateSM2 } from "../lib/SM2";
import { Database } from "./setup";

/**
 * Returns all studied (registered) songs so far + songs to study
 */
export async function dbGetStudySongs(req: Request<{ user_id: string, playlist_id: string }>, res: Response) {
  const toStudy = await Database.sequelize.query(`SELECT song FROM Progressions
                                            WHERE UNIX_TIMESTAMP(updatedAt) + \`interval\` * :interval_duration < UNIX_TIMESTAMP(CURTIME())
                                            AND user = :user_id
                                            AND playlist = :playlist_id;`,
    {
      type: QueryTypes.SELECT,
      replacements: {
        user_id: req.params.user_id,
        playlist_id: req.params.playlist_id,
        interval_duration: INTERVAL_DURATION
      }
    }
  ) as { song: string }[];

  const studied = await Database.Progression.findAll({
    attributes: ["song"],
    where: {
      user: req.params.user_id,
      playlist: req.params.playlist_id
    }
  });

  return res.send({
    toStudy: toStudy.map(t => t.song),
    studied: studied.map(t => t.dataValues.song)
  });
}

/**
 * Update SM2 score based on user feedback
 */
export async function dbUpdateStudySong(req: Request<{ user_id: string, playlist_id: string, song_id: string, quality: number }>, res: Response) {
  const progression = await Database.Progression.findAll({
    where: {
      user: req.params.user_id,
      playlist: req.params.playlist_id,
      song: req.params.song_id
    }
  });

  let [repetitions, ef, interval] = [0, 0, 0];
  let prog: Model;

  // First time studying this song
  if (progression.length == 0) {
    prog = await Database.Progression.create({
      user: req.params.user_id,
      playlist: req.params.playlist_id,
      song: req.params.song_id
    });
    [repetitions, ef, interval] = [INITIAL_REPETITIONS, INITIAL_EF, INITIAL_INTERVAL];

  } else {
    prog = progression[0];
    ({ repetitions, ef, interval } = prog.toJSON());
  }

  // Update score
  ({ repetitions, ef, interval } = updateSM2(Number(req.params.quality), repetitions, ef, interval));
  prog.set('repetitions', repetitions);
  prog.set('ef', ef);
  prog.set('interval', interval);
  // Force update (even if its twice the same score, because updatedAt field is mandatory)
  //@ts-ignore
  prog.changed('updatedAt', true);
  await prog.save();

  return res.send(UPDATE_OK);
}

/**
 * Get user progression : number of studied songs, last update and average progression
 */
export async function dbGetUserProgression(req: Request<{ user_id: string, playlist_id: string }>, res: Response) {
  const registeredSongs = await Database.Progression.count({
    where: {
      user: req.params.user_id,
      playlist: req.params.playlist_id
    }
  });

  const updatedAt = await Database.Progression.max('updatedAt', {
    where: {
      user: req.params.user_id,
      playlist: req.params.playlist_id
    }
  }) as string;
  const lastUpdate = new Date(updatedAt).toLocaleString();

  const averageEf = await Database.Progression.sum('ef', {
    where: {
      user: req.params.user_id,
      playlist: req.params.playlist_id
    }
  }) / registeredSongs;

  const { toStudy } = (await Database.sequelize.query(`SELECT COUNT(song) as toStudy FROM Progressions
                                            WHERE UNIX_TIMESTAMP(updatedAt) + \`interval\` * :interval_duration < UNIX_TIMESTAMP(CURTIME())
                                            AND user = :user_id
                                            AND playlist = :playlist_id;`,
    {
      type: QueryTypes.SELECT,
      replacements: {
        user_id: req.params.user_id,
        playlist_id: req.params.playlist_id,
        interval_duration: INTERVAL_DURATION
      }
    }
  ))[0] as { toStudy: number };

  // console.log(toStudy);

  return res.send({
    registeredSongs,
    lastUpdate,
    averageEf,
    toStudy
  });
}

/**
 * Delete progression
 */
export async function dbResetPlaylistProgression(req: Request<{ user_id: string, playlist_id: string }>, res: Response) {
  await Database.Progression.destroy({
    where: {
      user: req.params.user_id,
      playlist: req.params.playlist_id,
    }
  });

  return res.send(UPDATE_OK);
}

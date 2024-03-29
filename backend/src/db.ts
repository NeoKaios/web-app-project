import { Request, Response } from "express";
import mysql from "mysql2";
import { Model, Op, QueryTypes, Sequelize } from "sequelize";
import { UserModel } from "./models/user";
import { ProgressionModel } from "./models/progression";
import { DB_HOST, DB_PASSWORD, DB_PORT, UPDATE_OK } from "./consts";
import { INITIAL_EF, INITIAL_INTERVAL, INITIAL_REPETITIONS, INTERVAL_DURATION, updateSM2 } from "./lib/SM2";

// Only to create database if it does not exist (the app should crash on first request,
// but subsequent requests should work)
const connection = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: 'root',
  password: DB_PASSWORD
})
connection.connect();
connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\`;`, (err, result) => {
  connection.end();
  connectDB();
});

const sequelize = new Sequelize(process.env.MYSQL_DATABASE ?? '', 'root', process.env.MYSQL_ROOT_PASSWORD, {
  dialect: 'mysql',
  dialectOptions: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.MYSQL_ROOT_PASSWORD,
  }
})

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Synchronize models with database (possibly creating tables)
const User = UserModel(sequelize);
const Progression = ProgressionModel(sequelize);
sequelize.sync();

export async function dbTest(req: Request, res: Response) {
  const micronoyau = await User.create({ username: 'micronoyau' });
  const progression = await Progression.create({
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
  const user = await User.findOrCreate({
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
  const username = await User.findAll({
    where: {
      id: req.params.user_id
    }
  });
  if (username.length == 0) return res.send({});
  return res.send(username[0]);
}

/**
 * Returns all studied (registered) songs so far + songs to study
 */
export async function dbGetStudySongs(req: Request<{ user_id: string, playlist_id: string }>, res: Response) {
  const toStudy = await sequelize.query(`SELECT song FROM Progressions
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

  const studied = await Progression.findAll({
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
 * Returns songs to study that were updated after timestamp
 */
export async function dbGetNewStudySongs(req: Request<{ user_id: string, playlist_id: string, timestamp: number }>, res: Response) {
  const toStudy = await sequelize.query(`SELECT song FROM Progressions
                                            WHERE UNIX_TIMESTAMP(updatedAt) + \`interval\` * :interval_duration < UNIX_TIMESTAMP(CURTIME())
                                            AND UNIX_TIMESTAMP(updatedAt) > :timestamp
                                            AND user = :user_id
                                            AND playlist = :playlist_id;`,

    {
      type: QueryTypes.SELECT,
      replacements: {
        user_id: req.params.user_id,
        playlist_id: req.params.playlist_id,
        interval_duration: INTERVAL_DURATION,
        timestamp: req.params.timestamp,
      }
    }
  ) as { song: string }[];

  return res.send({
    newToStudy: toStudy.map(t => t.song)
  });
}

/**
 * Update SM2 score based on user feedback
 */
export async function dbUpdateStudySong(req: Request<{ user_id: string, playlist_id: string, song_id: string, quality: number }>, res: Response) {
  const progression = await Progression.findAll({
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
    prog = await Progression.create({
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

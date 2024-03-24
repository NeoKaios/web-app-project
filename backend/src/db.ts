import { Request, Response } from "express";
import mysql from "mysql2";
import { Sequelize } from "sequelize";
import { UserModel } from "./models/user";
import { ProgressionModel } from "./models/progression";
import { DB_HOST, DB_PASSWORD, DB_PORT } from "./consts";

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

export async function dbGetUserData(req: Request<{ user_id: string }>, res: Response) {
  const username = await User.findAll({
    where: {
      id: req.params.user_id
    }
  });
  if (username.length == 0) return res.send({});
  return res.send(username[0]);
}

export async function dbGetStudySong(req: Request<{ user_id: string, playlist_id: string }>, res: Response) {
  const progression = await Progression.findAll({
    attributes: ['song', 'delay'],
    where: {
      user: req.params.user_id,
      playlist: req.params.playlist_id
    }
  });

  // First time practicing : return a random song
  if (progression.length == 0) {
    // TODO
  }
  return res.send(progression[0]);
}

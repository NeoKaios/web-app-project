import mysql from "mysql2";
import { Model, ModelStatic, Sequelize } from "sequelize";
import { UserModel } from "../models/user";
import { ProgressionModel } from "../models/progression";
import { DB_HOST, DB_PASSWORD, DB_PORT } from "../consts";
import { RequestModel } from "../models/request";


export class Database {
  static User: ModelStatic<Model<any, any>>;
  static Progression: ModelStatic<Model<any, any>>;
  static UserRequest: ModelStatic<Model<any, any>>;
  static sequelize: Sequelize;
}

async function connectDB(sequelize: Sequelize) {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export function setupDB() {
  const connection = mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: 'root',
    password: DB_PASSWORD
  });

  const sequelize = new Sequelize(process.env.MYSQL_DATABASE ?? '', 'root', process.env.MYSQL_ROOT_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      password: process.env.MYSQL_ROOT_PASSWORD,
    }
  });

  // Only to create database if it does not exist (the app should crash on first request,
  // but subsequent requests should work)
  connection.connect();
  connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\`;`, (err, result) => {
    connection.end();
    connectDB(sequelize);
  });


  // Synchronize models with database (possibly creating tables)
  Database.User = UserModel(sequelize);
  Database.Progression = ProgressionModel(sequelize);
  Database.UserRequest = RequestModel(sequelize);
  Database.sequelize = sequelize;
  sequelize.sync();
}


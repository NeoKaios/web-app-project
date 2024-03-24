import { INTEGER, Sequelize } from "sequelize";

export function ProgressionModel(sequelize: Sequelize) {
  return sequelize.define('Progression', {
    user: {type: INTEGER, primaryKey: true, autoIncrement: false},
    playlist: {type: INTEGER, primaryKey: true, autoIncrement: false},
    song: {type: INTEGER, primaryKey: true, autoIncrement: false},
    delay: {type: INTEGER}
  });
}

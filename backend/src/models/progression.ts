import { FLOAT, INTEGER, Sequelize } from "sequelize";

export function ProgressionModel(sequelize: Sequelize) {
  return sequelize.define('Progression', {
    user: { type: INTEGER, primaryKey: true, autoIncrement: false },
    playlist: { type: INTEGER, primaryKey: true, autoIncrement: false },
    song: { type: INTEGER, primaryKey: true, autoIncrement: false },
    repetitions: { type: INTEGER },
    ef: { type: FLOAT },
    interval: { type: INTEGER },
  });
}

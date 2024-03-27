import { FLOAT, INTEGER, STRING, Sequelize } from "sequelize";

export function ProgressionModel(sequelize: Sequelize) {
  return sequelize.define('Progression', {
    user: { type: STRING, primaryKey: true },
    playlist: { type: STRING, primaryKey: true },
    song: { type: STRING, primaryKey: true },
    repetitions: { type: INTEGER },
    ef: { type: FLOAT },
    interval: { type: INTEGER },
  });
}

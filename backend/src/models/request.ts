import { STRING, Sequelize } from "sequelize";

export function RequestModel(sequelize: Sequelize) {
  return sequelize.define('Request', {
    id: { type: STRING, primaryKey: true }
  });
}

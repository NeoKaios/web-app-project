import { STRING, Sequelize } from "sequelize";

export function UserModel(sequelize: Sequelize) {
  return sequelize.define('User', {
    id: { type: STRING, primaryKey: true },
    username: { type: STRING, primaryKey: true, allowNull: false }
  });
}

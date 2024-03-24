import { INTEGER, STRING, Sequelize } from "sequelize";

export function UserModel(sequelize: Sequelize) {
    return sequelize.define('User', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: STRING, primaryKey: true, allowNull: false }
    });
}

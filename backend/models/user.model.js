import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    user_type: {
      type: DataTypes.ENUM("normal", "ngo"), 
      allowNull: false,
    },
    organization_name: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    underscored: true,
  }
);

export default User;

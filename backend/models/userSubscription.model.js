import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import User from "./user.model.js";

const UserSubscription = sequelize.define(
  "user_subscription",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    subscription_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region_geometry: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    threshold_deforestation: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
    threshold_flooding: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
    buffer_flooding: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    threshold_fire_protection: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    days_back_fire_protection: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    threshold_glacier: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
    buffer_glacier: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    threshold_coastal_erosion: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
    alert_categories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "user_subscriptions",
    underscored: true,
  }
);

UserSubscription.belongsTo(User, { foreignKey: "userId" });
User.hasMany(UserSubscription, { foreignKey: "userId" });


export default UserSubscription;

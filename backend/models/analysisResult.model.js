import sequelize from "../db/db.js"; 
import { DataTypes } from "sequelize";
import User from "./user.model.js";
import UserSubscription from "./userSubscription.model.js";

const AnalysisResult = sequelize.define(
  "analysis_result",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserSubscription,
        key: "id",
      },
    },
    analysis_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    alert_triggered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    calculated_value: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    threshold_value: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recent_period_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    recent_period_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    previous_period_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    previous_period_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    buffer_radius_meters: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notification_sent: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "analysis_results",
    underscored: true,

  }
);

AnalysisResult.belongsTo(UserSubscription, { foreignKey: "subscription_id" });
AnalysisResult.belongsTo(User, { foreignKey: "user_id" });

UserSubscription.hasMany(AnalysisResult, { foreignKey: 'subscription_id' });
User.hasMany(AnalysisResult, { foreignKey: 'user_id' });

export default AnalysisResult;

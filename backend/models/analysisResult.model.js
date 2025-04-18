
import sequelize from "../db/db.js"; 
import { DataTypes } from "sequelize";
import User from "./user.model.js";
import UserSubscription from "./userSubscription.model.js";
const AnalysisResult = sequelize.define(
  "AnalysisResult",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UserSubscription,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "SET NULL",
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
    indexes: [
      { fields: ["subscriptionId"] },
      { fields: ["userId"] },
      { fields: ["analysis_type"] },
      { fields: ["status"] },
      { fields: ["alert_triggered"] },
    ],
  }
);


AnalysisResult.belongsTo(UserSubscription, { foreignKey: "subscriptionId" });
AnalysisResult.belongsTo(User, { foreignKey: "userId" });


UserSubscription.hasMany(AnalysisResult, { foreignKey: 'subscriptionId' });
User.hasMany(AnalysisResult, { foreignKey: 'userId' });

export default AnalysisResult;

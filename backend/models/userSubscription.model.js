import sequelize from "../db/db.js"; 
import { DataTypes } from "sequelize";
import User from "./user.model.js";

const UserSubscription = sequelize.define(
  "user_subscription", 
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

    subscription_name: {
      type: DataTypes.STRING,
      allowNull: true, 
    },

    region_geometry: {
      type: DataTypes.JSONB, 
      allowNull: false,
      comment:
        "GeoJSON representation of the subscribed region (e.g., Point, Polygon)",
    },

    alert_categories: {
      type: DataTypes.ARRAY(DataTypes.TEXT), 
      allowNull: false,
      defaultValue: [], 
      comment: "List of environmental categories monitored for this region",
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
    indexes: [
      { fields: ["user_id"] },
      { fields: ["is_active"] },
    ],
  }
);

UserSubscription.belongsTo(User, {
  foreignKey: "user_id", 
  onDelete: "CASCADE",
});

User.hasMany(UserSubscription, {
  foreignKey: "user_id",
});

export default UserSubscription;

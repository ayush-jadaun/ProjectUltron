// backend/models/userSubscription.model.js
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js"; // Adjust path as needed
import User from "./user.model.js";
// Import User model if you have associations defined here

const UserSubscription = sequelize.define(
  "UserSubscription",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Make sure this matches your users table name
        key: "id",
      },
    },
    region_name: {
      // Assuming you have a name field
      type: DataTypes.STRING,
      allowNull: true,
    },
    region_geometry: {
      type: DataTypes.JSONB, // Or DataTypes.GEOMETRY for PostGIS
      allowNull: false,
    },
    alert_categories: {
      type: DataTypes.ARRAY(DataTypes.STRING), // e.g., ['DEFORESTATION', 'FLOODING']
      allowNull: false,
      defaultValue: [],
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    // --- NEW FIELDS TO ADD ---
    threshold_deforestation: {
      type: DataTypes.FLOAT, // Or DataTypes.DOUBLE
      allowNull: true, // Allow null if user doesn't set a custom one
      comment: "NDVI drop threshold for deforestation alerts",
    },
    threshold_flood_percent: {
      type: DataTypes.FLOAT, // Or DataTypes.DOUBLE
      allowNull: true, // Allow null if user doesn't set a custom one
      comment: "Flooded area percentage threshold for flood alerts",
    },
    buffer_meters: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null if user doesn't set a custom one (for Points)
      comment: "Buffer radius in meters for Point geometries",
    },
    // Add timestamps if you haven't already
    // createdAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE
    // },
    // updatedAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE
    // }
  },
  {
    tableName: "user_subscriptions", // Explicitly define table name
    timestamps: true, // Enable createdAt and updatedAt automatically
  }
);

// Define associations here if needed
// Example:
UserSubscription.belongsTo(User, { foreignKey: 'userId' });

export default UserSubscription;

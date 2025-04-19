import sequelize from "../db/db.js"; 
import { DataTypes } from "sequelize";
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

  },
  {
    timestamps: true, 
    tableName: "user_subscriptions", 

  }
);



UserSubscription.belongsTo(User, {
  foreignKey: "userId", 
  onDelete: "CASCADE",

});

User.hasMany(UserSubscription, {
  foreignKey: "userId",
});

export default UserSubscription;

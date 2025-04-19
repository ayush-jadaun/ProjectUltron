import { Sequelize } from "sequelize";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();

// Database Connection using URI
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Disable logging for cleaner output
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Supabase requires SSL
    },
  },
  pool: {
    max: 10,
    min: 1,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true, // Use snake_case for column names
    freezeTableName: true, // Don't pluralize table names
  }
});

// Sync Database
// sequelize
//   .sync({force:true})
//   .then(() => {
//     console.log("Database & tables have been updated!");
//   })
//   .catch((error) => {
//     console.error("Error updating database schema:", error);
//   });

// // Connect to Database
export const connectDb = asyncHandler(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connection has been established successfully.");
    
    // Import models after connection is established
    import("../models/user.model.js");
    import("../models/userSubscription.model.js");
    import("../models/analysisResult.model.js");
    
    // Sync Database
    await sequelize.sync({alter:true});
    console.log("Database & tables have been recreated!");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
});

export default sequelize;


import sequelize from "../db/db.js"
import { DataTypes } from "sequelize"


const users = sequelize.define(
    "users",
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
            type: DataTypes.ENUM('normal', 'ngo'),
            allowNull: false,
        },
        organization_name:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        contact_number:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        location:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    },
    {
        timestamps: true,
    }
);

export default users;
require('dotenv').config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

const User = sequelize.define('user', {
  userId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  email: Sequelize.STRING,
  password: Sequelize.STRING
});

const Project = sequelize.define("project", {
  name: Sequelize.STRING,
  userId: Sequelize.UUID,
});

const Color = sequelize.define("color", {
  projectId: Sequelize.INTEGER,
  colorName: Sequelize.STRING,
  hexValue: Sequelize.STRING,
  variantCount: Sequelize.INTEGER,
});

const Radius = sequelize.define("radius", {
  projectId: Sequelize.INTEGER,
  baseValue: Sequelize.INTEGER,
  variantCount: Sequelize.INTEGER,
  multiplier: Sequelize.INTEGER,
});

const Spacing = sequelize.define("spacing", {
  projectId: Sequelize.INTEGER,
  baseValue: Sequelize.INTEGER,
  variantCount: Sequelize.INTEGER,
});

User.hasMany(Project);
Project.belongsTo(User);
Project.hasMany(Color);
Color.belongsTo(Project);
Project.hasOne(Radius);
Radius.belongsTo(Project);
Project.hasOne(Spacing);
Spacing.belongsTo(Project);

sequelize.sync();

module.exports = { User, Project, Color, Radius, Spacing };

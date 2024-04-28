const bcrypt = require("bcrypt");
const { User, Project, Color, Radius, Spacing } = require("../models/models");

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ email, password: hashedPassword });
}

async function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

async function createProject(name, userId) {
  return Project.create({ name, userId });
}

async function getProjectById(id) {
  return Project.findByPk(id, {
    include: [Color, Radius, Spacing],
  });
}

async function getProjectByUserId(id) {
  return Project.findAll({ where: { userId: id } });
}

async function getUserById(id) {
  return User.findByPk(id);
}

async function updateColors(projectId, colors) {
  try {
    const existingColors = await Color.findAll({ where: { projectId } });

    for (const existingColor of existingColors) {
      const { id: existingColorId, colorName, hexValue, variantCount } = existingColor;

      const updatedColor = Object.values(colors).find(color => color.id === existingColorId);

      if (updatedColor) {
        const { hex, count, name } = updatedColor;

        // If any changes detected, update the row
        if (hex !== hexValue || count !== variantCount || name !== colorName) {
          await existingColor.update({ hexValue: hex, variantCount: count, colorName: name });
        }
      }
    }

    return { message: "Colors updated" };
  } catch (error) {
    console.error("Error updating colors:", error);
    throw new Error("Internal server error");
  }
}

async function updateRadius(id, baseValue, variantCount, multiplier) {
  const radius = await Radius.findByPk(id);
  if (!radius) throw new Error("Radius not found");
  await radius.update({ baseValue, variantCount, multiplier });
}

async function updateSpacing(id, baseValue, variantCount) {
  const spacing = await Spacing.findByPk(id);
  if (!spacing) throw new Error("Spacing not found");
  await spacing.update({ baseValue, variantCount });
}

async function createColor(projectId, colorName, hexValue, variantCount) {
  return Color.create({ projectId, colorName, hexValue, variantCount });
}

function getCurrentUserId () {
  return localStorage.getItem('userId');
}

module.exports = {
  createUser,
  findUserByEmail,
  createProject,
  getProjectById,
  updateColors,
  updateRadius,
  updateSpacing,
  createColor,
  getCurrentUserId,
  getUserById,
  getProjectByUserId
};

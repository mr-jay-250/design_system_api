const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { 
    createUser, 
    findUserByEmail, 
    createProject, 
    getProjectById, 
    updateColor, 
    updateRadius, 
    updateSpacing, 
    createColor,
    getCurrentUserId,
    getUserById,
    getProjectByUserId
} = require("../services/service");
const {
  Color,
  Radius,
  Spacing
} = require("../models/models")

async function login(req, res) {
  const { email, password } = req.body;
  let user = await findUserByEmail(email);
  if (!user) {
    user = await createUser(email, password);
  } else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token = jwt.sign({ userId: user.dataValues.userId }, '$5&%726*@', { expiresIn: '12h' });
  res.json({ message: "Logged in", userId: user.dataValues.userId, token: token });
}

async function createProjectHandler(req, res) {
  try {
    const { name, userId } = req.body;
    const project = await createProject(name, userId);
    await Color.create({ projectId: project.id, colorName: 'primary', hexValue: '#0000FF', variantCount: 5 });
    await Color.create({ projectId: project.id, colorName: 'secondary', hexValue: '#008000', variantCount: 5 });
    await Color.create({ projectId: project.id, colorName: 'warning', hexValue: '#FFFF00', variantCount: 5 });
    await Radius.create({ projectId: project.id, baseValue: '2', variantCount: 4, multiplier: 2 });
    await Spacing.create({ projectId: project.id, baseValue: '6', variantCount: 8 });
    res.json({ message: "Project created", projectId: project.id });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
}

async function getProject(req, res) {
  const { id } = req.params;

  const project = await getProjectById(id);

  res.json(project);
}

async function getUserProjects (req, res) {
  const { userId } = req.params;
  
  const projects = await getProjectByUserId(userId);
  
  res.json({ projects: projects });
}

async function getUserProfile (req, res) {
  const { userId } = req.params;
  
  const user = await getUserById(userId);
  const projects = await getProjectByUserId(userId);
  
  res.json({ email: user.email, projects: projects });
}

async function updateColorHandler(req, res) {
  const { id } = req.params;
  const colors = req.body;

  for (const colorName in colors) {
    const { hexValue, count } = colors[colorName];
    await updateColor(id, colorName, hexValue, count);
  }

  res.json({ message: "Colors updated" });
}

async function updateRadiusHandler(req, res) {
  const { id } = req.params;
  const { baseValue, variantCount, multiplier } = req.body;
  await updateRadius(id, baseValue, variantCount, multiplier);
  res.json({ message: "Radius updated" });
}

async function updateSpacingHandler(req, res) {
  const { id } = req.params;
  const { baseValue, variantCount } = req.body;
  await updateSpacing(id, baseValue, variantCount);
  res.json({ message: "Spacing updated" });
}

async function createColorHandler(req, res) {
  const { projectId, colorName, hexValue, variantCount } = req.body;
  
  const color = await Color.create({ projectId, colorName, hexValue, variantCount });
  
  res.json({ message: 'Color created', colorId: color.id });
}

module.exports = {
  login,
  createProjectHandler,
  getProject,
  updateColorHandler,
  updateRadiusHandler,
  updateSpacingHandler,
  createColorHandler,
  getUserProfile,
  getUserProjects
};

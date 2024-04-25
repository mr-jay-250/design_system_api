const express = require("express");
const router = express.Router();
const { 
    login, 
    createProjectHandler, 
    getProject, 
    updateColorHandler, 
    updateRadiusHandler, 
    updateSpacingHandler, 
    createColorHandler,
    getUserProfile,
    getUserProjects
} = require("../Controllers/controller");

router.post("/login", login);
router.post("/projects", createProjectHandler);
router.get("/projects/:id", getProject);
router.get('/users/:userId/profile', getUserProfile);
router.get('/users/:userId/projects', getUserProjects);
router.put("/color/:id", updateColorHandler);
router.put("/radius/:id", updateRadiusHandler);
router.put("/spacing/:id", updateSpacingHandler);
router.post("/colors", createColorHandler);

module.exports = router;

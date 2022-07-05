const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

const apiController = require("../controllers/api");
const pwmController = require("../controllers/pwm");
const rackController = require("../controllers/rack");
const shelfController = require("../controllers/shelf");
const esp32Controller = require("../controllers/esp32");

/* Serves HTML files to user */
router.get("/", authController.index);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/admin", authController.adminAuth);
router.get("/admin", authController.admin);
router.get("/adminOLD", authController.adminOLD);

/* Admin and Student interaction with shelf values */
router.put("/api/shelf/mode", authController.dashboard, apiController.modeChange);
router.put("/api/shelf/value", authController.dashboard, apiController.valueChange);

/* forces all admin api calls to be fully authenticated */
router.all("/config/*", authController.adminAuth);

/* Admin interaction with PWM module */
router.post("/config/pwm", pwmController.newModule);
router.put("/config/pwm/name", pwmController.updateName);
router.put("/config/pwm/dc", shelfController.dcShelf);
router.put("/config/pwm/resync", pwmController.resync);
router.delete("/config/pwm/:pwmId", pwmController.deleteModule);

/* Admin interaction with Racks */
router.post("/config/rack", rackController.newRack);
router.put("/config/rack/name", rackController.updateName);
router.delete("/config/rack/:rackId", rackController.deleteRack);

/* Admin interaction with Shelves */
router.post("/config/shelf", shelfController.newShelf);
router.put("/config/shelf/name", shelfController.updateName);
router.put("/config/shelf/addr", shelfController.updateAddr);
router.delete("/config/shelf/:shelfId", shelfController.deleteShelf);

/* Available to public, no credentials */
router.get("/api/config", apiController.config);

/* Client requesting server modification */
router.put("/api/config/syncd", authController.clientAuth, apiController.syncdNotify);

/* ESP32 Project */
router.get("/esp32/reset", esp32Controller.reset);
router.get("/esp32/config", esp32Controller.config);
router.get("/esp32/dashboard", esp32Controller.dashboard);
router.post("/esp32/save", esp32Controller.save);
router.post("/esp32/saveDuration", esp32Controller.saveDuration);
router.post("/esp32/saveCustom", esp32Controller.saveCustom);

module.exports = router;

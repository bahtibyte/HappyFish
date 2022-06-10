const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 

const apiController = require('../controllers/api') 
const pwmController = require('../controllers/pwm') 
const rackController = require('../controllers/rack')

router.get('/', authController.index)
router.post('/login', authController.login)
router.get('/logout', authController.logout);

/* forces all admin api calls to be fully authenticated */
//router.all('/api/*', authController.adminAuth)

router.get('/api/config', apiController.config)

router.post('/config/pwm', pwmController.newModule)
router.put('/config/pwm/name', pwmController.updateName)
router.delete('/config/pwm/:pwmId', pwmController.deleteModule)

router.post('/config/rack', rackController.newRack)
router.put('/config/rack/name', rackController.updateName)
router.delete('/config/rack/:rackId', rackController.deleteRack)

module.exports = router

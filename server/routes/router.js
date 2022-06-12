const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 

const apiController = require('../controllers/api') 
const pwmController = require('../controllers/pwm') 
const rackController = require('../controllers/rack')
const shelfController = require('../controllers/shelf')

router.get('/', authController.index)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/admin', authController.admin)

/* forces all admin api calls to be fully authenticated */
//router.all('/api/*', authController.adminAuth)


router.post('/config/pwm', pwmController.newModule)
router.put('/config/pwm/name', pwmController.updateName)
router.delete('/config/pwm/:pwmId', pwmController.deleteModule)

router.post('/config/rack', rackController.newRack)
router.put('/config/rack/name', rackController.updateName)
router.delete('/config/rack/:rackId', rackController.deleteRack)

router.post('/config/shelf', shelfController.newShelf)
router.put('/config/shelf/name', shelfController.updateName)
router.put('/config/shelf/addr', shelfController.updateAddr)
router.delete('/config/shelf/:shelfId', shelfController.deleteShelf)

router.get('/api/config', apiController.config)
router.put('/api/shelf/mode', apiController.modeChange)
router.put('/api/shelf/value', apiController.valueChange)

module.exports = router

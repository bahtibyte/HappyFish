const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 

const auth = authController.adminAuth

router.get('/', authController.index)
router.post('/login', authController.login)
router.get('/logout', authController.logout);

module.exports = router

const { Router } = require('express')
const controller = require('./controller')
const { checkUserPermissions } = require('../authMiddleware')
const router = Router()

//C
router.post('/:user_id/:question_code', checkUserPermissions, controller.create)
//R
router.get('/:user_id/:question_code', checkUserPermissions, controller.getOne)

module.exports = router
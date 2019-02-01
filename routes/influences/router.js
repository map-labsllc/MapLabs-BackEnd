const { Router } = require('express')
const controller = require('./controller')
const router = Router()

//C
router.post('/:user_id/:question_code', controller.create)
//R
router.get('/:user_id/:question_code', controller.getOne)
//U
router.put('/:user_id/:question_code', controller.update)

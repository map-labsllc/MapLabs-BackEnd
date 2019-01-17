const { Router } = require('express')
const controller = require('./controller')
const router = Router()

//C
router.post('/:user_id/:narrative_code', controller.create)
//R
router.get('/:user_id/:narrative_code', controller.getOne)
//U
router.put('/:user_id/:narrative_code', controller.update)

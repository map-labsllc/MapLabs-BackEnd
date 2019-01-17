const { Router } = require('express')
const controller = require('./controller')
const router = Router()

//C
router.post('/:user_id/:narrative_code', controller.createOrUpdate)
//R
router.get('/:user_id/:narrative_code', controller.getOne)
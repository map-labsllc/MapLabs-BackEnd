const model = require('./model')
const validator = require('../validator')

function validateTransition(user_id, question_code, { name, belief, category }) {
    if (Number.isNaN(user_id)) return false 
    if (Number.isNaN(question_code)) return false 
    if (!(typeof name === 'string') || !(typeof belief === 'string') || !(typeof category === 'string')) return false 

    return [user_id, question_code, {name, belief, category}]

}
module.exports = {
    create: function(req, res, next) {
        const [validatedUserId, validatedTransitionCode, validatedTransition] = validateTransition(req.params.user_id, req.params.question_code, {name: req.body.name, belief: req.body.belief, category: req.body.category})
        if (!validatedUserId || !validatedTransitionCode || !validatedTransition) return next(new Error('Transition failed validation'))

        return model.create(validatedUserId, validatedTransitionCode, validatedTransition).then(transition => res.status(201).json(transition)).catch(e => next({status: 422, message: e.message}))
    },
    
    getOne: function(req, res, next) {
        return model.getOne(req.params.user_id, req.params.question_code).then(transition => res.status(204).json(transition)).catch(e => next({status: 422, message: e.message}))
    }
}
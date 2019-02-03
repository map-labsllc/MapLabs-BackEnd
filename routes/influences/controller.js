const model = require('./model')

function validateInfluence(user_id, question_code, { name, belief, category }) {
    if (Number.isNaN(+user_id)) return false 
    if (Number.isNaN(+question_code)) return false 
    if (typeof name !== 'string' || typeof belief !== 'string' || typeof category !== 'string') return false 

    return [+user_id, +question_code, {name, belief, category}]

}
module.exports = {
    create: function(req, res, next) {
        const [validatedUserId, validatedInfluenceCode, validatedInfluence] = validateInfluence(req.params.user_id, req.params.question_code, {name: req.body.name, belief: req.body.belief, category: req.body.category})
        if (!validatedUserId) return next(new Error('Influence failed validation'))

        return model.create(validatedUserId, validatedInfluenceCode, validatedInfluence)
        .then(influence => {
            res.status = 201
            return res.json(influence)
        })
        .catch(e => next({status: 422, message: e.message}))
    },
    
    getOne: function(req, res, next) {
        return model.getOne(req.params.user_id, req.params.question_code)
        .then(influence => {
            res.status = 204
            return res.json(influence)
        })
        .catch(e => next({status: 422, message: e.message}))
    }
}
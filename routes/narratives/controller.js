const model = require('./model')
const validator = require('../validator')

function validateNarrative({userId, narrativeCode, narrative}) {
    try {
        const validatedUserId = validator.validate.int(userId, "user_id")
        const validatedNarrativeCode = validator.validate.int(narrativeCode, "narrative_code")
        const validatedNarrative = validator.validate.string(narrative, "narrative")

        return [validatedUserId, validatedNarrativeCode, validatedNarrative]
    } catch(e) {
        throw new Error(e)
    }
}

module.exports = {
    create: function(req, res, next) {
        try {
            const [validatedUserId, validatedNarrativeCode, validatedNarrative] = validateNarrative(req.params.user_id, req.params.narrative_code, req.body.narrative)

            return model.create({user_id: validatedUserId, narrative_code: validatedNarrativeCode, narrative: validatedNarrative})
                    .then(narrative => res.status(201).json({data: {narrative}}))
                    .catch(e => {
                        console.error(e)
                        return next({
                            status: 422, 
                            message: `Narratives model.create failed with ${e.message}`,
                        })
                    })
        } catch(e) {
            console.error(e)
            return next({
                status: 422, 
                message: `Narratives controller.create failed with ${e.message}`,
            })
        }
    },
    update: function(req, res, next) {
        try {
            const [validatedUserId, validatedNarrativeCode, validatedNarrative] = validateNarrative(req.params.user_id, req.params.narrative_code, req.body.narrative)

            return model.update({user_id: validatedUserId, narrative_code: validatedNarrativeCode, narrative: validatedNarrative})
                    .then(() => res.status(204).send())
                    .catch(e => {
                        console.error(e)
                        return next({
                            status: 422, 
                            message: `Narratives model.update failed with ${e.message}`,
                        })
                    })
        } catch(e) {
            console.error(e)
            return next({
                status: 422, 
                message: `Narratives controller.update failed with ${e.message}`,
            })
        }
    } 
}
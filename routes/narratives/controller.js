const model = require('./model')
const validate = {
    int: (field, fieldName) => {
        const fieldAsInt = +field
        if (Number.isInteger(fieldAsInt)) {
            return fieldAsInt
        }
        throw new Error(`Expected ${fieldName} to be type int, received ${field}`)
    },
    string: (field, fieldName) => {
        const escapedField = encodeURIComponent(field)
        if (typeof escapedField === 'string') {
            return escapedField
        }
        throw new Error(`Expected ${fieldName} to be type string, received ${field}`)
    } 
}
module.exports = {
    createOrUpdate: function(req, res, next) {
        try {
            const userId = validate.int(req.params.user_id, "user_id")
            const narrativeCode = validate.int(req.params.narrative_code, "narrative_code")
            const narrative = validate.string(req.body.narrative, "narrative")

            return model.createOrUpdate({userId, narrativeCode, narrative})
        } catch(e) {
            //TODO: throw to error handling middleware
            return res.status(422).send({
                error: `Narratives controller.createOrUpdate failed with ${e.message}`,
            })
        }
    }
}
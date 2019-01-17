module.exports = {
    validate: {
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
    },
    decode: {
        string: (string) => decodeURIComponent(string)
    }
     
}
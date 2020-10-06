module.exports = {
    fillAllFields(req, res, next) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos!')
            }
        }
    }
}
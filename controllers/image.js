const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '8a3167cf476440d4943f81df76da6731'
});


const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('API Error!'))
}

const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('Error Getting Entries!'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}
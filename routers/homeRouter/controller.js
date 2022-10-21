
const homePage = (req, res) =>{
    try {
        res.status(200).send({"result":"succefully login", "status":"true"})
    } catch (error) {
        res.status(404).send({"error":"errrrrrrrrrrrrrrrrrrrrroooooooorrrrrr!!!!!", "status":"false"})
    }
}
module.exports = homePage
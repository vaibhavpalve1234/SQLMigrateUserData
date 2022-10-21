
const homePage = (req, res) =>{
    try {
        res.status(200).send({"result":"User insert succefully", "status":"true"})
    } catch (error) {
        res.status(404).send({"error":"errrrrrrrrrrrrrrrrrrrrroooooooorrrrrr!!!!!", "status":"false"})
    }
}
module.exports = homePage
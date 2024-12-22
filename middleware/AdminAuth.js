
let jwt = require("jsonwebtoken");

let secret = "adkjfkj233j5j2355533kj2k3j2k2jfas5"

module.exports = function login(req, res, next) {
    const authtoken = req.headers['authorization'];

    if (authtoken != undefined) {
        const bearer = authtoken.split(' ');
        let token = bearer[1];

        try {
            let decoded = jwt.verify(token, secret);
            console.log(decoded)

            if (decoded.role == 1) {
                next();
            } else {
                res.status(403).send("Você não tem permissão para isso!");
                return;
            }
        } catch (error) {
            res.status(403).send("Você não está autenticado.");
            return;
        }
        


        console.log(decoded)

        next();

    } else {
        
        res.status(403).send("Você não está autenticado.");
        return;
    }
}
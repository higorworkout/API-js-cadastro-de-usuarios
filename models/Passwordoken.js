var knex = require('../database/connection');
var User = require('./User');

class PasswordToken {
    async create(email) {
        let user = await User.findByEmail(email);
        
        if (user != undefined) {
            try {

                let token = Date.now();

                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordtokens");

                return { status: true, token}
            }catch(err) {
                console.log(err)

                return { status: false, err: err }
            }
        } else {
            return { status: false, err: "O e-mail passado não existe no banco de dados!" }
        }

    }

    async validate(token) {
        try{
            let res = await knex.select().where({token: token}).table("passwordtokens");

            if (res.length > 0) {
                let tk = res[0];

                if (tk.used) {
                    return { status: false };
                } else {
                    return { status: true, token: tk };
                }

            } else {
                return { status: false};
            }
        }catch(err) {
            return { status: false, err: err }
        }
    }

    async setUsed(token) {
        await knex.update({ used: 1}).where({ token: token }).table("passwordtokens");
    }
} 


module.exports = new PasswordToken();
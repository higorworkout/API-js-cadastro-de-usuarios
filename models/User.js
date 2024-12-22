var knex = require('../database/connection');

var bcrypt = require('bcrypt');
const Passwordoken = require('./Passwordoken');


class User {

     async findAll() {
        try {
            let res = await knex.select(["id", "email", "role", "name"]).from("users");
            return res;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

     async findById(id) {
        try {
            let res = await knex.select(["id", "email", "role", "name"]).from("users").where({ id: id});
            if (res.length > 0) {
              return res[0];
            } else {
              return undefined;
            }
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

     async findByEmail(email) {
        try {
            let res = await knex.select(["id", "email", "password", "role", "name"]).from("users").where({ email: email});
            if (res.length > 0) {
              return res[0];
            } else {
              return undefined;
            }
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async new(email, password, name) {
        try {
           let hash = await bcrypt.hash(password, 10);

           await knex.insert({ email, password: hash, name, role: 0 }).table("users");
        } catch (error) {
            console.log(error)
        }
    }

    async findEmail(email) {
        try {
            let res = await knex.select("*").from("users").where({ email: email});
            if (res.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error)
           return false; 
        }
    }

    async update(id, email, name, role) {
            let user = await this.findById(id) 

            if (user != undefined) {
                let editUser = {};

                if (email != undefined) {
                    if (email != user.email) {
                        let res = await this.findEmail(email); 

                        if (res == false) {
                            editUser.email = email
                        } else {
                            return { status: false, err: "O email já está cadastrado!"};
                        }
                    }
                }

                if (name != undefined) {
                    editUser.name = name;
                }

                if (role != undefined) {
                    editUser.role = role;
                }
                
           
                try {
                    let res = await knex.update(editUser).from("users").where({ id: id});
                    return {status: true, }

                } catch (error) {
                    return {status: false, err: error}
                }
        } else {
            return { status: false, err: "O usuário não existe!"};
        }
    }

    async delete(id) {
        let user = await this.findById(id);

        if (user != undefined) {
                try {
                    let res = await knex.delete().from("users").where({ id: id});
                    return {status: true }

                } catch (error) {
                    return {status: false, err: error}
                }

        } else {
            return {status: false, err: "O usuário não existe, portanto não pode ser deletado."}
        }
    }

    async changePassword(newPassword, id, token) {

        try {
            let hash = await bcrypt.hash(newPassword, 10);

            await knex.update({ password: hash }).where({ id: id }).table("users");
            await Passwordoken.setUsed(token);
            return {status: true }

        } catch (error) {
            return {status: false, err: error}
        }
    }

};

module.exports = new User();

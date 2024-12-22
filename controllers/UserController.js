var User = require('../models/User');
let PasswordToken = require("../models/Passwordoken");
let jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

let secret = "adkjfkj233j5j2355533kj2k3j2k2jfas5"

class UserController {

    async index(req, res){
        let users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res){
        let id = req.params.id;
        let user = await User.findById(id);

        if (user == undefined) {
            res.status(404).json({});
        } else {
            res.status(200).json(user);
        }
    }

     async create(req, res){
        let { email, name, password } = req.body;
        
        if (email == undefined || name == undefined || password == undefined) {
            res.status(403);
            res.json({ err: "Dados invalido!"});
            return;
        } 

        if (password.length < 6) {
            res.status(403);
            res.json({ err: "Senha com menos de 6 caracteres!"});
            return;
        }

        let emailExists = await User.findEmail(email);

        if (emailExists) {
            res.status(406);
            res.json({ err: "O e-mail já está cadastrado"});
            return;
        }


        await User.new(email, password, name);
        res.status(200);
        res.json({ err: "Usuario cadastrado"});
    }

     async edit(req, res){
        let { id,email, name, role } = req.body;

        let res1 = await User.update(id, email, name, role);

        if (res1 != undefined) {
            if (res1.status) {
                res.status(200).send("tudo ok!!");
            } else {
                res.status(200).json({ err: res1.err });
            }
        } else {
            res.status(406).send("Ocorreu um erro no servidor :~");
        }
     }

    async remove(req, res){
        let id = req.params.id;

        let res1 = await User.delete(id);

        if (res1.status) {
            res.status(200).send("tudo ok!!");
        } else {
            res.status(406).send(res1.err);
        }
    }

    async recoverPassword(req, res){
        let email = req.body.email;
        let result = await PasswordToken.create(email);

        if (result.status) {
            res.status(200).json({token: result.token});
        } else {
            res.status(406).send(result.err);
        }
    }

    async changePassword(req, res) {
       let token = req.body.token;
       let password = req.body.password;
       let istokenValid = await PasswordToken.validate(token);

       if (istokenValid.status) {
          let resp = await User.changePassword(password, istokenValid.token.user_id, istokenValid.token.token);

            if (resp.status) {
                res.status(200).send("Senha alterada");
            }
            
       } else {
            res.status(406).send("token inválido!");
       }
    }

    async login(req, res){
        let { email, password } = req.body;

        let user = await User.findByEmail(email);


        if (user != undefined) {
            let result = await bcrypt.compare(password, user.password)

            if (result) {
                let token = jwt.sign({ email: user.email, role: user.role}, secret);
                
                res.status(200).json({token});
            } else {
                res.status(406).send("Senha Incorreta!");
            }

            res.status(200).json({ status: result});
        } else {
            res.status(406).json({ status: false});
        }

    }

    
}

module.exports = new UserController();
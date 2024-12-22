var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
const AdminAuth = require("../middleware/AdminAuth");

// Home 
router.get('/', HomeController.index);

// User roots
router.get('/user', UserController.index);
router.post('/user', UserController.create);
router.get('/users', AdminAuth, UserController.index);
router.get("/user/:id", AdminAuth, UserController.findUser);
router.put("/user", AdminAuth, UserController.edit);
router.delete("/user/:id", AdminAuth, UserController.remove);
router.post("/recoverpassword", UserController.recoverPassword);
router.post("/changepassword", UserController.changePassword);
router.post("/login", UserController.login);

module.exports = router;

// UUID usado para recuperacão de senha

// passwordokens
// 
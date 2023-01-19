'use strict'

const express = require('express')
const router = express.Router();
var bodyParser = require('body-parser')    
var jsonParser = bodyParser.json();
const { registerUser, loginUser} = require('../controller/controller')
router.use(bodyParser.urlencoded({ extended: false }));
const { routes } = require('../config/index')

router.get("/health", function (req, res) {
  res.status(200).send({ status: 'OK' });
})

router.post("/userRegister",jsonParser, function (req, res) {
    registerUser(req,res)
})

router.use('/user', async function(req,res,next){
    authHeader = req.headers["Authorization"]
    if (typeof req.headers.authorization !== 'string') {
        res.sendStatus(400);
        return;
      } 
      var token = req.headers.authorization.split(' ')[1];
    if(!token) res.status(401).send({status:"ok", message:"Please Send JWT Token"})
    try{
        let userId = await jwt.verify(token, `${routes.token}`, { expiresIn: "2h" })
        req.userId = userId
        next()
    }catch(e){
        if(e.message =="jwt expired")
        {
            let data = await tokenDeleteFunction(req.query.userId)
            if(data) res.status(401).send({status:"ok", data:{message:"Token expired"}})
            else res.status(404).send({status:"ok", data:{message:"User not found"}})
        }
        else{
        console.log(e.message)
        res.status(401).send({status:"ok", data:{message:"Unauthorized"}})
        }
    }
})
router.post("/login",jsonParser, function (req, res) {
     loginUser(req,res)
 })

module.exports = router;
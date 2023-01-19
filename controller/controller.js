'use strict'
const { ArticleUserSchema, ArticleSchema } = require('../schema/schema');
const { getUserId }= require('../utils/utils');
const { tokenDeleteFunction, tokenCheck, passCheck, tokenAddFunction, userLogoutCheck, userLogout }= require('../routes/jwt');
const { routes } = require('../config/index')
const jwt = require('jsonwebtoken')


async function userCheck(regObj){
    try{
        let dbResponse = await ArticleUserSchema.findOne({emailId: regObj.emailId})
        if (dbResponse == null) return {message:"user not found"}
        else if (dbResponse != null && (dbResponse.deletionFlag == true)) return {message:"user not found"}
        else return {message:"user exists"}
    }
    catch(e){
        console.log({ e })
        return false
    }
}

async function userExistsCheck(regObj){
    try{
        let dbResponse = await ArticleUserSchema.findOne({userId: regObj.userId})
        if (dbResponse == null) return {message:"user not found"}
        else if (dbResponse != null && (dbResponse.deletionFlag == true)) return {message:"user not found"}
        else return {message:"user exists"}
    }
    catch(e){
        console.log({ e })
        return false
    }
}


async function registerUser(req, res){
    let regObj = {
        name: req.body.name,
        emailId: req.body.emailId,
        password: req.body.password,
        userId : getUserId(),
        createdAt : new Date(),
    };
    try{
        let ok = await userCheck(regObj);
        if(ok.message =="user exists"){
             res.status(200).send({status:"ok", message:"User already exists with this emailId, Please LogIn instead with your UserId",})
        }
        else if(ok.message =="user not found"){
            let request = new ArticleUserSchema(regObj)
            await request.save()
            res.status(200).send({status:"ok", message:"user registration successful, Please LogIn with your UserId", UserId: regObj.userId})
        }
    }
    catch(e){
        console.log({ e })
        res.status(404).send({ message: "User Registration Failed"})
    }
    }

    async function loginUser(req, res){
        let loginObj= {
            userId: req.body.userId,
            password: req.body.password
        }
        let ok = await userExistsCheck(loginObj)
        if(ok.message != 'user not found'){
            ok = await tokenCheck(loginObj)
            if(!ok){
                ok = await passCheck(loginObj)
                let accessToken
                if(ok){
                    try{
                        accessToken = jwt.sign( {userId: loginObj.userId }, `${routes.token}`)
                        }
                    catch(e){
                        console.log({ e })
                    }
                    loginObj.token = accessToken
                    ok = await tokenAddFunction(loginObj)
                    if(ok) res.status(200).send({status:"ok", data:{message: "user logged in successfully", token: accessToken}})
                    else res.status(404).send({status:"ok", message:"error occured, login again"})   
                }
                else res.status(200).send({status:"ok", message:"password invalid"})
            }
            else res.status(422).send({status:"ok", data:{message:"user already logged in"}})
        }
        else res.status(404).send({status:"error", message:"user does not exist"})
    }
    
async function createArticle(req, res){
    try{
        let articleObj = new ArticleSchema({
            createdAt: new Date(),
            updateAt : new Date(),
            articleId: getArticleId(),
            articleTitle: req.body.title,
            articleContent: req.body.articleContent,
            articleHeading: req.body.heading
        })
        console.log(articleObj)
        await articleObj.save()
        res.status(200).send({  message: "Article Posted successfully", articleId: articleObj.articleId })
    }
    catch(e){
        console.log({ e })
        res.status(404).send({ message: "Article upload Failed"})
    }
}


module.exports = { registerUser, loginUser, createArticle }
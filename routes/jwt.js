const { ArticleUserSchema } = require('../schema/schema');


async function tokenDeleteFunction(userId){
    try{
        tokenExpire = await ArticleUserSchema.updateOne({ userId : userId},{$set : {token: null}})
        if(tokenExpire.modifiedCount) return true
        else return false
    }
    catch(e){
        console.log({ e })
        return false
    }
}

async function tokenCheck(loginObj){
        try{
            loginCheck = await ArticleUserSchema.findOne({userId: loginObj.userId})
            if(!loginCheck.token) return false
            else return true
        }
        catch(e){
            console.log({ e })
            return false
        }
}

async function tokenAddFunction(loginObj){
    try{
        ok = await ArticleUserSchema.updateOne({ userId : loginObj.userId},{$set : {token: loginObj.token}})
        if(ok) return true
        else return false
    }
        catch(e){
            console.log({ e })
            return false
        }
}

async function passCheck(loginObj){
    try{
            passFlag = await ArticleUserSchema.findOne({userId: loginObj.userId})
            if(loginObj.password == passFlag.password) return true
            else return false
        }
        catch(e){
            console.log({ e })
            return false
        }
}

async function userLogoutCheck(logoutObj){
    try{
        logoutCheck = await ArticleUserSchema.findOne({userId : logoutObj.userId })
        if(logoutCheck){
            if(logoutCheck.token) return {data:{message:"success"}}
            else return {data:{message:"failure"}}
        }
        else return {data:{message:"user not found"}}
    }
    catch(e){
        console.log({ e })
        return false
    }
}
async function userLogout(logoutObj){
    try{
        logoutStatus = await ArticleUserSchema.updateOne({ userId : logoutObj.userId},{$set : {token: null}})
        if(logoutStatus.modifiedCount) return true
        else return false
    }
    catch(e){
        console.log({ e })
        return false
    }
}

module.exports = {tokenDeleteFunction, tokenCheck, passCheck, tokenAddFunction, userLogoutCheck, userLogout}
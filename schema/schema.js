const mongoose=require('mongoose')

var Schema = mongoose.Schema

var ArticleUserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    emailId:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        unique:true
    },
    createdAt:{
        type: Date
    },
    deletionFlag:{
        type: Boolean,
        required:true,
        default: false
    },
    token:{
        type: String
    },
    article:[{type: Schema.Types.ObjectId, ref: 'Article'}]
});

var ArticleSchema = new Schema({
    articleId:{
        type: String,
        unique:true
    },
    articleTitle:{
        type: String
    },
    articleContent:{
        type: String
    },
   articleHeading:{
        type: String
    },
    createdAt:{
        type: Date
    },
    userId:{
        
    },
    updatedAt:{
        type: Date
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Article_Comment' }]
})

var ArticleCommentSchema = new Schema({
    commentId:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date
    },
    deletionFlag:{
        type: Boolean,
        required:true,
        default: false
    },
    updatedAt:{
        type: Date
    }
});


var ArticleUserSchema  = mongoose.model('Article_User', ArticleUserSchema);
var ArticleSchema  = mongoose.model('Article', ArticleSchema);
var ArticleCommentSchema = mongoose.model('Article_Comment', ArticleCommentSchema);


module.exports = {
    ArticleUserSchema, ArticleSchema
}
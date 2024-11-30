import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image:{
        type: String,
        default:"https://blog.snappa.com/wp-content/uploads/2017/04/featured-images-fb.png"
    },
    category:{
        type: String,
        default:"uncategorized"
    },
    slug:{
        type: String,
        required: true,
        unique:true
    }
},{
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)
export default Post;
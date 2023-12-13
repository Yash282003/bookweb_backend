const mongoose = require('mongoose');

 const reviewSchema = mongoose.Schema(
   {
     name: { type: String, required: true },
     rating: { type: Number, required: true },
     comment: { type: String, required: true },
     user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
            },
    },
   {
     timestamps: true,
   }
 )

 const productSchema = mongoose.Schema(
   {
     user: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'users',
     },
     uuid:{
      type:String,
      unique:true,
      required:true
     },
     name: {
       type: String,
       required: true,
     },
     image: {
       type: String,
       required: true,
     },
     brand: {
       type: String,
     },
     category: {
       type: String,
     },
     description: {
       type: String,
     },
     reviews: [reviewSchema],
     rating: {
       type: Number,
       default: 0,
     },
     numReviews: {
       type: Number,
       default: 0,
     },
     price: {
       type: Number,
       default: 0,
     },
     countInStock: {
       type: Number,
       default: 0,
     },
   },
   {
     timestamps: true,
   }
 )

 const Product = mongoose.model('Product', productSchema)
 const Review = mongoose.model('Review',reviewSchema)

 module.exports = {Product,Review}
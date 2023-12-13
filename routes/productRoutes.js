const express = require("express");
const {
  getProductForReview,
  getProductById,
  createProductReview,
  getUserReviews
} = require( '../controllers/productController.js');


 const router = express.Router()

 
 router.route('products',getProductForReview )
 router.route(':id/reviews', createProductReview)
 router.route(':id',getProductById)
 router.route(':user_id/reviews',getUserReviews)
 

 module.exports= router;
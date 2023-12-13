const express = require("express");

const {
  getProductForReview,
  getProductById,
  createProductReview,
  getUserReviews
} = require( '../controllers/productController.js');
const users = require("../models/Users.js");

 const router = express.Router()
 router.route("register", async (req, resp) => {
  try {
    let user = new users(req.body);
    let result = await user.save();
    result=result.toObject();
    delete result.password;
    resp.send(result)
  } catch (error) {
    console.error("Error saving user:", error);
    resp.status(500).send("Error saving user");
  }
});
router.route("login", async (req, resp) => {
  try {
    const user = await users.findOne({ email: req.body.email, password: req.body.password }).select("-password");
    if (user) {
      resp.send(user);
    } else {
      resp.send({ result: 'no user found' });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    resp.status(500).send({ result: 'error finding user' });
  }
});

 
 router.route('products',getProductForReview )
 router.route(':id/reviews', createProductReview)
 router.route(':id',getProductById)
 router.route(':user_id/reviews',getUserReviews)
 

 module.exports= router;
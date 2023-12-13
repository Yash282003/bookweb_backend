const productRoutes =require('./routes/productRoutes.js');
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");

const users = require("./models/Users");
const {getProductForReview, createProductReview, updateProductReview,getUserReviews} = require('./controllers/productController');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/',productRoutes)
const DB =
  "mongodb+srv://mailyashika28:yashmongo@cluster0.hv29e74.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("hogayaa");
  });
app.post("/register", async (req, resp) => {
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
app.get("/hello", async (req, resp) => {
  try {
   
    resp.send("hello ")
  } catch (error) {
    console.error("Error saving user:", error);
    resp.status(500).send("Error saving user");
  }
});
app.post("/login", async (req, resp) => {
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
app.get('/products',getProductForReview);
app.post('/:id/reviews',createProductReview)
app.patch('/:id/reviews/update', updateProductReview)
app.get('/:userId/reviews',getUserReviews)
app.listen(5000);
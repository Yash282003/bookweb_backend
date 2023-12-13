const { Product, Review } = require("../models/Products");
const fetchDataFromAPI = require("../utils/fetchProduct");
const getProductForReview = async (req, res) => {
  const { searchKey } = req.query;
  const fetchData = async (searchKey) => {
    let url;
    if (searchKey) {
      url = `https://www.googleapis.com/books/v1/volumes?q=${searchKey}&key=AIzaSyBJ7z0sYcbjleUEsvwZudbLaOSfVEQ_33Y`;
    } else {
      url = `https://www.googleapis.com/books/v1/volumes?q=love&key=AIzaSyBJ7z0sYcbjleUEsvwZudbLaOSfVEQ_33Y`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data.items);
      res.send(data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchData(searchKey);
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  console.log(productId);
  const productData = await fetchDataFromAPI(productId);
  console.log(productData);

  const product = await Product.findOne({ uuid: productId });
  // res.send(productData)

  if (product) {
    
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.body.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: "Product already reviewed" });
      }
      const review = {
        name: req.body.user.name,
        rating: Number(rating),
        comment,
        user: req.body.user._id,
      };
      const reviewModel = new Review(review);
      await reviewModel.save();
      product.reviews.push(review);
  
      product.numReviews = product.reviews.length;
  
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
  
      await product.save();
      // res.status(201).json({ message: "Review added" });
      res.send(product);
    } else {
      const product = new Product({
        user: req.body.user._id,
        uuid: productId,
        name: productData.volumeInfo.title,
        image: productData.volumeInfo.imageLinks.thumbnail,
        description: productData.volumeInfo.description,
      });
  
      // Save the product to the database
      const newProduct = await product.save();
      const alreadyReviewed = newProduct.reviews.find(
        (r) => r.user.toString() === req.body.user._id.toString()
      );
  
      if (alreadyReviewed) {
        res.status(400).json({ message: "Product already reviewed" });
      }
  
      const review = {
        name: req.body.user.name,
        rating: Number(rating),
        comment,
        user: req.body.user._id,
      };
      const reviewModel = new Review(review);
      await reviewModel.save();
      newProduct.reviews.push(review);
  
      newProduct.numReviews = newProduct.reviews.length;
  
      newProduct.rating =
        newProduct.reviews.reduce((acc, item) => item.rating + acc, 0) /
        newProduct.reviews.length;
  
      await newProduct.save();
      res.send(newProduct);
    
  
    // fetchDataFromAPI(productId);
    }

   
};
const updateProductReview = async (req, res) => {
  const { comment, rating } = req.body;
  const productId = req.params.id;
  const product = await Product.findOne({ uuid: productId });
  if (product) {
    const UpdateReview = product.reviews.find(
      (review) => review.user.toString() === req.body.user._id.toString()
    );

    if (UpdateReview) {
      UpdateReview.comment = comment;
      UpdateReview.rating = rating;
      await product.save();

      res.status(200).json({ message: "Review updated" });
    } else {
      res.status(404).json({ message: "Review not updated" });
    }
  }
};
const getUserReviews = async (req, res) => {
  const userId = req.params.userId; //same as the route defined in index.js

  try {
    const reviews = await Review.find({ user: userId });

    if (reviews.length === 0) {
      res.status(404).json({ message: "No reviews found for this user." });
    } else {
      let commentArr = [];
      reviews.forEach((e) => commentArr.push(e.comment));
      res.status(200).json(commentArr);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user reviews." });
  }
};
module.exports = {
  getProductForReview,
  createProductReview,
  updateProductReview,
  getUserReviews,
};

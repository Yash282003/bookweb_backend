const fetchDataFromAPI = async (productId) => {
    const url = `https://www.googleapis.com/books/v1/volumes/${productId}?key=AIzaSyBJ7z0sYcbjleUEsvwZudbLaOSfVEQ_33Y`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const productData = await response.json();
      // console.log(productData)
      return productData;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  };


  module.exports = fetchDataFromAPI
const errormiddleware = (err, req, res, next) => {
  //create a subscription -> middleware(for renewal date) -> middleware(check for errors) -> next -> controller

  try {
    let error = {...err};
    error.message = err.message;

    //Mongoose bad ObjectId
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new Error(message);
      error.statusCode = 404;
    }
    //moongose duplicate key
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new Error(message);
      error.statusCode = 400;
    }

    //Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((value) => value.message)
        .join(", ");
      error = new Error(message);
      error.statusCode = 400;
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({success: false, error: error.message || "Internal Server Error"});
  }
};

export default errormiddleware;

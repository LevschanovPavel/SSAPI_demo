const ErrorResponse = require("../utils/error-respons")

const errorHandler = (err, req, res, next) =>{
  let error = {...err}
  error.message = err.message
  //Log to console for DEV
   console.log(err.message) 

  //Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resourse not found with id ${err.value} `
    error = new ErrorResponse(message,404)
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = `That email is already registered`
    error = new ErrorResponse(message, 400)
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  })
}

module.exports = errorHandler
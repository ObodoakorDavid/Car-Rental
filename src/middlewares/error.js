const errorMiddleware = (err, req, res, next) => {
  let statusCode =
    err.statusCode || (res.statusCode == 200 ? 500 : res.statusCode);
  let errorMessage =
    err.message || "Something went wrong, please try again later";

  // Handling Mongoose validation errors
  if (err.errors) {
    const errorFields = Object.keys(err.errors);
    console.log(errorFields);
    errorFields.forEach((field) => {
      if (
        field === "email" ||
        field === "firstName" ||
        field === "lastName" ||
        field === "nin" ||
        field === "phoneNumber" ||
        field === "password"
      ) {
        errorMessage = err.errors[field].message;
        statusCode = 400;
      }
    });

    // Handling Mongoose CastError for fare
    const { fare } = err.errors;
    if (fare && fare.name === "CastError") {
      errorMessage = "fare should be a number";
      statusCode = 400;
    }
  }

  //   console.log(err.message);

  // Handling MongoDB duplicate key error
  if (err.code === 11000) {
    const { email, phoneNumber, plateNumber } = err.keyValue;
    if (email) {
      errorMessage = "User with this email already exists";
    }
    if (phoneNumber) {
      errorMessage = "User with this phone number already exists";
    }
    if (plateNumber) {
      errorMessage = "Plate number already taken";
    }
    statusCode = 400;
  }

  console.error(err.message); // Logging the error for debugging
  //   console.error(err.stack); // Logging the error for debugging

  res.status(statusCode).json({ message: errorMessage });
};

export default errorMiddleware;

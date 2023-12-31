function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);
  res.status(500);
  res.json({ error: err, message: err.message });
}

export default errorHandler;

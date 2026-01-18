const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  req.session.views = (req.session.views || 0) + 1;
  console.log("SESSION: ", req.session, req.cookies);
  if (req.session.views > 3) {
    res.cookie("x", "123");
    return res.status(404).json({ message: "ERROR" });
  } else {
    next(); // Pass control to the next middleware or route handler
  }
};

export default loggerMiddleware;

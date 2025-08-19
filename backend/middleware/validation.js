export const validateMessage = (req, res, next) => {
  if (!req.body.message) {
    return res.status(400).json({ error: "Message field is required" });
  }
  next();
};

// export default function errorHandler(err, req, res, next) {
//   console.error("🔥 Backend error:", err.stack || err.message);
//   res.status(500).json({ error: err.message || "Backend error" });
// }
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
};

// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization; // token ที่ client ส่งมา
  // logic ที่บอกว่าถ้าไม่มี token แนบมากับ header ให้ return ข้อความกลับไปบอก client ว่าให้ส่ง token
  if (!token || !token.startsWith(`Bearer`)) {
    return res.status(404).json({ message: "Please send me a JWT token" });
  }
  // ใช้ Function jwt.verify จาก Package jsonwebtoken เพื่อตรวจสอบว่า Token นั้นมีความถูกต้องหรือหมดอายุหรือไม่
  const tokenWithoutBearer = token.split(" ")[1];

  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.json({ message: "JWT token is invalid" });
    }
    req.user = payload;
    next();
  });
};

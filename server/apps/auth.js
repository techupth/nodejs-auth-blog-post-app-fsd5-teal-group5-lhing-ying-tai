import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  // รับตัว body ที่ client ส่งเข้ามา
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  // โค้ดที่ทำให้ password ที่ถูกเข้ารหัสแล้วคาดเดาได้ยากขึ้น
  const salt = await bcrypt.genSalt(10);
  // นำ password มา reassign เพื่อเข้ารหัส
  user.password = await bcrypt.hash(user.password, salt);

  // เลือก collection แล้ว insert ข้อมูล user เข้าไปใน collection แล้ว return ข้อความบอก client ว่าสร้างข้อมูลเรียบร้อย
  const collection = db.collection("users");
  await collection.insertOne(user);

  return res.json({ message: "User has been created successfully" });
});
// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  // ตรวจสอบ username ก่อนว่า username ที่ client ส่งมา มีอยู่ใน DB มั้ย
  const user = await db
    .collection("users")
    .findOne({ username: req.body.username });

  // logic ที่บอกว่า ถ้าไม่มี user อยู่ใน DB ให้ return ข้อความว่าไม่มี user กลับไปบอก client
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  // ถ้ามี user อยู่ในระบบ จะเอา password ที่ client ส่งมา มาเปรียบเทียบกันกับใน DB
  // bcrypt.compare เป็น Function ที่สามารถเปรียบเทียบระหว่าง Password แบบธรรมดา กับ Password ที่ถูก Encrypt แล้วได้
  // ผลจะ return true = ตรงกัน & false = ไม่ตรงกัน
  const isValidPassword = await bcrypt.compare(
    req.body.password, // password จาก client ที่ส่งมา
    user.password // password จาก DB
  );

  // ในกรณีไม่ตรง จะสร้าง logic ให้ return ข้อความว่า passwaord ไม่ถูกต้อง
  if (!isValidPassword) {
    return res.status(404).json({ message: "password not valid" });
  }

  // ถ้า user & password ตรง ให้สร้าง token
  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "900000",
    }
  );

  return res.json({ message: "login successfully", token });
});

export default authRouter;

import axios from "axios";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    // 🐨 Todo: Exercise #6
    //  ให้เขียน Logic ในการแนบ Token เข้าไปใน Header ของ Request
    // เมื่อมีการส่ง Request จาก Client ไปหา Server
    // ภายใน Callback Function axios.interceptors.request.use

    // callback function นี้ จะ execute ทุกครั้งที่ axios มีการสร้าง request ไปหา server
    // ส่วนที่ตรวจสอบว่ามี Token อยู่ใน Local Storage หรือไม่ แล้วจะ convert เป็น Boolean
    const hasToken = Boolean(window.localStorage.getItem("token"));

    // logic ที่บอกว่า ถ้ามี Token อยู่ใน Local Storage ก็ให้เอา Token นี้ใส่ไปใน Property Authorization ของ Object req.headers
    if (hasToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };
    }

    return req;
  });

  axios.interceptors.response.use(
    (req) => {
      return req;
    },
    (error) => {
      // 🐨 Todo: Exercise #6
      //  ให้เขียน Logic ในการรองรับเมื่อ Server ได้ Response กลับมาเป็น Error
      // โดยการ Redirect ผู้ใช้งานไปที่หน้า Login และลบ Token ออกจาก Local Storage
      // ภายใน Error Callback Function ของ axios.interceptors.response.use
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        window.localStorage.removeItem("token"); // ลบ token
        window.location.replace("/"); // กลับไปหน้า login
      }
      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;

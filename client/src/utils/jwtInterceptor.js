import axios from "axios";

function jwtInterceptor() {
axios.interceptors.request.use((req) => {
// 🐨 Todo: Exercise #6
// ให้เขียน Logic ในการแนบ Token เข้าไปใน Header ของ Request
// เมื่อมีการส่ง Request จาก Client ไปหา Server
// ภายใน Callback Function axios.interceptors.request.use

const hasToken = Boolean(window.localStorage.getItem("token")); // เป็นส่วนที่ตรวจสอบว่ามี Token อยู่ใน Local Storage หรือไม่
//ทุก req ที่ส่งหา server จะมี token แนบไปใน req.headers ใน key Authorization เช็คที่ f12 - network - fetch/XHR ดูตรง header ถ้ามี Authorization: Bearer ... แปลว่าถูกต้อง
//ถ้ามี Token อยู่ใน Local Storage ก็ให้เอา Token นี้ใส่ไปใน Property Authorization ของ Object req.headers
if (hasToken) {
req.headers = {
...req.headers,
Authorization: `Bearer ${window.localStorage.getItem("token")}`,//ถ้ามี token ใน local storage จะยัดบรรทัดนี้เข้าไป
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
// ให้เขียน Logic ในการรองรับเมื่อ Server ได้ Response กลับมาเป็น Error
// โดยการ Redirect ผู้ใช้งานไปที่หน้า Login และลบ Token ออกจาก Local Storage
// ภายใน Error Callback Function ของ axios.interceptors.response.use  5555

if (
error.response.status === 401 &&
error.response.statusText === "Unauthorized"
) {
window.localStorage.removeItem("token");
window.location.replace("/");
}

//return Promise.reject(error); //อันเก่า
}
);
}

export default jwtInterceptor;
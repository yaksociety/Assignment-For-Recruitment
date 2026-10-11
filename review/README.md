# ข้อ 3: Pull Request #57 — Export tasks as CSV

**ผู้เปิด PR:** Beam
**คำอธิบายจากผู้เปิด PR:**

> เพิ่มปุ่ม Export CSV บนหน้า Board ให้ผู้ใช้ดาวน์โหลดงานทั้งหมดของทีมไปเปิดใน Excel/Google Sheets ได้ ใช้ AI ช่วยเขียน ลองกดแล้วได้ไฟล์ถูกต้อง query ทีเดียวไม่มี N+1 ด้วย ฝากรีวิวหน่อยครับ จะได้ merge ก่อน demo วันศุกร์

## ไฟล์

- [`csv-export.patch`](./csv-export.patch) — diff ของ PR นี้

ดูโค้ดได้จากไฟล์ patch โดยตรง หรือ apply เพื่อลองรันก็ได้

```bash
git checkout -b review/csv-export
git apply review/csv-export.patch
```

## สิ่งที่ต้องส่ง

เขียนลงใน `review/REVIEW.md` เหมือนรีวิว PR จริง เช่น อ้างอิงไฟล์และบรรทัด บอกว่าข้อไหนต้องแก้ก่อน merge ข้อไหนเป็นแค่ข้อเสนอแนะ และสุดท้ายคุณจะ **Approve** หรือ **Request changes**

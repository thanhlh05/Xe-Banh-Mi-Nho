// src/data/customers.js
//
// File này chỉ chứa DỮ LIỆU MẪU của khách hàng trong game.
// Không có logic, không dùng class, không dùng random.

// Các loại khách hàng hợp lệ (type):
// - student: Học sinh / sinh viên
// - office_worker: Nhân viên văn phòng
// - xe_om_driver: Tài xế xe ôm
// - neighborhood_elder: Người lớn tuổi trong khu phố
// - construction_worker: Công nhân xây dựng

const CUSTOMERS = [
  {
    id: "customer_001",
    name: "Minh",
    type: "student",
    note: "Học sinh gần trường, hay mua bánh mì không vào buổi sáng.",
  },
  {
    id: "customer_002",
    name: "Chị Hoa",
    type: "office_worker",
    note: "Nhân viên văn phòng, thường mua vào giờ nghỉ trưa.",
  },
  {
    id: "customer_003",
    name: "Chú Tư",
    type: "xe_om_driver",
    note: "Tài xế xe ôm quen thuộc, ghé mua nhanh giữa các chuyến chạy xe.",
  },
  {
    id: "customer_004",
    name: "Bà Năm",
    type: "neighborhood_elder",
    note: "Người lớn tuổi trong khu phố, thích ăn nhạt, ít gia vị.",
  },
  {
    id: "customer_005",
    name: "Anh Dũng",
    type: "construction_worker",
    note: "",
  },
];

export { CUSTOMERS };
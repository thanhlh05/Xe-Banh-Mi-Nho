// src/data/ingredients.js
//
// File này chỉ chứa DỮ LIỆU TĨNH mô tả các nguyên liệu / vật tư trong game.
// Không có logic, không xử lý UI, không xử lý inventory, không xử lý tiền.
//
// Có 2 nhóm:
// - "fresh": nguyên liệu tươi, dùng trong ngày, hết ngày sẽ bị bỏ đi
//   (không tự động chuyển sang ngày hôm sau).
// - "consumable": vật tư tiêu hao, dùng dần theo số lượt sử dụng
//   (ví dụ một chai nước tương có thể dùng được nhiều lần).

const INGREDIENTS = {
  // ----- Fresh ingredients (nguyên liệu tươi) -----
  bread: {
    id: "bread",
    name: "Bánh mì",
    category: "fresh",
  },
  meat: {
    id: "meat",
    name: "Thịt",
    category: "fresh",
  },
  cha: {
    id: "cha",
    name: "Chả",
    category: "fresh",
  },
  pate: {
    id: "pate",
    name: "Pate",
    category: "fresh",
  },
  vegetables: {
    id: "vegetables",
    name: "Rau",
    category: "fresh",
  },
  cucumber: {
    id: "cucumber",
    name: "Dưa leo",
    category: "fresh",
  },
  egg: {
    id: "egg",
    name: "Trứng",
    category: "fresh",
},
  

  // ----- Consumables (vật tư tiêu hao) -----
  soy_sauce: {
    id: "soy_sauce",
    name: "Nước tương",
    category: "consumable",
  },
  chili_sauce: {
    id: "chili_sauce",
    name: "Tương ớt",
    category: "consumable",
  },
  ketchup: {
    id: "ketchup",
    name: "Tương cà",
    category: "consumable",
  },
  cooking_oil: {
    id: "cooking_oil",
    name: "Dầu ăn",
    category: "consumable",
  },
  salt: {
    id: "salt",
    name: "Muối",
    category: "consumable",
  },
  pepper: {
    id: "pepper",
    name: "Tiêu",
    category: "consumable",
  },
};

// Export để các file khác sử dụng.
// Ví dụ cách dùng ở file khác:
//   import { INGREDIENTS } from "../data/ingredients.js";
//   console.log(INGREDIENTS.bread.name); // "Bánh mì"
export { INGREDIENTS };
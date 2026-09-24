// src/data/recipes.js
//
// File này chỉ chứa DỮ LIỆU TĨNH về các món bánh mì trong game và
// danh sách ID nguyên liệu (tham chiếu tới INGREDIENTS trong
// src/data/ingredients.js) cần thiết để làm từng món.
//
// File này KHÔNG xử lý logic chế biến, KHÔNG xử lý inventory,
// KHÔNG xử lý giá tiền. Những phần đó sẽ được xử lý ở các task khác.

const RECIPES = {
  plain: {
    id: "plain",
    name: "Bánh mì không",
    ingredients: ["bread"],
  },
  meat: {
    id: "meat",
    name: "Bánh mì thịt",
    ingredients: ["bread", "meat", "vegetables", "cucumber"],
  },
  cha: {
    id: "cha",
    name: "Bánh mì chả",
    ingredients: ["bread", "cha", "vegetables", "cucumber"],
  },
  pate: {
    id: "pate",
    name: "Bánh mì pate",
    ingredients: ["bread", "pate", "vegetables", "cucumber"],
  },
  egg: {
    id: "egg",
    name: "Bánh mì trứng",
    ingredients: ["bread", "egg", "vegetables", "cucumber"],
  },
  special: {
    id: "special",
    name: "Bánh mì đặc biệt",
    ingredients: [
      "bread",
      "meat",
      "cha",
      "pate",
      "egg",
      "vegetables",
      "cucumber",
    ],
  },
};

// Export để các file khác sử dụng.
// Ví dụ cách dùng ở file khác:
//   import { RECIPES } from "../data/recipes.js";
//   console.log(RECIPES.meat.ingredients); // ["bread", "meat", "vegetables", "cucumber"]
export { RECIPES };
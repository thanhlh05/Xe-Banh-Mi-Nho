// src/data/orders.js
//
// File này chỉ chứa DỮ LIỆU MẪU của đơn hàng trong game.
// Mỗi order chỉ tham chiếu tới một customerId (trong CUSTOMERS,
// src/data/customers.js) và một recipeId (trong RECIPES,
// src/data/recipes.js). Order không lặp lại danh sách nguyên liệu.
//
// Không có logic, không dùng class, không dùng random.

// Các recipeId hợp lệ hiện tại (tham khảo từ src/data/recipes.js):
// plain, meat, cha, pate, egg, special

const SAMPLE_ORDERS = [
  {
    id: "order_001",
    customerId: "customer_001",
    recipeId: "plain",
  },
  {
    id: "order_002",
    customerId: "customer_002",
    recipeId: "meat",
  },
  {
    id: "order_003",
    customerId: "customer_003",
    recipeId: "cha",
  },
  {
    id: "order_004",
    customerId: "customer_004",
    recipeId: "pate",
  },
  {
    id: "order_005",
    customerId: "customer_005",
    recipeId: "egg",
  },
  {
    id: "order_006",
    customerId: "customer_002",
    recipeId: "special",
  },
];

export { SAMPLE_ORDERS };
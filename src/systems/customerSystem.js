// src/systems/customerSystem.js
//
// File này chứa các hàm để TRA CỨU thông tin khách hàng, dựa trên
// dữ liệu mẫu CUSTOMERS (src/data/customers.js).
//
// File này KHÔNG xử lý UI, LocalStorage, gameState, tiền, rating hay order.

import { CUSTOMERS } from "../data/customers.js";

// Tìm khách hàng theo customerId. Nếu không tìm thấy thì throw Error.
function getCustomerById(customerId) {
  const foundCustomer = CUSTOMERS.find(
    (customer) => customer.id === customerId
  );

  if (!foundCustomer) {
    throw new Error(
      `customerSystem: customerId "${customerId}" không tồn tại trong CUSTOMERS.`
    );
  }

  return foundCustomer;
}

// Trả về toàn bộ danh sách khách hàng.
function getAllCustomers() {
  return CUSTOMERS;
}

// Kiểm tra xem customerId có tồn tại trong CUSTOMERS hay không.
function isKnownCustomer(customerId) {
  const foundCustomer = CUSTOMERS.find(
    (customer) => customer.id === customerId
  );

  return foundCustomer !== undefined;
}

// Export để các file khác sử dụng.
export { getCustomerById, getAllCustomers, isKnownCustomer };
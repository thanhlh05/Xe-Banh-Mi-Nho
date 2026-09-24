const APP_SELECTOR = "#app";

function getAppElement() {
  const appElement = document.querySelector(APP_SELECTOR);

  if (!appElement) {
    throw new Error(
      'uiRenderer: không tìm thấy phần tử "#app" trong index.html.'
    );
  }

  return appElement;
}

function renderHTML(html) {
  if (typeof html !== "string") {
    throw new Error(
      "uiRenderer: html phải là một chuỗi."
    );
  }

  const appElement = getAppElement();

  appElement.innerHTML = html;

  return appElement;
}

function clearScreen() {
  const appElement = getAppElement();

  appElement.innerHTML = "";

  return appElement;
}

function createElement(tagName, options = {}) {
  if (typeof tagName !== "string" || tagName.length === 0) {
    throw new Error(
      `uiRenderer: tagName phải là chuỗi không rỗng, nhận được "${tagName}".`
    );
  }

  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }

  if (options.id) {
    element.id = options.id;
  }

  return element;
}

function formatMoney(amount) {
  if (!Number.isFinite(amount)) {
    throw new Error(
      `uiRenderer: amount phải là một số hợp lệ, nhận được "${amount}".`
    );
  }

  return `${amount.toLocaleString("vi-VN")}đ`;
}

export {
  renderHTML,
  clearScreen,
  createElement,
  formatMoney,
};
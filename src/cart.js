// 购物车模块

const cart = [];

function addToCart(productId, name, price, quantity) {
  // 检查商品是否已在购物车中
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    // 累加数量，基于购物车内的真实值而非外部可能持有的引用
      existingItem.quantity += quantity;
      return existingItem;
  }

  const newItem = {
    productId,
    name,
    price,
    quantity,
  };
  cart.push(newItem);
  return newItem;
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.productId === productId);
  if (index === -1) {
    return { success: false, message: 'Item not found in cart' };
  }
  const removed = cart.splice(index, 1);
  return { success: true, removed: removed[0] };
}

function getCartTotal() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
  }
  return total;
}

function getCart() {
  return cart;
}

function clearCart() {
  cart.length = 0;
}

module.exports = { addToCart, removeFromCart, getCartTotal, getCart, clearCart };

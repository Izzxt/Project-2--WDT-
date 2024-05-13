// Get DOM elements
const cartIcon = document.getElementById('cart-count');
const cartTableBody = document.querySelector('#cart-table tbody');
const totalItemsElement = document.getElementById('total-items');
const totalPriceElement = document.getElementById('total-price');
let currentTop = 20;

// Get cart from local storage or initialize an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update local storage and cart icon
function updateLocalStorageAndCartIcon() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIcon();
}

// Function to find a product in the cart
function findProductInCart(productId) {
  return cart.find(product => product.id === productId);
}

// Function to update the cart icon
function updateCartIcon() {
  const totalQuantity = calculateTotalQuantity();
  cartIcon.style.visibility = totalQuantity === 0 ? 'hidden' : 'visible';
  cartIcon.textContent = totalQuantity === 0 ? '' : totalQuantity;
}

// Function to calculate total quantity
function calculateTotalQuantity() {
  return cart.reduce((total, product) => total + product.quantity, 0);
}

// Function to update total items
function updateTotalItems() {
  if (!totalItemsElement) return console.error('No total items element found');
  totalItemsElement.textContent = calculateTotalQuantity();
}

// Function to calculate total price
function calculateTotalPrice() {
  return cart.reduce((total, product) => total + product.price * product.quantity, 0);
}

// Function to update total price
function updateTotalPrice() {
  if (!totalPriceElement) return console.error('No total price element found');
  totalPriceElement.textContent = calculateTotalPrice().toFixed(2);
}

// Function to create a row for a product
function createProductRow(product) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${product.name}</td>
    <td>$${product.price}</td>
    <td><input type="number" class="quantity-input" value=${product.quantity}></td>
    <td>
      <button class="btn btn-danger remove-from-cart" data-id="${product.id}">Remove</button>
    </td>
  `;

  const quantityInput = row.getElementsByClassName('quantity-input')[0];
  quantityInput.addEventListener('change', (e) => {
    product.quantity = parseInt(e.target.value, 10);

    if (product.quantity <= 0) {
      const productIndex = cart.findIndex(p => p.id === product.id);
      if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        row.remove();
        showToast('Removed product from the cart');
      }
    }

    updateLocalStorageAndCartIcon();
    updateTotalItems();
    updateTotalPrice();
  });

  return row;
}

// Function to initialize the cart table
function initializeCartTable() {
  if (cart.length === 0) {
    cartTableBody.innerHTML = '<tr><td colspan="4" align="center"><b>Your cart is empty</b></td></tr>';
    return;
  }

  cart.forEach(product => {
    const row = createProductRow(product);
    cartTableBody?.appendChild(row);
  });
}

// Function to handle checkout cart
function checkoutCart() {
  if (cart.length === 0) {
    showToast('Your cart is empty');
  } else {
    showToast('Successfully checked out the cart');
    cart = [];
    updateLocalStorageAndCartIcon();
    cartTableBody.innerHTML = '';
    initializeCartTable();
    updateTotalItems();
    updateTotalPrice();
  }
}

// Function to handle add to cart
function handleAddToCart(e) {
  const productId = e.target.dataset.id;
  const productName = e.target.dataset.name;
  const productPrice = e.target.dataset.price;

  const existingProduct = findProductInCart(productId);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
  }
  
  showToast('Added product to the cart');
  updateLocalStorageAndCartIcon();
}


// Function to create a toast message
function showToast(message, duration = 2000) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;

  document.body.appendChild(toast);

  // Add the show class after a short delay to trigger the transition
  setTimeout(() => {
    toast.classList.add('show');

    // Set the top style to the current top position
    toast.style.top = `${currentTop}px`;

    // Increase the current top position by the height of the toast plus some margin
    currentTop += toast.offsetHeight + 20;
  }, 100);

  setTimeout(() => {
    toast.classList.add('hide');

    // Decrease the current top position when the toast is removed
    currentTop -= toast.offsetHeight + 20;

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500); // Animation duration
  }, duration);
}

// Function to handle remove from cart
function handleRemoveFromCart(e) {
  const productId = e.target.dataset.id;
  const productIndex = cart.findIndex(product => product.id === productId);
  if (productIndex !== -1) {
    cart.splice(productIndex, 1);
    updateLocalStorageAndCartIcon();
    e.target.closest('tr').remove();

    updateTotalItems();
    updateTotalPrice();

    showToast('Removed product from the cart');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeCartTable();
  updateCartIcon();
  updateTotalItems();
  updateTotalPrice();
});

// Event listener for adding and removing from cart and checkout
document.addEventListener('click', (e) => {
  if (e.target.matches('.add-to-cart')) {
    handleAddToCart(e);
  } else if (e.target.matches('.remove-from-cart')) {
    handleRemoveFromCart(e);
  } else if (e.target.matches('.checkout-cart')) {
    checkoutCart();
  }
});
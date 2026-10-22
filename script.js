const products = [
  {
    id: 1,
    name: "Blush Rose Bouquet",
    category: "Roses",
    price: 180,
    rating: 4.9,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Pastel Garden Mix",
    category: "Bouquets",
    price: 220,
    rating: 4.8,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Classic Red Roses",
    category: "Roses",
    price: 250,
    rating: 5.0,
    badge: "CLASSIC",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Peace Lily Plant",
    category: "Plants",
    price: 150,
    rating: 4.7,
    badge: "EASY CARE",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Sunny Days Bouquet",
    category: "Bouquets",
    price: 195,
    rating: 4.8,
    badge: "FRESH PICK",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Pink Rose Collection",
    category: "Roses",
    price: 210,
    rating: 4.9,
    badge: "LOVED",
    image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Mini Green Garden",
    category: "Plants",
    price: 130,
    rating: 4.6,
    badge: "NATURAL",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Thoughtful Gift Box",
    category: "Gifts",
    price: 175,
    rating: 4.8,
    badge: "GIFT IDEA",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&q=80"
  }
];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilters = document.getElementById("category-filters");
const emptyMessage = document.getElementById("empty-message");

const cartButton = document.getElementById("cart-button");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartButton = document.getElementById("close-cart");
const closeCartBackdrop = document.getElementById("close-cart-backdrop");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartHeadingCount = document.getElementById("cart-heading-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const toast = document.getElementById("toast");

let activeCategory = "All";
let cart = [];
let toastTimer;

function formatPrice(price) {
  return `GH₵${price.toFixed(2)}`;
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filteredProducts.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x700/f4eee7/315b45?text=BloomCart';"
        >
        <span class="product-badge">${product.badge}</span>
        <button
          class="add-to-cart"
          type="button"
          data-add="${product.id}"
          aria-label="Add ${product.name} to cart"
        >+ Add to basket</button>
      </div>

      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <div class="product-rating" aria-label="${product.rating} out of 5 stars">
          ★★★★★ <span>${product.rating.toFixed(1)}</span>
        </div>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button
            class="mobile-add"
            type="button"
            data-add="${product.id}"
            aria-label="Add ${product.name} to cart"
          >+ Add</button>
        </div>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filteredProducts.length !== 0;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to your basket.`);
}

function updateQuantity(productId, change) {
  const item = cart.find((product) => product.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((product) => product.id !== productId);
  renderCart();
  showToast("Item removed from your basket.");
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartHeadingCount.textContent = `(${totalItems})`;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <p class="cart-empty">Your basket is empty. Find something lovely! ✿</p>
    `;
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${formatPrice(item.price * item.quantity)}</p>
        <div class="quantity-controls">
          <button type="button" data-decrease="${item.id}" aria-label="Decrease ${item.name} quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-increase="${item.id}" aria-label="Increase ${item.name} quantity">+</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove="${item.id}">Remove</button>
    </article>
  `).join("");
}

function openCart() {
  cartOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  closeCartButton.focus();
}

function closeCart() {
  cartOverlay.hidden = true;
  document.body.style.overflow = "";
  cartButton.focus();
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;

  categoryFilters.querySelectorAll(".filter-button").forEach((filter) => {
    const isActive = filter === button;
    filter.classList.toggle("active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });

  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

cartItemsContainer.addEventListener("click", (event) => {
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const removeButton = event.target.closest("[data-remove]");

  if (increaseButton) {
    updateQuantity(Number(increaseButton.dataset.increase), 1);
  } else if (decreaseButton) {
    updateQuantity(Number(decreaseButton.dataset.decrease), -1);
  } else if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
closeCartBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartOverlay.hidden) {
    closeCart();
  }
});

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your basket is empty.");
    return;
  }

  showToast("Checkout is a demo feature and is not connected yet.");
});

renderProducts();
renderCart();

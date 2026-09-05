import { products } from "./data.js";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
// localStorage.removeItem("cart");

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN") + " đ";
};

const calculateSubTotal = (price, quantity) => {
  return price * quantity;
};

const calculateTotal = () => {};

const findProductById = (id) => {
  return products.find((p) => p.id === id);
};

const addToCart = (id, quantity = 1) => {
  id = Number(id);
  const item = cart.find((i) => i.id === id);
  if (item) item.quantity += quantity;
  else cart.push({ id: id, quantity: quantity });
  saveCart();
};

const removeItemFromCart = (id) => {
  id = Number(id);
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  initCartPage();
};

const clearCart = () => {
  cart = [];
  saveCart();
  initCartPage();
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderNavCartCount();
};

const createCartItemHTML = (product, quantity) => {
  return `
  <article class="cart-row">
        <img
          src="${product.image}"
          alt="${product.name}"
        />

        <div class="cart-product">
          <p class="cart-product-category">${product.category}</p>
          <h3>${product.name}</h3>
          <p class="cart-unit-price">${formatPrice(product.price)} / sản phẩm</p>
        </div>

        <div class="cart-item-controls">
          <div class="cart-quantity">
            <label for="cart-qty-input-${product.id}">Số lượng</label>
            <input
              id="cart-qty-input-${product.id}"
              class="cart-qty-input"
              data-id="${product.id}"
              type="number"
              value="${quantity}"
              min="1"
            />
          </div>

          <div class="cart-line-total">
            <span>Thành tiền</span>
            <strong class="cart-price">${formatPrice(calculateSubTotal(product.price, quantity))}</strong>
          </div>
        </div>

        <button
          class="cart-remove"
          type="button"
          title="Xóa sản phẩm"
          data-id="${product.id}"
        >
          <svg viewBox="0 0 24 24">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="m19 6-1 14H6L5 6" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        </button>
      </article>
  `;
};

const createProductCardHTML = (product) => {
  let oldPriceHTML = "";
  if (product.oldPrice > product.price) {
    oldPriceHTML = `<span class="old-price">${formatPrice(product.oldPrice)}</span>`;
  }
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.shortDescription}</p>
        <div class="price">
          ${oldPriceHTML}
          <span class="sale-price">${formatPrice(product.price)}</span>
        </div>
        <div class="card-actions">
          <a href="detail.html?id=${product.id}" class="btn btn-outline">Xem chi tiết</a>
          <button class="btn add-to-cart" data-id="${product.id}">Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  `;
};

const renderProducts = (container, list) => {
  if (!container) {
    return;
  }
  if (list.length === 0) {
    container.innerHTML = `<p class="empty-message">Không tìm thấy sản phẩm.</p>`;
    return;
  }
  // let html = "";
  // list.forEach((p) => {
  //   html += createProductCardHTML(p);
  // });
  container.innerHTML = list.map(createProductCardHTML).join("");
};

const renderProductSection = (sectionId, list) => {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }
  if (list.length === 0) {
    section.remove();
    return;
  }
  const productGrid = section.querySelector(".product-grid");
  renderProducts(productGrid, list.slice(0, 3));
};

const renderNavCartCount = () => {
  const navCartCounts = document.querySelectorAll(".nav-cart-count");
  let count = cart.reduce((total, item) => total + item.quantity, 0);
  navCartCounts.forEach((e) => {
    e.innerText = count;
  });
};

const getFilteredProducts = () => {
  const searchValue = document.getElementById("search-product").value.trim().toLowerCase();

  const categoryValue = document.getElementById("category-product").value;

  const statusValue = document.getElementById("status-product").value;

  const maxPrice = Number(document.getElementById("max-price").value);

  let filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchValue);

    const matchCategory = categoryValue === "all" || p.category === categoryValue;

    const matchPrice = p.price <= maxPrice;

    let matchStatus = true;

    switch (statusValue) {
      case "hot":
        matchStatus = p.hot;
        break;

      case "new":
        matchStatus = p.newProduct;
        break;

      case "sale":
        matchStatus = p.sale;
        break;
    }

    return matchSearch && matchCategory && matchStatus && matchPrice;
  });

  const sortValue = document.getElementById("sort-product").value;

  if (sortValue === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortValue === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sortValue === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }

  if (sortValue === "name-desc") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name, "vi"));
  }

  return filteredProducts;
};

const renderFilteredProducts = () => {
  const productList = document.getElementById("products-list");
  if (!productList) {
    return;
  }
  const filteredProducts = getFilteredProducts();
  const productCount = document.getElementById("product-count");
  if (productCount) {
    productCount.textContent = filteredProducts.length + " sản phẩm";
  }
  renderProducts(productList, filteredProducts);
};

const updateMaxPriceSpan = () => {
  const maxPrice = document.getElementById("max-price");
  const maxPriceValue = document.getElementById("max-price-value");
  maxPriceValue.textContent = formatPrice(Number(maxPrice.value));
};

const resetFilter = () => {
  document.getElementById("search-product").value = "";
  document.getElementById("category-product").value = "all";
  document.getElementById("status-product").value = "all";
  document.getElementById("max-price").value = "550000";
  document.getElementById("sort-product").value = "default";

  updateMaxPriceSpan();
  renderFilteredProducts();

  window.history.replaceState({}, "", "products.html");
};

const initHomePage = () => {
  const mainPage = document.getElementById("home-page");
  if (!mainPage) {
    return;
  }
  // const slider = document.querySelector(".hero-slider");
  // if (slider) {
  //   // const dots = slider.querySelectorAll(".slider-dot");
  //   const dots = Array.from(slider.querySelectorAll(".slider-dot"));

  //   console.log(dots);
  //   const activeSlideAndDot = () => {};
  // }

  renderProductSection(
    "hot-products",
    products.filter((p) => p.hot),
  );
  renderProductSection(
    "new-products",
    products.filter((p) => p.newProduct),
  );
  renderProductSection(
    "sale-products",
    products.filter((p) => p.sale),
  );
};

const initProductsPage = () => {
  const productsPage = document.getElementById("products-page");
  if (!productsPage) {
    return;
  }
  const searchInput = document.getElementById("search-product");
  const categorySelect = document.getElementById("category-product");
  const statusSelect = document.getElementById("status-product");
  const maxPrice = document.getElementById("max-price");
  const sortSelect = document.getElementById("sort-product");
  const resetButton = document.getElementById("reset-filter");

  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const validStatus = ["hot", "new", "sale"];
  if (validStatus.includes(status)) {
    document.getElementById("status-product").value = status;
  }

  updateMaxPriceSpan();
  renderFilteredProducts();
  searchInput.addEventListener("input", renderFilteredProducts);
  categorySelect.addEventListener("change", renderFilteredProducts);
  statusSelect.addEventListener("change", renderFilteredProducts);
  maxPrice.addEventListener("input", () => {
    updateMaxPriceSpan();
    renderFilteredProducts();
  });
  sortSelect.addEventListener("change", renderFilteredProducts);
  resetButton.addEventListener("click", resetFilter);
};

const initDetailPage = () => {
  const detailPage = document.getElementById("detail-page");
  if (!detailPage) {
    return;
  }
  const productDetail = document.getElementById("product-detail");
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = findProductById(id);
  if (!product) {
    productDetail.classList.add("not-found");
    productDetail.innerHTML = `
      <div class="not-found-icon">☕</div>
      <h1>Không tìm thấy sản phẩm</h1>
      <p>
        Sản phẩm bạn đang tìm không tồn tại hoặc có thể đã được gỡ khỏi cửa hàng.
      </p>
      <div class="not-found-actions">
        <a href="products.html" class="btn">
          Xem tất cả sản phẩm
        </a>
        <a href="index.html" class="btn btn-outline">
          Về trang chủ
        </a>
      </div>
    `;
    detailPage.querySelector(".section-title").innerText = "Sản phẩm khác";
    renderProductSection(
      "relate-products",
      products.filter((p) => p.sale),
    );
  } else {
    let oldPriceHTML = "";
    if (product.oldPrice > product.price) {
      oldPriceHTML = `<span class="old-price">${formatPrice(product.oldPrice)}</span>`;
    }
    let detailsHTML = "";
    product.details.forEach((d) => {
      detailsHTML += `<li>${d}</li>`;
    });

    productDetail.innerHTML = `
      <img
        class="detail-image"
        src="${product.image}"
        alt="${product.name}"
      />
      <div class="detail-content">
        <h2>${product.name}</h2>
        <div class="price">
          ${oldPriceHTML}
          <span class="sale-price">${formatPrice(product.price)}</span>
        </div>
        <p>
          ${product.longDescription}
        </p>
        <ul class="detail-list">
          ${detailsHTML}
        </ul>
        <div class="buy-box">
          <input
            type="number"
            value="1"
            min="1"
          />
          <button class="btn add-to-cart" data-id="${product.id}">Thêm vào giỏ</button>
        </div>
      </div>
    `;
    const category = product.category;
    renderProductSection(
      "relate-products",
      products.filter((p) => p.category === category && p.id !== product.id),
    );
  }
};

const renderCart = () => {
  const cartSection = document.querySelector("#cart-section");
  const emptyCartSection = document.querySelector("#empty-cart-section");
  if (cart.length === 0) {
    cartSection.style.display = "none";
    emptyCartSection.style.display = "flex";
  } else {
    emptyCartSection.style.display = "none";
    cartSection.style.display = "block";
    cartSection.querySelector("#cart-count").innerText = `${cart.length} sản phẩm`;
    const cartItems = cartSection.querySelector(".cart-items");
    let html = "";
    let total = 0;
    cart.forEach((item) => {
      const product = findProductById(item.id);
      total += product.price * item.quantity;
      html += createCartItemHTML(product, item.quantity);
    });
    cartItems.innerHTML = html;
    updateCartSummary(total);
  }
};

const updateCartSummary = (total) => {
  document.getElementById("cart-summary").innerText = formatPrice(total);
  document.getElementById("summary-total").innerText = formatPrice(total + 25000);
};

const initCartPage = () => {
  const cartPage = document.getElementById("cart-page");
  if (!cartPage) {
    return;
  }
  renderCart();
};

document.addEventListener("click", (e) => {
  const addButton = e.target.closest(".add-to-cart");
  const removeButton = e.target.closest(".cart-remove");
  const clearButton = e.target.closest(".cart-clear");

  if (addButton) {
    let quantity = 1;
    const buyBox = addButton.closest(".buy-box");
    if (buyBox) {
      const quantityInput = buyBox.querySelector(".product-quantity");
      quantity = Number(quantityInput.value);
    }

    addToCart(addButton.dataset.id, quantity);
  }

  if (removeButton) {
    removeItemFromCart(removeButton.dataset.id);
  }

  if (clearButton) {
    clearCart();
  }
});

document.addEventListener("input", (e) => {
  const quantityInput = e.target.closest(".cart-qty-input");
  if (!quantityInput) {
    return;
  }
  let id = Number(quantityInput.dataset.id);
  let quantity = Number(quantityInput.value);

  if (quantity < 1) {
    return;
  }

  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity = quantity;
  saveCart();

  renderCart();
});

document.addEventListener("DOMContentLoaded", () => {
  renderNavCartCount();
  initHomePage();
  initProductsPage();
  initDetailPage();
  initCartPage();
});

import { products } from "./data.js";

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN") + " đ";
};

const findProductById = (id) => {
  return products.find((p) => p.id == id);
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
          <a href="cart.html" class="btn">Thêm vào giỏ</a>
        </div>
      </div>
    </div>
  `;
};

const renderProducts = (container, list) => {
  if (!container) {
    return;
  }
  if (list.length == 0) {
    container.innerHTML = `<p class="empty-message">Không tìm thấy sản phẩm.</p>`;
    return;
  }
  let html = "";
  list.forEach((p) => {
    html += createProductCardHTML(p);
  });
  container.innerHTML = html;
};

const renderProductSection = (sectionId, list) => {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }
  if (list.length == 0) {
    section.remove();
    return;
  }
  const productGrid = section.querySelector(".product-grid");
  renderProducts(productGrid, list.slice(0, 3));
};

const getFilteredProducts = () => {
  const searchValue = document
    .getElementById("search-product")
    .value.trim()
    .toLowerCase();

  const categoryValue = document.getElementById("category-product").value;

  const statusValue = document.getElementById("status-product").value;

  const maxPrice = Number(document.getElementById("max-price").value);

  let filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchValue);

    const matchCategory =
      categoryValue === "all" || p.category === categoryValue;

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
            aria-label="Số lượng sản phẩm"
          />
          <a href="cart.html" class="btn">Thêm vào giỏ</a>
        </div>
      </div>
    `;
    const category = product.category;
    renderProductSection(
      "relate-products",
      products.filter((p) => p.category == category && p.id !== product.id),
    );
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initHomePage();
  initProductsPage();
  initDetailPage();
});

const products = [
  {
    id: 1,
    name: "Cà phê sữa đá",
    price: 35000,
    oldPrice: 45000,
    image: "./images/photo-1509042239860-f550ce710b93.jpeg",
    description: "Cà phê đậm vị, thêm sữa đặc và đá mát.",
    category: "Cà phê Việt",
    stock: 30,
    hot: true,
    newProduct: false,
    sale: true,
  },
  {
    id: 2,
    name: "Cà phê đen đá",
    price: 30000,
    oldPrice: 40000,
    image: "./images/photo-1495474472287-4d71bcdd2085.jpeg",
    description: "Vị cà phê nguyên bản, thơm và ít ngọt.",
    category: "Cà phê Việt",
    stock: 25,
    hot: true,
    newProduct: false,
    sale: true,
  },
  {
    id: 3,
    name: "Cappuccino",
    price: 50000,
    oldPrice: 60000,
    image: "./images/photo-1514432324607-a09d9b4aefdd.jpeg",
    description: "Lớp bọt sữa mềm, vị cà phê cân bằng.",
    category: "Espresso",
    stock: 20,
    hot: true,
    newProduct: false,
    sale: true,
  },
  {
    id: 4,
    name: "Latte nóng",
    price: 55000,
    oldPrice: 65000,
    image: "./images/photo-1461023058943-07fcbe16d735.jpeg",
    description: "Cà phê sữa nóng dịu vị, thơm béo dễ uống.",
    category: "Espresso",
    stock: 20,
    hot: false,
    newProduct: true,
    sale: true,
  },
  {
    id: 5,
    name: "Bạc xỉu",
    price: 40000,
    oldPrice: 40000,
    image: "./images/photo-1509042239860-f550ce710b93.jpeg",
    description: "Nhiều sữa, ít cà phê, ngọt dịu và dễ uống.",
    category: "Cà phê Việt",
    stock: 25,
    hot: false,
    newProduct: true,
    sale: false,
  },
  {
    id: 6,
    name: "Americano",
    price: 45000,
    oldPrice: 45000,
    image: "./images/photo-1495474472287-4d71bcdd2085.jpeg",
    description: "Espresso pha loãng, thơm rõ và ít béo.",
    category: "Espresso",
    stock: 15,
    hot: false,
    newProduct: true,
    sale: false,
  },
  {
    id: 7,
    name: "Cold Brew",
    price: 60000,
    oldPrice: 70000,
    image: "./images/photo-1461023058943-07fcbe16d735.jpeg",
    description: "Ủ lạnh nhiều giờ, vị êm và ít đắng gắt.",
    category: "Cold Brew",
    stock: 15,
    hot: true,
    newProduct: true,
    sale: true,
  },
  {
    id: 8,
    name: "Mocha",
    price: 60000,
    oldPrice: 70000,
    image: "./images/photo-1514432324607-a09d9b4aefdd.jpeg",
    description: "Espresso, sữa và chocolate thơm ngọt.",
    category: "Espresso",
    stock: 15,
    hot: true,
    newProduct: false,
    sale: true,
  },
];

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN") + " đ";
};

// const findProductById = (id) => {
//   return products.find((p) => p.id == id);
// };

const getHotProducts = () => {
  return products.filter((p) => p.hot);
};

const getNewProducts = () => {
  return products.filter((p) => p.newProduct);
};

const getSaleProducts = () => {
  return products.filter((p) => p.sale);
};

const createProductHTML = (product) => {
  let oldPriceHTML = "";

  if (product.oldPrice > product.price) {
    oldPriceHTML = `<span class="old-price">${formatPrice(product.oldPrice)}</span>`;
  }

  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">
          ${oldPriceHTML}
          <span class="sale-price">${formatPrice(product.price)}</span>
        </div>
        <div class="card-actions">
          <a href="detail.html?product-id=${product.id}" class="btn btn-outline">Xem chi tiết</a>
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
    html += createProductHTML(p);
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

const updateProductCount = (count) => {
  const productCount = document.getElementById("products-count");

  if (productCount) {
    productCount.textContent = count + " sản phẩm";
  }
};

const getProductsByFilter = (filterName) => {
  if (filterName == "hot") {
    return getHotProducts();
  }
  if (filterName == "new") {
    return getNewProducts();
  }
  if (filterName == "sale") {
    return getSaleProducts();
  }
  return products;
};

const renderProductsPage = () => {
  const filterBox = document.getElementById("product-filter");
  const productList = document.getElementById("products-list");

  if (!filterBox || !productList) {
    return;
  }

  const filterButtons = filterBox.querySelectorAll(".filter-btn");

  const showProducts = (filterName) => {
    const filteredProducts = getProductsByFilter(filterName);
    renderProducts(productList, filteredProducts);
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
      showProducts(btn.dataset.filter);
    });
  });

  showProducts("all");
};

document.addEventListener("DOMContentLoaded", () => {
  renderProductSection("hot-products", getHotProducts());
  renderProductSection("new-products", getNewProducts());
  renderProductSection("sale-products", getSaleProducts());
  renderProductsPage();
});

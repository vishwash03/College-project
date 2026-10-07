const additionalProductSections = [
  [
    {
      name: "Linen Kurta",
      price: "₹520",
      originalPrice: "₹800",
      discount: "₹280 OFF",
      brand: "Loom & Line",
      rating: "4.6★",
      reviews: "(1.4k)",
      size: "Cotton linen / Piece"
    },
    {
      name: "Denim Jacket",
      price: "₹720",
      originalPrice: "₹1,000",
      discount: "₹280 OFF",
      brand: "Urban Thread",
      rating: "4.5★",
      reviews: "(980)",
      size: "Denim / Piece"
    },
    {
      name: "Cotton Polo",
      price: "₹299",
      originalPrice: "₹450",
      discount: "₹151 OFF",
      brand: "Everyday Co.",
      rating: "4.3★",
      reviews: "(1.1k)",
      size: "100% cotton / Piece"
    },
    {
      name: "Printed Skirt",
      price: "₹430",
      originalPrice: "₹650",
      discount: "₹220 OFF",
      brand: "Petal Print",
      rating: "4.4★",
      reviews: "(760)",
      size: "Printed fabric / Piece"
    }
  ],
  [
    {
      name: "Banarasi Silk Saree",
      price: "₹1,250",
      originalPrice: "₹1,700",
      discount: "₹450 OFF",
      brand: "Sutra Heritage",
      rating: "4.8★",
      reviews: "(1.2k)",
      size: "Silk blend / Saree"
    },
    {
      name: "Chiffon Saree",
      price: "₹780",
      originalPrice: "₹1,100",
      discount: "₹320 OFF",
      brand: "Drape Studio",
      rating: "4.5★",
      reviews: "(890)",
      size: "Chiffon / Saree"
    },
    {
      name: "Kanjivaram Saree",
      price: "₹1,850",
      originalPrice: "₹2,400",
      discount: "₹550 OFF",
      brand: "Temple Loom",
      rating: "4.9★",
      reviews: "(640)",
      size: "Silk / Saree"
    },
    {
      name: "Embroidered Saree",
      price: "₹990",
      originalPrice: "₹1,350",
      discount: "₹360 OFF",
      brand: "Mira Weaves",
      rating: "4.6★",
      reviews: "(720)",
      size: "Georgette / Saree"
    }
  ],
  [
    {
      name: "Woven Stole",
      price: "₹260",
      originalPrice: "₹400",
      discount: "₹140 OFF",
      brand: "Loom & Line",
      rating: "4.4★",
      reviews: "(540)",
      size: "Cotton blend / Piece"
    },
    {
      name: "Classic Belt",
      price: "₹320",
      originalPrice: "₹500",
      discount: "₹180 OFF",
      brand: "Urban Thread",
      rating: "4.3★",
      reviews: "(680)",
      size: "Adjustable / Piece"
    },
    {
      name: "Canvas Tote",
      price: "₹390",
      originalPrice: "₹600",
      discount: "₹210 OFF",
      brand: "Everyday Co.",
      rating: "4.6★",
      reviews: "(1.1k)",
      size: "Canvas / Piece"
    },
    {
      name: "Pearl Hair Clips",
      price: "₹180",
      originalPrice: "₹300",
      discount: "₹120 OFF",
      brand: "Petal Print",
      rating: "4.2★",
      reviews: "(430)",
      size: "Set of 2"
    },
    {
      name: "Leather Wallet",
      price: "₹540",
      originalPrice: "₹800",
      discount: "₹260 OFF",
      brand: "ClassicFormal",
      rating: "4.5★",
      reviews: "(920)",
      size: "Genuine leather / Piece"
    },
    {
      name: "Printed Scarf",
      price: "₹280",
      originalPrice: "₹450",
      discount: "₹170 OFF",
      brand: "SummerVibes",
      rating: "4.4★",
      reviews: "(610)",
      size: "Lightweight / Piece"
    },
    {
      name: "Everyday Cap",
      price: "₹240",
      originalPrice: "₹380",
      discount: "₹140 OFF",
      brand: "ActiveWear",
      rating: "4.3★",
      reviews: "(750)",
      size: "Adjustable / Piece"
    },
    {
      name: "Knit Beanie",
      price: "₹350",
      originalPrice: "₹520",
      discount: "₹170 OFF",
      brand: "WinterPro",
      rating: "4.7★",
      reviews: "(840)",
      size: "Soft knit / Piece"
    },
    {
      name: "Embroidered Pouch",
      price: "₹210",
      originalPrice: "₹340",
      discount: "₹130 OFF",
      brand: "Mira Weaves",
      rating: "4.5★",
      reviews: "(390)",
      size: "Handmade / Piece"
    },
    {
      name: "Buckle Bracelet",
      price: "₹450",
      originalPrice: "₹700",
      discount: "₹250 OFF",
      brand: "Sutra Heritage",
      rating: "4.6★",
      reviews: "(560)",
      size: "Adjustable / Piece"
    }
  ]
];

const mainContent = document.querySelector(".content");
const newArrivalsTitle = document.createElement("h2");
newArrivalsTitle.className = "section-title";
newArrivalsTitle.textContent = "Everyday Accessories";

const newArrivals = document.createElement("div");
newArrivals.className = "products-container";
newArrivals.setAttribute("aria-label", "Everyday accessories products");
mainContent.append(newArrivalsTitle, newArrivals);

const productRows = [...document.querySelectorAll(".products-container")];
productRows.forEach((section, index) => {
  const products = additionalProductSections[index];
  if (!products) return;
  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-image">
        <img src="image/p1.jpeg" alt="${product.name}">
        <button type="button" class="star-icon" title="Add to wishlist" aria-label="Add ${product.name} to wishlist">
          <i data-lucide="heart"></i>
        </button>
      </div>
      <div class="card-content">
        <h3>${product.name}</h3>
        <div class="price-section">
          <span class="price-sale">${product.price}</span>
          <span class="price-original">${product.originalPrice}</span>
        </div>
        <div class="discount-badge-wrapper">
          <span class="discount-badge">${product.discount}</span>
        </div>
        <span class="brand-badge">${product.brand}</span>
        <div class="rating-section">
          <span class="rating-badge">${product.rating}</span>
          <span class="review-count">${product.reviews}</span>
        </div>
        <p class="product-size">${product.size}</p>
        <div class="quantity-control">
          <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">−</button>
          <span class="qty-display">1</span>
          <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="add-to-cart">Add to cart</button>
      </div>`;
    section.append(card);
  });
});

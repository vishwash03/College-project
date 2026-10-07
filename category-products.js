(() => {
  const newCollections = {
    "skincare.html": {
      title: "Skincare",
      products: [
        ["Rose Hydration Serum", "Serum", "🪷", 599, "Glow", "30ml"],
        ["Daily Face Moisturizer", "Moisturizer", "🧴", 449, "Hydration", "50g"],
        ["Gentle Foaming Cleanser", "Cleanser", "🫧", 329, "Gentle care", "150ml"],
        ["Mineral Sunscreen SPF 50", "Sunscreen", "☀️", 699, "Sun care", "50g"],
        ["Overnight Repair Cream", "Night care", "🌙", 749, "Repair", "50g"],
        ["Vitamin C Face Wash", "Face wash", "🍊", 279, "Brightening", "100ml"]
      ]
    },
    "baby-product.html": {
      title: "Baby Product",
      products: [
        ["Soft Cotton Baby Towel", "Bath", "🛁", 499, "LittleNest", "1 piece"],
        ["Gentle Baby Lotion", "Baby care", "🧴", 349, "LittleNest", "200ml"],
        ["Organic Cotton Onesie", "Clothing", "🍼", 699, "TinyThreads", "0-6 months"],
        ["Baby Care Essentials Kit", "Care set", "🧸", 899, "LittleNest", "5 pieces"],
        ["Comfort Fit Baby Blanket", "Bedding", "☁️", 799, "SoftCloud", "90 × 100cm"],
        ["Reusable Feeding Bibs", "Feeding", "🧷", 299, "TinyThreads", "3 pieces"]
      ]
    },
    "special.html": {
      title: "Special",
      products: [
        ["Festive Gift Hamper", "Gift set", "🎁", 1499, "Celebrations", "1 hamper"],
        ["Handcrafted Ceramic Mug", "Handmade", "🏺", 549, "Artisan Home", "1 piece"],
        ["Scented Candle Trio", "Home", "🕯️", 799, "WarmGlow", "3 pieces"],
        ["Limited Edition Tote", "Exclusive", "🛍️", 649, "TrendStyle", "1 piece"],
        ["Curated Snack Box", "Treats", "🍱", 999, "GoodThings", "8 items"],
        ["Seasonal Flower Bundle", "Seasonal", "💐", 1199, "Bloom & Co.", "1 bouquet"]
      ]
    },
    "mens.html": {
      title: "Men's",
      products: [
        ["Classic Oxford Shirt", "Shirts", "👔", 1299, "TrendStyle", "M-XXL"],
        ["Everyday Denim Jeans", "Denim", "👖", 1799, "ComfortFit", "30-38"],
        ["Lightweight Casual Jacket", "Outerwear", "🧥", 2499, "UrbanWear", "M-XXL"],
        ["Leather Finish Belt", "Accessories", "🧷", 699, "Form & Field", "One size"],
        ["Comfort Knit Sneakers", "Footwear", "👟", 1999, "StreetStep", "UK 7-11"],
        ["Minimalist Wrist Watch", "Watches", "⌚", 1599, "TimeCraft", "One size"]
      ]
    }
  };

  const sourceProducts = [...document.querySelectorAll(".product-grid .product-card")].map((card) => {
    const title = card.querySelector(".product-title")?.textContent.trim();
    const priceText = card.querySelector(".price")?.textContent.trim() || "";
    const price = Number(priceText.replace(/[^\d.]/g, ""));
    const sourceImage = card.querySelector(".product-image")?.textContent.trim() || "🛍️";
    return {
      name: title,
      label: card.querySelector(".product-label")?.textContent.trim() || "Featured",
      image: [...sourceImage][0] || "🛍️",
      price: Math.round(price * 80),
      brand: "Shop Select",
      size: card.querySelector(".product-meta span:first-child")?.textContent.trim() || "One size",
      rating: "4.5",
      reviews: "120"
    };
  }).filter((product) => product.name && Number.isFinite(product.price));

  const pageKey = (window.location.pathname.split("/").pop() || "").toLowerCase();
  const collection = newCollections[pageKey];
  const products = collection
    ? collection.products.map(([name, label, image, price, brand, size], index) => ({
        name, label, image, price, brand, size,
        rating: ["4.5", "4.3", "4.7", "4.4", "4.6", "4.2"][index],
        reviews: ["2.3k", "840", "1.2k", "670", "1.8k", "530"][index]
      }))
    : sourceProducts;

  const heading = document.querySelector(".page-header h2");
  if (collection && heading) heading.textContent = collection.title;

  const oldGrid = document.querySelector(".product-grid");
  if (!oldGrid) return;
  const productRow = document.createElement("div");
  productRow.className = "products-container";
  productRow.setAttribute("aria-label", `${collection?.title || heading?.textContent || "Collection"} products`);

  function makeProductImage(emoji, name) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="#f5e6d3"/><text x="120" y="145" text-anchor="middle" font-size="112">${emoji}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  products.forEach((product, index) => {
    const original = Math.ceil(product.price * 1.25 / 10) * 10;
    const discount = original - product.price;
    const card = document.createElement("article");
    card.className = "card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "card-image";
    const image = document.createElement("img");
    image.src = makeProductImage(product.image, product.name);
    image.alt = product.name;
    imageWrap.append(image);

    const favorite = document.createElement("button");
    favorite.className = "star-icon";
    favorite.type = "button";
    favorite.setAttribute("aria-label", `Add ${product.name} to wishlist`);
    const heart = document.createElement("i");
    heart.dataset.lucide = "heart";
    heart.setAttribute("aria-hidden", "true");
    favorite.append(heart);
    imageWrap.append(favorite);

    const content = document.createElement("div");
    content.className = "card-content";
    const name = document.createElement("h3");
    name.textContent = product.name;
    const priceSection = document.createElement("div");
    priceSection.className = "price-section";
    const sale = document.createElement("span");
    sale.className = "price-sale";
    sale.textContent = `₹${product.price}`;
    const oldPrice = document.createElement("span");
    oldPrice.className = "price-original";
    oldPrice.textContent = `₹${original}`;
    priceSection.append(sale, oldPrice);

    const discountWrap = document.createElement("div");
    discountWrap.className = "discount-badge-wrapper";
    const badge = document.createElement("span");
    badge.className = "discount-badge";
    badge.textContent = `₹${discount} OFF`;
    discountWrap.append(badge);

    const brand = document.createElement("span");
    brand.className = "brand-badge";
    brand.textContent = product.brand;
    const rating = document.createElement("div");
    rating.className = "rating-section";
    const ratingBadge = document.createElement("span");
    ratingBadge.className = "rating-badge";
    ratingBadge.textContent = `${product.rating}★`;
    const reviews = document.createElement("span");
    reviews.className = "review-count";
    reviews.textContent = `(${product.reviews})`;
    rating.append(ratingBadge, reviews);

    const size = document.createElement("p");
    size.className = "product-size";
    size.textContent = product.size;
    const quantity = document.createElement("div");
    quantity.className = "quantity-control";
    const minus = document.createElement("button");
    minus.className = "qty-btn qty-minus";
    minus.type = "button";
    minus.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    minus.textContent = "−";
    const quantityValue = document.createElement("span");
    quantityValue.className = "qty-display";
    quantityValue.textContent = "1";
    const plus = document.createElement("button");
    plus.className = "qty-btn qty-plus";
    plus.type = "button";
    plus.setAttribute("aria-label", `Increase ${product.name} quantity`);
    plus.textContent = "+";
    quantity.append(minus, quantityValue, plus);
    const add = document.createElement("button");
    add.className = "add-to-cart";
    add.type = "button";
    add.textContent = "Add to cart";
    content.append(name, priceSection, discountWrap, brand, rating, size, quantity, add);
    card.append(imageWrap, content);
    card.dataset.productIndex = String(index);
    productRow.append(card);
  });

  oldGrid.replaceWith(productRow);

  function showCartError(error) {
    console.error("Collection cart update failed.", error);
    window.alert(error.message);
  }

  productRow.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const card = button.closest(".card");
    const product = products[Number(card.dataset.productIndex)];
    const quantityValue = card.querySelector(".qty-display");
    const quantityControl = card.querySelector(".quantity-control");
    const addButton = card.querySelector(".add-to-cart");

    if (button.classList.contains("star-icon")) {
      button.classList.toggle("active");
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
      return;
    }
    if (!window.ShopCart) {
      showCartError(new Error("Cart services are unavailable. Reload the page and try again."));
      return;
    }

    try {
      const currentQuantity = Number(quantityValue.textContent);
      if (button.classList.contains("add-to-cart")) {
        window.ShopCart.add({
          name: product.name,
          price: product.price,
          image: card.querySelector(".card-image img").src,
          brand: product.brand,
          size: product.size
        });
        quantityValue.textContent = "1";
        quantityControl.classList.add("show");
        addButton.classList.add("hidden");
      } else if (button.classList.contains("qty-plus")) {
        window.ShopCart.add({
          name: product.name,
          price: product.price,
          image: card.querySelector(".card-image img").src,
          brand: product.brand,
          size: product.size
        });
        quantityValue.textContent = String(currentQuantity + 1);
      } else if (button.classList.contains("qty-minus")) {
        const nextQuantity = currentQuantity - 1;
        window.ShopCart.setQuantity(product.name, nextQuantity);
        if (nextQuantity < 1) {
          quantityValue.textContent = "1";
          quantityControl.classList.remove("show");
          addButton.classList.remove("hidden");
        } else {
          quantityValue.textContent = String(nextQuantity);
        }
      }
    } catch (error) {
      showCartError(error);
    }
  });

  if (window.ShopCart) {
    const savedItems = window.ShopCart.getItems();
    productRow.querySelectorAll(".card").forEach((card) => {
      const product = products[Number(card.dataset.productIndex)];
      const saved = savedItems.find((item) => item.name === product.name);
      if (!saved) return;
      card.querySelector(".qty-display").textContent = String(saved.quantity);
      card.querySelector(".quantity-control").classList.add("show");
      card.querySelector(".add-to-cart").classList.add("hidden");
    });
  }

  if (window.lucide) window.lucide.createIcons();
})();

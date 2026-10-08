(() => {
  const collections = [
    {
      title: "Pantry & Groceries",
      products: [
        { name: "Sona Masoori Rice", brand: "Best Value", size: "5 kg", price: 449, image: "BestValue-Sona-Masoori-Raw-Rice.webp" },
        { name: "Dubar Basmati Rice", brand: "India Gate", size: "5 kg", price: 599, image: "India-Gate-Dubar-Basmati-Rice-Long-Slender-Grains.webp" },
        { name: "Kolam Rice", brand: "GTS", size: "5 kg", price: 399, image: "GTS-Original-Kolam-Rice.webp" },
        { name: "Matta Long Grain Rice", brand: "Double Horse", size: "5 kg", price: 429, image: "4e5238de-adc2-4f0e-a1f7-0e9f6b9b29d4.jpeg" },
        { name: "Daily Good Rice", brand: "Daily Good", size: "1 kg", price: 99, image: "3ee4afb8-0d98-469d-9972-6a3c27ea499f.jpeg" },
        { name: "High Fibre Poha", brand: "Tata Sampann", size: "1 kg", price: 109, image: "Tata-Sampann-High-in-Fibre-Poha.webp" },
        { name: "Turmeric Powder", brand: "Aashirvaad", size: "100 g", price: 65, image: "Aashirvaad-Turmeric-Powder-Haldi-Powder.webp" },
        { name: "White Sugar", brand: "Parry's", size: "1 kg", price: 52, image: "Parry-s-White-Label-Sugar.webp" },
        { name: "Green Moong", brand: "Daily Good", size: "500 g", price: 79, image: "e907fc8c-92d6-415a-84aa-6f90b6e35e41.jpg" },
        { name: "Brown Chana", brand: "Daily Good", size: "500 g", price: 69, image: "f078a8dc-a9b6-41a6-9c6f-721d4892b8ee.png" },
        { name: "Fresh Onion", brand: "Fresh Produce", size: "1 kg", price: 45, image: "Onion.webp" },
        { name: "Coconut Oil", brand: "Parachute", size: "500 ml", price: 199, image: "Parachute-Coconut-Oil-Edible-.webp" },
        { name: "Chilli Chataka", brand: "Kurkure", size: "75 g", price: 20, image: "Kurkure-Namkeen-Chilli-Chataka-Crunchy-Snacks.webp" },
        { name: "Green Chutney Style", brand: "Kurkure", size: "75 g", price: 20, image: "Kurkure-Namkeen-Green-Chutney-Style-Crunchy-Snacks.webp" }
      ]
    },
    {
      title: "Drinks & Personal Care",
      products: [
        { name: "Diet Coke", brand: "Coca-Cola", size: "Can", price: 40, image: "Diet-Coke-Can-Cola-Sparkling-Soft-Drink-The-Coca-Cola-Company.webp" },
        { name: "Energy Drink", brand: "Red Bull", size: "Can", price: 125, image: "Red-Bull-Energy-Drink-Ready-To-Drink-Beverage.webp" },
        { name: "Nourishing Body Wash", brand: "Dove", size: "1 L", price: 399, image: "Dove-Gentle-Nourishing-Body-Wash-24H-Moisture-Lock-For-Sensitive-Skin.webp" },
        { name: "Sandal Handwash", brand: "Medimix", size: "Pump bottle", price: 149, image: "Medimix-Sandal-Handwash-Pump-Infused-with-Sandalwood-for-Germ-Protection-Moisturized-Hands.webp" },
        { name: "Hand Rub", brand: "3M Avagard", size: "500 ml", price: 299, image: "3M-Avagard-Chg-Handrub-Antiseptic-Solution-Pink.webp" },
        { name: "Hand Wash Gel", brand: "Purela", size: "5 L", price: 499, image: "p1.jpeg" },
        { name: "Vitamin C 23 Serum", brand: "COSRX", size: "Serum", price: 1299, image: "2d724573-d523-4979-96b2-8673a7288757.jpeg" },
        { name: "Morning Dew Talc", brand: "Yardley London", size: "Talc", price: 249, image: "f79ba39f-79d6-4ef4-82d6-3122432951ed.jpeg" }
      ]
    },
    {
      title: "Home & Laundry",
      products: [
        { name: "Kitchen Cleaner Spray", brand: "Happi Planet", size: "Spray bottle", price: 199, image: "Happi-Planet-Kitchen-Cleaner-Spray-Suitable-for-Stoves-Chimneys-Appliances-Cabinets.webp" },
        { name: "All Purpose Cleaner", brand: "Purela", size: "5 L", price: 449, image: "2d268e0b-f941-44b8-b6bc-7e864009b83d.jpg" },
        { name: "Matic Liquid Detergent", brand: "Surf Excel", size: "2 kg", price: 399, image: "Surf-Excel-Matic-Liquid-Detergent-for-Front-Load-Removes-tough-Stains-in-1st-wash.webp" },
        { name: "Liquid Detergent", brand: "Godrej Fab", size: "4 L", price: 349, image: "2effd5ea-fe2b-49cb-abac-29b3b7df32bc.jpeg" },
        { name: "Genteel Matic Liquid", brand: "Godrej", size: "2 kg", price: 299, image: "e42efc1d-2df9-4183-aaf2-27a7fa807469.jpeg" }
      ]
    },
    {
      title: "Fashion",
      products: [
        { name: "Floral Printed Saree", brand: "Traditional Collection", size: "One size", price: 1499, image: "2cea59a9-78f2-4223-8cfb-15cab1cbe6a8.jpg" }
      ]
    },
    {
      title: "Packaged Food",
      products: [
        { name: "Packaged Food Combo", brand: "Instant meals", size: "Breakfast & noodles", price: 99, image: "3b0ce887-3b38-4450-b7da-9da0ad8b799d.png" }
      ]
    }
  ];

  const content = document.querySelector(".content");
  if (!content) return;

  content.querySelectorAll(".products-container, .section-title").forEach((section) => section.remove());

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function makeCard(product) {
    const card = createElement("article", "card");
    const imageWrap = createElement("div", "card-image");
    const image = document.createElement("img");
    image.src = `image/${product.image}`;
    image.alt = product.name;
    image.loading = "lazy";
    const favorite = createElement("button", "star-icon");
    favorite.type = "button";
    favorite.title = `Add ${product.name} to wishlist`;
    favorite.setAttribute("aria-label", `Add ${product.name} to wishlist`);
    favorite.setAttribute("aria-pressed", "false");
    const heart = document.createElement("i");
    heart.dataset.lucide = "heart";
    heart.setAttribute("aria-hidden", "true");
    favorite.append(heart);
    imageWrap.append(image, favorite);

    const details = createElement("div", "card-content");
    details.append(createElement("h3", "", product.name));
    const price = createElement("div", "price-section");
    price.append(createElement("span", "price-sale", `₹${product.price}`));
    details.append(price);
    details.append(createElement("span", "brand-badge", product.brand));
    details.append(createElement("p", "product-size", product.size));

    const quantity = createElement("div", "quantity-control");
    quantity.append(createElement("button", "qty-btn qty-minus", "−"));
    quantity.lastElementChild.type = "button";
    quantity.lastElementChild.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    quantity.append(createElement("span", "qty-display", "1"));
    quantity.lastElementChild.setAttribute("aria-live", "polite");
    quantity.append(createElement("button", "qty-btn qty-plus", "+"));
    quantity.lastElementChild.type = "button";
    quantity.lastElementChild.setAttribute("aria-label", `Increase ${product.name} quantity`);
    const add = createElement("button", "add-to-cart", "Add to cart");
    add.type = "button";
    details.append(quantity, add);
    card.append(imageWrap, details);
    return card;
  }

  collections.forEach(({ title, products }) => {
    const heading = createElement("h2", "section-title", title);
    const row = createElement("div", "products-container home-product-row");
    row.setAttribute("aria-label", `${title} products`);
    products.forEach((product) => row.append(makeCard(product)));
    content.append(heading, row);
  });

  window.lucide?.createIcons();
})();

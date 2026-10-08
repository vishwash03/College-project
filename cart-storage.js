(() => {
  const storageKey = "shop-cart-items";

  function readItems() {
    let serialized;
    try {
      serialized = localStorage.getItem(storageKey);
    } catch (error) {
      console.error("Unable to read the shopping cart from browser storage.", error);
      throw new Error("Your cart could not be accessed. Check your browser storage settings.");
    }

    if (!serialized) return [];

    let items;
    try {
      items = JSON.parse(serialized);
    } catch (error) {
      console.error("The saved shopping cart contains invalid data.", error);
      throw new Error("Your saved cart data could not be read.");
    }

    if (!Array.isArray(items) || items.some((item) =>
      !item ||
      typeof item.name !== "string" ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    )) {
      throw new Error("Your saved cart data is invalid.");
    }

    return items;
  }

  function writeItems(items) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.error("Unable to save the shopping cart to browser storage.", error);
      throw new Error("Your cart could not be saved. Check available browser storage.");
    }

    window.dispatchEvent(new CustomEvent("shop-cart-updated"));
  }

  function getItems() {
    return readItems();
  }

  function add(product, quantity = 1) {
    if (!product || typeof product.name !== "string" || !product.name.trim() ||
        typeof product.price !== "number" || !Number.isFinite(product.price) ||
        !Number.isInteger(quantity) || quantity < 1) {
      throw new Error("This product cannot be added to the cart.");
    }

    const items = readItems();
    const existing = items.find((item) => item.name === product.name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        name: product.name,
        price: product.price,
        quantity,
        image: product.image || "",
        brand: product.brand || "",
        size: product.size || ""
      });
    }
    writeItems(items);
  }

  function setQuantity(name, quantity) {
    if (typeof name !== "string" || !Number.isInteger(quantity)) {
      throw new Error("The cart quantity could not be updated.");
    }

    const items = readItems();
    const item = items.find((entry) => entry.name === name);
    if (!item) return;

    if (quantity < 1) {
      writeItems(items.filter((entry) => entry.name !== name));
      return;
    }

    item.quantity = quantity;
    writeItems(items);
  }

  function remove(name) {
    const items = readItems();
    writeItems(items.filter((item) => item.name !== name));
  }

  function clear() {
    writeItems([]);
  }

  const wishlistStorageKey = "shop-wishlist-items";

  function readWishlist() {
    let serialized;
    try {
      serialized = localStorage.getItem(wishlistStorageKey);
    } catch (error) {
      console.error("Unable to read the wishlist from browser storage.", error);
      throw new Error("Your wishlist could not be accessed. Check your browser storage settings.");
    }
    if (!serialized) return [];

    let items;
    try {
      items = JSON.parse(serialized);
    } catch (error) {
      console.error("The saved wishlist contains invalid data.", error);
      throw new Error("Your saved wishlist data could not be read.");
    }
    if (!Array.isArray(items) || items.some((item) =>
      !item ||
      typeof item.name !== "string" ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price)
    )) {
      throw new Error("Your saved wishlist data is invalid.");
    }
    return items;
  }

  function writeWishlist(items) {
    try {
      localStorage.setItem(wishlistStorageKey, JSON.stringify(items));
    } catch (error) {
      console.error("Unable to save the wishlist to browser storage.", error);
      throw new Error("Your wishlist could not be saved. Check available browser storage.");
    }
    window.dispatchEvent(new CustomEvent("quickcart-wishlist-updated"));
  }

  function getWishlistItems() {
    return readWishlist();
  }

  function toggleWishlist(product) {
    if (!product || typeof product.name !== "string" || !product.name.trim() ||
        typeof product.price !== "number" || !Number.isFinite(product.price)) {
      throw new Error("This product cannot be saved to your wishlist.");
    }
    const items = readWishlist();
    const existing = items.find((item) => item.name === product.name);
    const saved = !existing;
    if (existing) {
      writeWishlist(items.filter((item) => item.name !== product.name));
    } else {
      writeWishlist(items.concat({
        name: product.name,
        price: product.price,
        image: product.image || "",
        brand: product.brand || "",
        size: product.size || ""
      }));
    }
    document.querySelectorAll(".star-icon").forEach((button) => {
      const card = button.closest(".card");
      const name = card?.querySelector(".card-content h3")?.textContent.trim();
      if (name !== product.name) return;
      button.classList.toggle("active", saved);
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute("aria-label", `${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`);
    });
    return saved;
  }

  function syncWishlistButtons(root = document) {
    const items = readWishlist();
    const savedNames = new Set(items.map((item) => item.name));
    root.querySelectorAll(".star-icon").forEach((button) => {
      const card = button.closest(".card");
      const name = card?.querySelector(".card-content h3")?.textContent.trim();
      const saved = Boolean(name && savedNames.has(name));
      button.classList.toggle("active", saved);
      button.setAttribute("aria-pressed", String(saved));
    });
  }

  window.ShopWishlist = {
    getItems: getWishlistItems,
    toggle: toggleWishlist,
    syncButtons: syncWishlistButtons
  };

  window.ShopCart = { getItems, add, setQuantity, remove, clear };
})();

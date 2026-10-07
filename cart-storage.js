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

  window.ShopCart = { getItems, add, setQuantity, remove, clear };
})();

(() => {
  const storageKey = "shop-orders";
  const statuses = ["Order placed", "Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];

  function validateOrder(order) {
    return Boolean(
      order &&
      typeof order.id === "string" &&
      typeof order.createdAt === "string" &&
      typeof order.statusIndex === "number" &&
      Number.isInteger(order.statusIndex) &&
      order.statusIndex >= 0 &&
      order.statusIndex < statuses.length &&
      Array.isArray(order.items) &&
      order.items.length > 0 &&
      order.items.every((item) =>
        item &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      ) &&
      typeof order.total === "number" &&
      Number.isFinite(order.total) &&
      order.address &&
      typeof order.address.name === "string" &&
      typeof order.address.phone === "string" &&
      typeof order.address.line === "string"
    );
  }

  function getAll() {
    let serialized;
    try {
      serialized = localStorage.getItem(storageKey);
    } catch (error) {
      console.error("Unable to read orders from browser storage.", error);
      throw new Error("Your orders could not be accessed. Check your browser storage settings.");
    }
    if (serialized === null) return [];

    let orders;
    try {
      orders = JSON.parse(serialized);
    } catch (error) {
      console.error("Saved orders contain invalid data.", error);
      throw new Error("Your saved order history could not be read.");
    }
    if (!Array.isArray(orders) || orders.some((order) => !validateOrder(order))) {
      throw new Error("Your saved order history has an invalid format.");
    }
    return orders;
  }

  function save(orders) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(orders));
    } catch (error) {
      console.error("Unable to save orders to browser storage.", error);
      throw new Error("Your order could not be saved. Check available browser storage.");
    }
    window.dispatchEvent(new CustomEvent("shop-orders-updated"));
  }

  function create(orderDetails) {
    const now = new Date();
    const order = {
      ...orderDetails,
      id: `ORD-${now.getTime().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      createdAt: now.toISOString(),
      statusIndex: 0,
      statusHistory: [{ status: statuses[0], at: now.toISOString() }]
    };
    if (!validateOrder(order)) throw new Error("The order details are incomplete or invalid.");
    const orders = getAll();
    orders.unshift(order);
    save(orders);
    return order;
  }

  function getById(id) {
    if (typeof id !== "string" || !id) return null;
    return getAll().find((order) => order.id === id) || null;
  }

  function advance(id) {
    const orders = getAll();
    const order = orders.find((entry) => entry.id === id);
    if (!order) throw new Error("This order could not be found.");
    if (order.statusIndex >= statuses.length - 1) {
      throw new Error("This demo order has reached its final tracking status.");
    }
    order.statusIndex += 1;
    order.statusHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    order.statusHistory.push({
      status: statuses[order.statusIndex],
      at: new Date().toISOString()
    });
    save(orders);
    return order;
  }

  window.ShopOrders = { getAll, getById, create, advance, statuses: [...statuses] };
})();

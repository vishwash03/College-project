(() => {
  const page = document.querySelector("[data-account-page]");
  if (!page) {
    const profileName = document.querySelector(".profile-identity h2");
    if (profileName) {
      try {
        const settings = JSON.parse(localStorage.getItem("quickcart-profile-settings") || "{}");
        if (typeof settings.name === "string" && settings.name.trim()) {
          profileName.textContent = settings.name;
        }
      } catch (error) {
        console.error("Unable to load saved profile details.", error);
      }
    }
    const profileBalance = document.getElementById("profile-wallet-amount");
    const profileBalanceCard = document.getElementById("profile-wallet-balance");
    if (profileBalance && profileBalanceCard) {
      const balanceKey = "shop-wallet-balance";
      const renderBalance = () => {
        let storedBalance;
        try {
          storedBalance = localStorage.getItem(balanceKey);
        } catch (error) {
          console.error("Unable to read the demo wallet balance.", error);
          throw new Error("The demo balance could not be accessed. Check your browser storage settings.");
        }
        const balance = storedBalance === null ? 0 : Number(storedBalance);
        if (!Number.isSafeInteger(balance) || balance < 0) {
          throw new Error("The saved demo balance is invalid.");
        }
        profileBalance.textContent = `₹${balance.toLocaleString("en-IN")}`;
        profileBalanceCard.setAttribute("aria-label", `Demo wallet balance: ${balance} rupees. Add demo money`);
      };
      try {
        renderBalance();
      } catch (error) {
        console.error("Unable to load the demo wallet balance.", error);
        profileBalance.textContent = "Unavailable";
        profileBalanceCard.setAttribute("aria-label", "Demo wallet balance unavailable. Open wallet to review.");
      }
      const refreshBalance = () => {
        try {
          renderBalance();
        } catch (error) {
          console.error("Unable to refresh the demo wallet balance.", error);
          profileBalance.textContent = "Unavailable";
          profileBalanceCard.setAttribute("aria-label", "Demo wallet balance unavailable. Open wallet to review.");
        }
      };
      window.addEventListener("storage", (event) => {
        if (event.key === balanceKey) refreshBalance();
      });
      window.addEventListener("shop-wallet-balance-updated", refreshBalance);
    }
    return;
  }

  const kind = page.dataset.accountPage;
  const titles = {
    addresses: ["Saved Addresses", "Add and manage where your orders are delivered."],
    orders: ["Your Orders", "Keep track of your recent and past purchases."],
    wishlist: ["Your Wishlist", "Products you have saved for later."],
    settings: ["Edit Profile", "Keep your account details up to date."],
    payment: ["Payment Management", "Manage your saved payment options securely."],
    support: ["Help & Support", "Find answers or get in touch with our team."],
    rewards: ["Rewards", "Your rewards and member benefits."],
    about: ["General Information", "A little more about us."]
  };
  const [title, description] = titles[kind] || ["Account", "Manage your account."];
  page.classList.add("account-page");
  page.innerHTML = `
    <header class="account-heading">
      <a class="account-back" href="profile.html" aria-label="Back to profile">
        <i data-lucide="arrow-left" aria-hidden="true"></i>
      </a>
      <h1>${title}</h1>
    </header>
    <p class="account-intro">${description}</p>
    <div class="account-content"></div>
    <p class="account-feedback" role="status" aria-live="polite"></p>
  `;

  const content = page.querySelector(".account-content");
  const feedback = page.querySelector(".account-feedback");
  const keys = {
    addresses: "quickcart-saved-addresses",
    settings: "quickcart-profile-settings",
    payment: "quickcart-payment-methods",
    wishlist: "shop-wishlist-items"
  };

  function report(message, isError = false) {
    feedback.textContent = message;
    feedback.dataset.error = String(isError);
  }

  function read(key, fallback) {
    let serialized;
    try {
      serialized = localStorage.getItem(key);
    } catch (error) {
      console.error(`Unable to read ${key} from browser storage.`, error);
      throw new Error("Saved account information is unavailable. Check your browser storage settings.");
    }
    if (!serialized) return fallback;
    try {
      return JSON.parse(serialized);
    } catch (error) {
      console.error(`Saved account information for ${key} is invalid.`, error);
      throw new Error("Some saved account information could not be read. Clear the invalid browser data and try again.");
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save ${key} to browser storage.`, error);
      throw new Error("Your changes could not be saved. Check your browser storage settings.");
    }
  }

  function validArray(value) {
    if (!Array.isArray(value)) throw new Error("Saved account information has an invalid format.");
    return value;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(text, action, extraClass = "account-button-secondary") {
    const node = element("button", `account-button ${extraClass}`, text);
    node.type = "button";
    node.dataset.action = action;
    return node;
  }

  function renderAddresses() {
    content.innerHTML = `
      <section class="account-card">
        <h2 id="address-form-title">Add a delivery address</h2>
        <form class="account-form" id="address-form">
          <input type="hidden" name="id">
          <div class="account-field">
            <label for="address-name">Full name</label>
            <input id="address-name" name="name" autocomplete="name" required maxlength="80">
          </div>
          <div class="account-field">
            <label for="address-phone">Phone number</label>
            <input id="address-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
          </div>
          <div class="account-field account-field-wide">
            <label for="address-line">Address</label>
            <textarea id="address-line" name="line" autocomplete="street-address" required maxlength="240"></textarea>
          </div>
          <div class="account-field">
            <label for="address-city">City</label>
            <input id="address-city" name="city" autocomplete="address-level2" required maxlength="80">
          </div>
          <div class="account-field">
            <label for="address-state">State</label>
            <input id="address-state" name="state" autocomplete="address-level1" required maxlength="80">
          </div>
          <div class="account-field">
            <label for="address-postal">PIN code</label>
            <input id="address-postal" name="postal" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{6}" required>
          </div>
          <div class="account-field">
            <label for="address-type">Address type</label>
            <select id="address-type" name="type">
              <option>Home</option><option>Work</option><option>Other</option>
            </select>
          </div>
          <label class="account-check"><input type="checkbox" name="default"> Set as default delivery address</label>
          <div class="account-actions">
            <button class="account-button" type="submit">Save address</button>
            <button class="account-button account-button-secondary" type="button" data-action="cancel-edit" hidden>Cancel</button>
          </div>
        </form>
      </section>
      <section class="account-card">
        <h2>Your saved addresses</h2>
        <div class="account-list" id="address-list"></div>
      </section>
    `;

    const form = content.querySelector("#address-form");
    const list = content.querySelector("#address-list");

    function refresh() {
      list.replaceChildren();
      const addresses = validArray(read(keys.addresses, []));
      if (addresses.length === 0) {
        list.append(element("p", "account-list-copy", "No saved addresses yet. Add one above for a faster checkout."));
        return;
      }
      addresses.forEach((address) => {
        const card = element("article", "account-list-card");
        const heading = element("h3", "account-list-title", `${address.name} · ${address.type}`);
        if (address.default) heading.append(element("span", "account-badge", "Default"));
        const copy = element("p", "account-list-copy",
          `${address.line}\n${address.city}, ${address.state} ${address.postal}\n${address.phone}`);
        copy.style.whiteSpace = "pre-line";
        const actions = element("div", "account-list-actions");
        actions.append(button("Edit", `edit-address:${address.id}`));
        if (!address.default) actions.append(button("Set as default", `default-address:${address.id}`));
        actions.append(button("Remove", `remove-address:${address.id}`, "account-button-danger"));
        card.append(heading, copy, actions);
        list.append(card);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        const data = new FormData(form);
        const addresses = validArray(read(keys.addresses, []));
        const id = String(data.get("id") || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
        const record = {
          id,
          name: String(data.get("name")).trim(),
          phone: String(data.get("phone")).trim(),
          line: String(data.get("line")).trim(),
          city: String(data.get("city")).trim(),
          state: String(data.get("state")).trim(),
          postal: String(data.get("postal")).trim(),
          type: String(data.get("type")),
          default: form.elements.namedItem("default").checked
        };
        const phoneDigits = record.phone.replace(/\D/g, "").length;
        if (!/^[0-9+() -]{7,18}$/.test(record.phone) || phoneDigits < 7 || phoneDigits > 15) {
          throw new Error("Enter a valid phone number with 7 to 15 digits.");
        }
        const prior = addresses.find((address) => address.id === id);
        const next = addresses.filter((address) => address.id !== id);
        if (record.default || (!prior && addresses.length === 0)) {
          next.forEach((address) => { address.default = false; });
          record.default = true;
        }
        next.push(record);
        write(keys.addresses, next);
        form.reset();
        form.elements.id.value = "";
        content.querySelector("#address-form-title").textContent = "Add a delivery address";
        form.querySelector('[data-action="cancel-edit"]').hidden = true;
        refresh();
        report("Address saved.");
      } catch (error) {
        report(error.message, true);
      }
    });

    content.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (!action) return;
      try {
        if (action === "cancel-edit") {
          form.reset();
          form.elements.id.value = "";
          content.querySelector("#address-form-title").textContent = "Add a delivery address";
          form.querySelector('[data-action="cancel-edit"]').hidden = true;
          return;
        }
        const [operation, id] = action.split(":");
        const addresses = validArray(read(keys.addresses, []));
        const record = addresses.find((address) => address.id === id);
        if (operation === "edit-address" && record) {
          Object.entries(record).forEach(([name, value]) => {
            const control = form.elements.namedItem(name);
            if (control?.type === "checkbox") control.checked = Boolean(value);
            else if (control) control.value = value;
          });
          content.querySelector("#address-form-title").textContent = "Edit delivery address";
          form.querySelector('[data-action="cancel-edit"]').hidden = false;
          form.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (operation === "default-address") {
          addresses.forEach((address) => { address.default = address.id === id; });
          write(keys.addresses, addresses);
          refresh();
          report("Default address updated.");
        } else if (operation === "remove-address") {
          const remaining = addresses.filter((address) => address.id !== id);
          if (record?.default && remaining.length) remaining[0].default = true;
          write(keys.addresses, remaining);
          refresh();
          report("Address removed.");
        }
      } catch (error) {
        report(error.message, true);
      }
    });

    refresh();
  }

  function renderOrders() {
    content.innerHTML = `
      <section class="account-card">
        <h2>Your orders</h2>
        <div class="account-list" id="orders-list"></div>
      </section>
      <section class="account-card">
        <h2>Need help with an order?</h2>
        <p class="account-list-copy">Our support team can help with delivery, cancellations, and returns.</p>
        <a class="account-button account-button-secondary" href="help&support.html">Contact support</a>
      </section>
    `;
    const list = content.querySelector("#orders-list");
    const orders = window.ShopOrders.getAll();
    if (!orders.length) {
      const empty = element("div", "account-empty");
      const icon = element("span", "account-empty-icon");
      const iconElement = document.createElement("i");
      iconElement.dataset.lucide = "package-open";
      iconElement.setAttribute("aria-hidden", "true");
      icon.append(iconElement);
      empty.append(
        icon,
        element("h2", "", "No orders yet"),
        element("p", "", "Your orders will show up here once you place a demo order."),
      );
      const shopLink = element("a", "account-button", "Start shopping");
      shopLink.href = "index.html";
      empty.append(shopLink);
      list.append(empty);
      return;
    }

    orders.forEach((order) => {
      const card = element("article", "account-list-card");
      const heading = element("h3", "account-list-title", `Order ${order.id}`);
      heading.append(element("span", "account-badge", window.ShopOrders.statuses[order.statusIndex]));
      const date = new Date(order.createdAt);
      const description = element("p", "account-list-copy",
        `${date.toLocaleDateString("en-IN")} · ${order.items.length} ${order.items.length === 1 ? "item" : "items"} · ₹${order.total.toLocaleString("en-IN")} (demo)`);
      const actions = element("div", "account-list-actions");
      const trackingLink = element("a", "account-button", "Track demo order");
      trackingLink.href = `order-tracking.html?id=${encodeURIComponent(order.id)}`;
      actions.append(trackingLink);
      card.append(heading, description, actions);
      list.append(card);
    });
  }

  function renderSettings() {
    content.innerHTML = `
      <section class="account-card">
        <h2>Personal details</h2>
        <form class="account-form" id="settings-form">
          <div class="account-field">
            <label for="profile-name">Full name</label>
            <input id="profile-name" name="name" autocomplete="name" required maxlength="80">
          </div>
          <div class="account-field">
            <label for="profile-phone">Phone number</label>
            <input id="profile-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
          </div>
          <div class="account-field account-field-wide">
            <label for="profile-email">Email address</label>
            <input id="profile-email" name="email" type="email" autocomplete="email" maxlength="120">
          </div>
          <div class="account-actions">
            <button class="account-button" type="submit">Save changes</button>
          </div>
        </form>
      </section>
      <section class="account-card">
        <h2>Notifications</h2>
        <label class="account-switch-row">
          <span><strong>Order updates</strong><span>Get updates about orders and deliveries.</span></span>
          <input type="checkbox" name="orderUpdates" data-setting>
        </label>
        <label class="account-switch-row">
          <span><strong>Offers and recommendations</strong><span>Hear about offers and products picked for you.</span></span>
          <input type="checkbox" name="offers" data-setting>
        </label>
      </section>
    `;
    const form = content.querySelector("#settings-form");

    try {
      const settings = read(keys.settings, {});
      form.elements.name.value = typeof settings.name === "string" ? settings.name : "Arjun tak";
      form.elements.phone.value = typeof settings.phone === "string" ? settings.phone : "";
      form.elements.email.value = typeof settings.email === "string" ? settings.email : "";
      content.querySelectorAll("[data-setting]").forEach((input) => {
        input.checked = Boolean(settings[input.name]);
      });
    } catch (error) {
      report(error.message, true);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        const settings = read(keys.settings, {});
        settings.name = form.elements.name.value.trim();
        settings.phone = form.elements.phone.value.trim();
        settings.email = form.elements.email.value.trim();
        const phoneDigits = settings.phone.replace(/\D/g, "").length;
        if (settings.phone &&
            (!/^[0-9+() -]{7,18}$/.test(settings.phone) || phoneDigits < 7 || phoneDigits > 15)) {
          throw new Error("Enter a valid phone number with 7 to 15 digits.");
        }
        content.querySelectorAll("[data-setting]").forEach((input) => {
          settings[input.name] = input.checked;
        });
        write(keys.settings, settings);
        report("Your profile details have been saved.");
      } catch (error) {
        report(error.message, true);
      }
    });
    content.querySelectorAll("[data-setting]").forEach((input) => {
      input.addEventListener("change", () => {
        try {
          const settings = read(keys.settings, {});
          settings[input.name] = input.checked;
          write(keys.settings, settings);
          report("Notification preferences saved.");
        } catch (error) {
          report(error.message, true);
        }
      });
    });
  }

  function renderPayment() {
    content.innerHTML = `
      <section class="account-card">
        <h2>Add a payment method</h2>
        <form class="account-form" id="payment-form">
          <div class="account-field">
            <label for="payment-type">Payment type</label>
            <select id="payment-type" name="type"><option value="upi">UPI</option><option value="card">Card (last four digits only)</option></select>
          </div>
          <div class="account-field">
            <label for="payment-label">Display name</label>
            <input id="payment-label" name="label" placeholder="Personal UPI" maxlength="40" required>
          </div>
          <div class="account-field account-field-wide" id="upi-field">
            <label for="payment-upi">UPI ID</label>
            <input id="payment-upi" name="upi" placeholder="name@bank" maxlength="100" autocomplete="off">
          </div>
          <div class="account-field account-field-wide" id="card-field" hidden>
            <label for="payment-last4">Last four digits</label>
            <input id="payment-last4" name="last4" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off">
          </div>
          <div class="account-actions">
            <button class="account-button" type="submit">Save payment method</button>
          </div>
        </form>
        <p class="account-list-copy">For your security, do not enter or store a full card number, CVV, or PIN on this demo page.</p>
      </section>
      <section class="account-card">
        <h2>Saved payment methods</h2>
        <div class="account-list" id="payment-list"></div>
      </section>
    `;
    const form = content.querySelector("#payment-form");
    const upiField = content.querySelector("#upi-field");
    const cardField = content.querySelector("#card-field");
    const upiInput = form.elements.upi;
    const last4Input = form.elements.last4;
    const list = content.querySelector("#payment-list");

    function updatePaymentFields() {
      const isCard = form.elements.type.value === "card";
      upiField.hidden = isCard;
      cardField.hidden = !isCard;
      upiInput.required = !isCard;
      last4Input.required = isCard;
    }
    form.elements.type.addEventListener("change", updatePaymentFields);
    updatePaymentFields();

    function refresh() {
      list.replaceChildren();
      const methods = validArray(read(keys.payment, []));
      if (!methods.length) {
        list.append(element("p", "account-list-copy", "No payment methods saved."));
        return;
      }
      methods.forEach((method) => {
        const card = element("article", "account-list-card");
        const label = element("h3", "account-list-title", method.label);
        const detail = element("p", "account-list-copy",
          method.type === "upi" ? `UPI · ${method.upi}` : `Card ending in ${method.last4}`);
        const actions = element("div", "account-list-actions");
        actions.append(button("Remove", `remove-payment:${method.id}`, "account-button-danger"));
        card.append(label, detail, actions);
        list.append(card);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        const methods = validArray(read(keys.payment, []));
        const isCard = form.elements.type.value === "card";
        const record = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: isCard ? "card" : "upi",
          label: form.elements.label.value.trim(),
          ...(isCard ? { last4: last4Input.value } : { upi: upiInput.value.trim() })
        };
        if (isCard && !/^\d{4}$/.test(record.last4)) throw new Error("Enter the last four digits of the card.");
        if (!isCard && !/^[^@\s]+@[^@\s]+$/.test(record.upi)) throw new Error("Enter a valid UPI ID.");
        methods.push(record);
        write(keys.payment, methods);
        form.reset();
        updatePaymentFields();
        refresh();
        report("Payment method saved.");
      } catch (error) {
        report(error.message, true);
      }
    });
    content.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (!action?.startsWith("remove-payment:")) return;
      try {
        const id = action.split(":")[1];
        const methods = validArray(read(keys.payment, []));
        write(keys.payment, methods.filter((method) => method.id !== id));
        refresh();
        report("Payment method removed.");
      } catch (error) {
        report(error.message, true);
      }
    });
    refresh();
  }

  function renderWishlist() {
    content.innerHTML = `
      <section class="account-card">
        <h2>Saved products</h2>
        <div class="account-list" id="wishlist-list"></div>
      </section>
    `;
    const list = content.querySelector("#wishlist-list");

    function refresh() {
      list.replaceChildren();
      const items = validArray(read(keys.wishlist, []));
      if (!items.length) {
        const empty = element("div", "account-empty");
        const icon = element("span", "account-empty-icon");
        const heart = document.createElement("i");
        heart.dataset.lucide = "heart";
        heart.setAttribute("aria-hidden", "true");
        icon.append(heart);
        empty.append(icon, element("h2", "", "Your wishlist is waiting"),
          element("p", "", "Save products you like with the heart button while browsing."));
        const link = element("a", "account-button", "Explore products");
        link.href = "index.html";
        empty.append(link);
        list.append(empty);
        if (window.lucide) window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
        return;
      }
      items.forEach((item) => {
        const card = element("article", "account-list-card account-item");
        const imageWrap = element("div", "account-item-image");
        if (typeof item.image === "string" && item.image) {
          const image = document.createElement("img");
          image.src = item.image;
          image.alt = item.name;
          imageWrap.append(image);
        } else {
          imageWrap.append(element("span", "", "🛍️"));
        }
        const details = element("div", "account-item-info");
        details.append(element("strong", "", item.name),
          element("span", "", `₹${Number(item.price).toLocaleString("en-IN")}`));
        const actions = element("div", "account-list-actions");
        const add = button("Add to cart", `add-wishlist:${item.name}`, "account-button");
        const remove = button("Remove", `remove-wishlist:${item.name}`, "account-button-danger");
        actions.append(add, remove);
        details.append(actions);
        card.append(imageWrap, details);
        list.append(card);
      });
    }

    content.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (!action?.includes("-wishlist:")) return;
      try {
        const [operation, ...nameParts] = action.split(":");
        const name = nameParts.join(":");
        const items = validArray(read(keys.wishlist, []));
        const item = items.find((entry) => entry.name === name);
        if (operation === "remove-wishlist") {
          write(keys.wishlist, items.filter((entry) => entry.name !== name));
          refresh();
          report("Product removed from your wishlist.");
        } else if (operation === "add-wishlist") {
          if (!window.ShopCart) throw new Error("Cart services are unavailable. Reload the page and try again.");
          if (item) window.ShopCart.add({ ...item, quantity: 1 });
          report("Product added to your cart.");
        }
      } catch (error) {
        report(error.message, true);
      }
    });
    window.addEventListener("quickcart-wishlist-updated", refresh);
    refresh();
  }

  function renderSupport() {
    content.innerHTML = `
      <section class="account-card account-faq">
        <h2>Frequently asked questions</h2>
        <details><summary>Where can I find my order status?</summary><p>Open Your Orders from your profile. Recent orders and their delivery status will be listed there.</p></details>
        <details><summary>How do I change my delivery address?</summary><p>Open Saved Addresses in your profile to add, edit, remove, or choose a default delivery address.</p></details>
        <details><summary>How do refunds work?</summary><p>Refund updates are associated with the original order. Contact our support team with your order details if you need help.</p></details>
        <details><summary>How do I manage payment options?</summary><p>Use Payment Management in your profile to add or remove saved UPI details and card summaries.</p></details>
      </section>
      <section class="account-card">
        <h2>Still need help?</h2>
        <p class="account-list-copy">Send us a message and include your order number if your question is about a purchase.</p>
        <div class="account-actions">
          <a class="account-button" href="mailto:?subject=Support">Email support</a>
          <a class="account-button account-button-secondary" href="profile.html">Back to profile</a>
        </div>
      </section>
    `;
  }

  function renderRewards() {
    content.innerHTML = `
      <section class="account-card account-empty">
        <span class="account-empty-icon"><i data-lucide="gift" aria-hidden="true"></i></span>
        <h2>Your rewards start here</h2>
        <p>Explore special picks and offers. Reward points will appear here when they are available on your account.</p>
        <a class="account-button" href="special.html">Explore special picks</a>
      </section>
      <section class="account-card">
        <h2>Your benefits</h2>
        <div class="account-info-grid">
          <article class="account-info-tile"><i data-lucide="sparkles" aria-hidden="true"></i><strong>Discover</strong><p>Find seasonal products and curated collections.</p></article>
          <article class="account-info-tile"><i data-lucide="wallet-cards" aria-hidden="true"></i><strong>Cash &amp; Gift Cards</strong><p>View your stored balance and gift cards in Wallet.</p></article>
          <article class="account-info-tile"><i data-lucide="shopping-bag" aria-hidden="true"></i><strong>Shop again</strong><p>Check your orders and find your next favorite item.</p></article>
        </div>
      </section>
    `;
  }

  function renderAbout() {
    content.innerHTML = `
      <section class="account-card">
        <h2>Welcome</h2>
        <p class="account-list-copy">Find everyday shopping in one convenient place. Browse categories, discover new products, and manage your shopping from your account.</p>
      </section>
      <section class="account-card">
        <h2>Shopping made simple</h2>
        <div class="account-info-grid">
          <article class="account-info-tile"><i data-lucide="search" aria-hidden="true"></i><strong>Explore</strong><p>Browse products across our shopping categories.</p></article>
          <article class="account-info-tile"><i data-lucide="map-pin" aria-hidden="true"></i><strong>Deliver</strong><p>Save an address to make delivery details easy to manage.</p></article>
          <article class="account-info-tile"><i data-lucide="heart" aria-hidden="true"></i><strong>Save favorites</strong><p>Keep products you like together in your wishlist.</p></article>
        </div>
      </section>
      <section class="account-card">
        <h2>Need a hand?</h2>
        <p class="account-list-copy">Visit Help &amp; Support for common questions or get in touch with our team.</p>
        <a class="account-button account-button-secondary" href="help&support.html">Help &amp; Support</a>
      </section>
    `;
  }

  const renderers = {
    addresses: renderAddresses,
    orders: renderOrders,
    wishlist: renderWishlist,
    settings: renderSettings,
    payment: renderPayment,
    support: renderSupport,
    rewards: renderRewards,
    about: renderAbout
  };

  try {
    (renderers[kind] || renderAbout)();
  } catch (error) {
    report(error.message, true);
  }

  if (kind === "settings") {
    document.addEventListener("submit", (event) => {
      if (event.target.id !== "settings-form") return;
      const name = event.target.elements.name.value.trim();
      const nameHeading = document.querySelector(".profile-identity h2");
      if (nameHeading) nameHeading.textContent = name;
    });
  }
  if (window.lucide) window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
})();

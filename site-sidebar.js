(() => {
  const existingSidebar = document.querySelector(".sidebar");
  if (!existingSidebar) document.body.classList.add("site-sidebar-no-legacy");

  const links = [
    { href: "index.html", label: "Home", icon: "house", fallback: "⌂" },
    { href: "search.html", label: "Search", icon: "search", fallback: "⌕" },
    { href: "categories.html", label: "Categories", icon: "compass", fallback: "◎" },
    { href: "cart.html", label: "Cart", icon: "shopping-cart", fallback: "🛒" },
    { href: "wallet.html", label: "Wallet", icon: "wallet", fallback: "▱" }
  ];

  const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const categoryLinks = [
    { href: "index.html", label: "🛍️ All" },
    { href: "cafe.html", label: "☕ Cafe" },
    { href: "index.html", label: "🏠 Home" },
    { href: "toys.html", label: "🎮 Toys" },
    { href: "fresh.html", label: "🥬 Fresh" },
    { href: "electronics.html", label: "🎧 Electronics" },
    { href: "mobiles.html", label: "📱 Mobiles" },
    { href: "beauty.html", label: "💄 Beauty" },
    { href: "fashion.html", label: "👗 Fashion" },
    { href: "skincare.html", label: "🧴 Skincare" },
    { href: "baby-product.html", label: "🍼 Baby Product" },
    { href: "special.html", label: "✨ Special" },
    { href: "mens.html", label: "👔 Men's" }
  ];

  document.querySelectorAll(".nav-tabs, .category-tabs, .category-nav").forEach((nav) => {
    const isExploreNavigation = currentPage === "categories.html" && nav.classList.contains("nav-tabs");
    const categoryClass = nav.classList.contains("category-tabs") ? "category-tab" : "";
    const linksToRender = isExploreNavigation
      ? [{ href: "categories.html", label: "🧭 Explore", explore: true }, ...categoryLinks]
      : categoryLinks;

    nav.replaceChildren();
    linksToRender.forEach(({ href, label, explore }) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      if (categoryClass) link.classList.add(categoryClass);

      const isCurrentLink = explore
        ? currentPage === "categories.html"
        : currentPage === href.toLowerCase() &&
          !(currentPage === "index.html" && label === "🏠 Home");
      if (isCurrentLink) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
      nav.append(link);
    });

    if (nav.classList.contains("category-tabs") &&
        !nav.previousElementSibling?.classList.contains("header-divider")) {
      const divider = document.createElement("hr");
      divider.className = "header-divider";
      divider.setAttribute("aria-hidden", "true");
      nav.before(divider);
    }
  });

  const sidebar = document.createElement("aside");
  sidebar.className = "site-sidebar";
  sidebar.setAttribute("aria-label", "Main navigation");

  const inner = document.createElement("div");
  inner.className = "site-sidebar-inner";

  const toggle = document.createElement("button");
  toggle.className = "site-sidebar-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-label", "Expand sidebar");
  toggle.setAttribute("aria-expanded", "false");
  const toggleIcon = document.createElement("i");
  toggleIcon.dataset.lucide = "panel-left-open";
  toggleIcon.dataset.fallback = "☰";
  toggleIcon.setAttribute("aria-hidden", "true");
  toggle.append(toggleIcon);

  const navigation = document.createElement("nav");
  navigation.className = "site-sidebar-nav";
  navigation.setAttribute("aria-label", "Main pages");

  links.forEach(({ href, label, icon, fallback }) => {
    const link = document.createElement("a");
    link.className = "site-sidebar-link";
    link.href = href;
    link.setAttribute("aria-label", label);
    const isCurrentPage = href.toLowerCase() === currentPage ||
      (href === "categories.html" && [
        "beauty.html", "cafe.html", "electronics.html", "fashion.html",
        "fresh.html", "mobiles.html", "toys.html"
      ].includes(currentPage));
    if (isCurrentPage) link.setAttribute("aria-current", "page");

    const iconHolder = document.createElement("span");
    iconHolder.className = "site-sidebar-icon";
    iconHolder.setAttribute("aria-hidden", "true");
    const iconElement = document.createElement("i");
    iconElement.dataset.lucide = icon;
    iconElement.dataset.fallback = fallback;
    iconHolder.append(iconElement);

    const text = document.createElement("span");
    text.className = "site-sidebar-label";
    text.textContent = label;
    link.append(iconHolder, text);
    navigation.append(link);
  });

  const divider = document.createElement("hr");
  divider.className = "site-sidebar-divider";

  const secondaryNavigation = document.createElement("nav");
  secondaryNavigation.className = "site-sidebar-nav";
  secondaryNavigation.setAttribute("aria-label", "Support");
  const supportLink = document.createElement("a");
  supportLink.className = "site-sidebar-link";
  supportLink.href = "help&support.html";
  supportLink.setAttribute("aria-label", "Help and Support");
  if (currentPage === "help&support.html") supportLink.setAttribute("aria-current", "page");
  const supportIcon = document.createElement("span");
  supportIcon.className = "site-sidebar-icon";
  supportIcon.setAttribute("aria-hidden", "true");
  const supportGlyph = document.createElement("i");
  supportGlyph.dataset.lucide = "circle-help";
  supportGlyph.dataset.fallback = "?";
  supportIcon.append(supportGlyph);
  const supportLabel = document.createElement("span");
  supportLabel.className = "site-sidebar-label";
  supportLabel.textContent = "Help & Support";
  supportLink.append(supportIcon, supportLabel);
  secondaryNavigation.append(supportLink);

  const profileWrap = document.createElement("div");
  profileWrap.className = "site-sidebar-profile-wrap";
  const profileLink = document.createElement("a");
  profileLink.className = "site-sidebar-profile";
  profileLink.href = "profile.html";
  profileLink.setAttribute("aria-label", "Profile");
  const avatar = document.createElement("span");
  avatar.className = "site-sidebar-avatar";
  avatar.setAttribute("aria-hidden", "true");
  const profileIcon = document.createElement("i");
  profileIcon.dataset.lucide = "user-round";
  profileIcon.dataset.fallback = "●";
  avatar.append(profileIcon);
  const profileLabel = document.createElement("span");
  profileLabel.className = "site-sidebar-label";
  profileLabel.textContent = "Profile";
  profileLink.append(avatar, profileLabel);
  profileWrap.append(profileLink);

  inner.append(toggle, navigation, divider, secondaryNavigation, profileWrap);
  sidebar.append(inner);
  document.body.append(sidebar);

  toggle.addEventListener("click", () => {
    const expanded = sidebar.classList.toggle("site-sidebar-expanded");
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-label", expanded ? "Collapse sidebar" : "Expand sidebar");
    const nextIcon = document.createElement("i");
    nextIcon.dataset.lucide = expanded ? "panel-left-close" : "panel-left-open";
    nextIcon.dataset.fallback = "☰";
    nextIcon.setAttribute("aria-hidden", "true");
    toggle.replaceChildren(nextIcon);
    renderIcons();
  });

  function renderIcons() {
    if (window.lucide) {
      window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
      return;
    }
    document.querySelectorAll(".site-sidebar [data-fallback]").forEach((icon) => {
      icon.textContent = icon.dataset.fallback;
    });
  }

  if (window.lucide) {
    renderIcons();
  } else {
    const iconScript = document.createElement("script");
    iconScript.src = "https://unpkg.com/lucide@latest";
    iconScript.onload = renderIcons;
    iconScript.onerror = () => {
      console.error("Unable to load Lucide icons for the site navigation.");
      renderIcons();
    };
    document.head.append(iconScript);
  }
})();

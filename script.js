const products = [
      {id:1,name:"iPhone 15",category:"Mobiles",price:79900,old:89900,off:11,rating:"4.8",reviews:120,image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=85"},
      {id:2,name:"MacBook Air M2",category:"Laptops",price:99990,old:119900,off:17,rating:"4.7",reviews:98,image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=85"},
      {id:3,name:"Wireless Noise-Cancelling Headphones",category:"Audio",price:29990,old:34990,off:14,rating:"4.6",reviews:75,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=85"},
      {id:4,name:"Everyday White Sneakers",category:"Footwear",price:7499,old:9999,off:25,rating:"4.5",reviews:65,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=85"},
      {id:5,name:"Classic Travel Backpack",category:"Fashion",price:2499,old:3499,off:29,rating:"4.4",reviews:42,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=85"},
      {id:6,name:"Smart Watch",category:"Audio",price:4999,old:6999,off:29,rating:"4.3",reviews:51,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85"},
      {id:7,name:"Minimal Desk Lamp",category:"Home",price:1899,old:2499,off:24,rating:"4.6",reviews:38,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=85"},
      {id:8,name:"Everyday Cotton T-Shirt",category:"Fashion",price:799,old:1199,off:33,rating:"4.2",reviews:87,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=85"}
    ];
    // Replace the sample lamp URL with a valid product photo.
    products[6].image = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=85";
    const cart = new Map();
    let activeCategory = "All";
    const money = n => "₹" + n.toLocaleString("en-IN");
    const grid = document.getElementById("productGrid");

    function renderProducts() {
      const term = document.getElementById("searchInput").value.trim().toLowerCase();
      const visible = products.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
        (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)));
      grid.innerHTML = visible.map(p => `
        <div class="col-6 col-md-4 col-xl-3">
          <article class="product-card">
            <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x400/f3f7fc/142238?text=ShopEase'">
            <div class="product-info">
              <div class="product-name">${p.name}</div>
              <div class="rating mb-2" aria-label="${p.rating} out of 5 stars">★★★★★ <small>${p.rating} (${p.reviews})</small></div>
              <div class="d-flex flex-wrap align-items-center gap-2 mb-3"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span><span class="discount">${p.off}% OFF</span></div>
              <button class="btn btn-brand add-cart" onclick="addToCart(${p.id})"><i class="bi bi-cart-plus me-1"></i> Add to Cart</button>
            </div>
          </article>
        </div>`).join("");
      document.getElementById("emptyState").classList.toggle("d-none", visible.length !== 0);
      document.getElementById("resultCount").textContent = `${visible.length} product${visible.length === 1 ? "" : "s"} shown`;
      document.getElementById("productHeading").textContent = activeCategory === "All" ? "Featured Products" : activeCategory;
    }
    function addToCart(id) {
      cart.set(id, (cart.get(id) || 0) + 1);
      renderCart();
      document.getElementById("toastMessage").textContent = `${products.find(p => p.id === id).name} added to your cart`;
      bootstrap.Toast.getOrCreateInstance(document.getElementById("liveToast")).show();
    }
    function changeQty(id, delta) {
      const next = (cart.get(id) || 0) + delta;
      if (next <= 0) cart.delete(id); else cart.set(id, next);
      renderCart();
    }
    function renderCart() {
      const count = [...cart.values()].reduce((a,b) => a+b, 0);
      document.getElementById("cartCount").textContent = count;
      const entries = [...cart.entries()];
      document.getElementById("cartItems").innerHTML = entries.length ? entries.map(([id,qty]) => {
        const p = products.find(x => x.id === id);
        return `<div class="d-flex gap-3 align-items-center mb-3">
          <img src="${p.image}" alt="" style="width:76px;height:76px;object-fit:contain;border:1px solid #e3e9f2;border-radius:9px">
          <div class="flex-grow-1"><div class="fw-semibold">${p.name}</div><div class="text-secondary small">${money(p.price)}</div>
          <div class="d-flex align-items-center gap-2 mt-2"><button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${id},-1)" aria-label="Decrease quantity">−</button><span>${qty}</span><button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${id},1)" aria-label="Increase quantity">+</button></div></div>
          <strong>${money(p.price*qty)}</strong></div>`;
      }).join("") : '<div class="text-center text-secondary py-5"><i class="bi bi-bag fs-1"></i><p class="mt-3">Your cart is empty.</p></div>';
      const total = entries.reduce((sum,[id,qty]) => sum + products.find(p => p.id === id).price*qty, 0);
      document.getElementById("cartTotal").textContent = money(total);
    }
    document.getElementById("searchInput").addEventListener("input", renderProducts);
    document.getElementById("searchForm").addEventListener("submit", e => { e.preventDefault(); renderProducts(); document.getElementById("products").scrollIntoView({behavior:"smooth"}); });
    document.querySelectorAll("[data-category]").forEach(btn => btn.addEventListener("click", () => {
      activeCategory = activeCategory === btn.dataset.category ? "All" : btn.dataset.category;
      document.querySelectorAll("[data-category]").forEach(b => b.classList.toggle("selected", b.dataset.category === activeCategory));
      renderProducts();
      document.getElementById("products").scrollIntoView({behavior:"smooth"});
    }));
    document.getElementById("showAll").addEventListener("click", () => {
      activeCategory = "All"; document.getElementById("searchInput").value = "";
      document.querySelectorAll("[data-category]").forEach(b => b.classList.remove("selected"));
      renderProducts();
    });
    document.getElementById("checkoutBtn").addEventListener("click", () => {
      if (!cart.size) { document.getElementById("toastMessage").textContent = "Your cart is empty."; }
      else { document.getElementById("toastMessage").textContent = "Demo checkout: payment is not connected."; }
      bootstrap.Toast.getOrCreateInstance(document.getElementById("liveToast")).show();
    });
    document.getElementById("year").textContent = new Date().getFullYear();
    renderProducts(); renderCart();

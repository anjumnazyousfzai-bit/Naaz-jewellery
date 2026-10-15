// Naaz Jewellery: product data and small front-end interactions.
// Prices and product details below are sample data for this demo website.
const products = [
  {id:1,name:"Golden Hour Necklace",category:"Necklaces",price:8500,image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85",badge:"Bestseller"},
  {id:2,name:"Everyday Gold Ring",category:"Rings",price:5200,image:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85",badge:"Loved"},
  {id:3,name:"Pearl Drop Earrings",category:"Earrings",price:3900,image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85",badge:"New"},
  {id:4,name:"The Bridal Glow Set",category:"Bridal",price:24500,image:"https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=85",badge:"Special"},
  {id:5,name:"Dainty Layered Chain",category:"Necklaces",price:6800,image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=85",badge:"Bestseller"},
  {id:6,name:"Classic Sparkle Ring",category:"Rings",price:7200,image:"https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=85",badge:"Timeless"},
  {id:7,name:"Golden Bloom Earrings",category:"Earrings",price:4600,image:"https://images.unsplash.com/photo-1635767798638-3665a6a7f4a4?auto=format&fit=crop&w=800&q=85",badge:"New"},
  {id:8,name:"Wedding Heirloom Set",category:"Bridal",price:28900,image:"https://images.unsplash.com/photo-1599459183200-59c7687a0275?auto=format&fit=crop&w=800&q=85",badge:"Statement"}
];

const cart = [];
const wishlist = new Set();
const productGrid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const productSearch = document.getElementById("productSearch");
const toast = new bootstrap.Toast(document.getElementById("siteToast"), {delay:2200});

function formatPrice(price) {
  return new Intl.NumberFormat("en-PK", {style:"currency", currency:"PKR", maximumFractionDigits:0}).format(price);
}
function showToast(message) {
  document.getElementById("toastText").textContent = message;
  toast.show();
}
function renderProducts() {
  const category = categoryFilter.value;
  const query = productSearch.value.trim().toLowerCase();
  const visibleProducts = products.filter(product =>
    (category === "All" || product.category === category) &&
    (product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query))
  );
  productGrid.innerHTML = "";
  document.getElementById("noResults").classList.toggle("d-none", visibleProducts.length !== 0);

  visibleProducts.forEach(product => {
    const column = document.createElement("div");
    column.className = "col-6 col-lg-3";
    const isWished = wishlist.has(product.id);
    column.innerHTML = `
      <article class="product-card">
        <div class="product-photo">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-badge">${product.badge}</span>
          <button class="wish-btn ${isWished ? "is-wished" : ""}" data-wish="${product.id}" aria-label="${isWished ? "Remove from" : "Add to"} wishlist">
            <i class="bi ${isWished ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">${formatPrice(product.price)}</div>
          <div class="product-bottom"><span class="small text-muted"><i class="bi bi-star-fill text-warning"></i> 4.9</span>
            <button class="add-btn" data-add="${product.id}"><i class="bi bi-bag-plus me-1"></i> Add to bag</button>
          </div>
        </div>
      </article>`;
    productGrid.appendChild(column);
  });
  productGrid.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => addToCart(Number(button.dataset.add))));
  productGrid.querySelectorAll("[data-wish]").forEach(button => button.addEventListener("click", () => toggleWishlist(Number(button.dataset.wish))));
}
function updateCounts() {
  document.getElementById("cartCount").textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("wishCount").textContent = wishlist.size;
}
function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({...product, quantity:1});
  updateCounts();
  showToast(`${product.name} added to your bag.`);
}
function toggleWishlist(id) {
  const product = products.find(item => item.id === id);
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast(`${product.name} removed from wishlist.`);
  } else {
    wishlist.add(id);
    showToast(`${product.name} saved to wishlist.`);
  }
  updateCounts();
  renderProducts();
}
categoryFilter.addEventListener("change", renderProducts);
productSearch.addEventListener("input", renderProducts);
document.querySelectorAll("[data-filter]").forEach(link => link.addEventListener("click", () => {
  categoryFilter.value = link.dataset.filter;
  renderProducts();
}));
document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
  productSearch.focus({preventScroll:true});
});
document.getElementById("wishlistNav").addEventListener("click", () => {
  categoryFilter.value = "All";
  productSearch.value = "";
  renderProducts();
  showToast(wishlist.size ? `You have ${wishlist.size} saved item(s). Look for the filled hearts.` : "Your wishlist is empty. Tap a heart to save a piece.");
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
});
document.getElementById("cartToggle").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your bag is empty. Explore our favourites!");
    document.getElementById("shop").scrollIntoView({behavior:"smooth"});
    return;
  }
  const summary = cart.map(item => `${item.name} × ${item.quantity}`).join(", ");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  showToast(`Bag: ${summary}. Total ${formatPrice(total)} (demo only).`);
});
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("newsletterEmail");
  document.getElementById("newsletterMessage").textContent = `Thanks! ${email.value} has been added for this demo. No email was sent or stored.`;
  event.target.reset();
});
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("contactStatus").textContent = "Thank you for your message! This demo form is not connected to a server, so your message has not been sent.";
  event.target.reset();
});
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
updateCounts();

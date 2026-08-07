
const products = [
  {
    id: 1, name: "Red Rose Bouquet",
    cat: "rose",       tags: ["popular", "sale"],
    emoji: "🌹",       price: 12.99, oldPrice: 15.99, discount: "-19%",
    rating: 5,         reviews: 128
  },
  {
    id: 2, name: "Pink Tulip Bundle",
    cat: "tulip",      tags: ["popular", "new"],
    emoji: "🌷",       price: 14.99, oldPrice: 18.99, discount: "-21%",
    rating: 5,         reviews: 94
  },
  {
    id: 3, name: "Sunflower Pot",
    cat: "sunflower",  tags: ["new"],
    emoji: "🌻",       price: 9.99,  oldPrice: 12.99, discount: "-23%",
    rating: 4,         reviews: 67
  },
  {
    id: 4, name: "White Lily Vase",
    cat: "exotic",     tags: ["popular"],
    emoji: "🌼",       price: 16.99, oldPrice: 19.99, discount: "-15%",
    rating: 5,         reviews: 110
  },
  {
    id: 5, name: "Mixed Spring Pot",
    cat: "bouquet",    tags: ["popular", "sale"],
    emoji: "💐",       price: 11.99, oldPrice: 14.99, discount: "-20%",
    rating: 5,         reviews: 83
  },
  {
    id: 6, name: "Exotic Orchid Set",
    cat: "exotic",     tags: ["new"],
    emoji: "🌺",       price: 21.99, oldPrice: 26.99, discount: "-19%",
    rating: 4,         reviews: 55
  },
  {
    id: 7, name: "Classic Rose Pot",
    cat: "rose",       tags: ["sale"],
    emoji: "🥀",       price: 8.99,  oldPrice: 11.99, discount: "-25%",
    rating: 4,         reviews: 72
  },
  {
    id: 8, name: "Lavender Dreams",
    cat: "exotic",     tags: ["new", "popular"],
    emoji: "💜",       price: 13.99, oldPrice: 16.99, discount: "-18%",
    rating: 5,         reviews: 101
  },
];


/* ============================================================
   2. REVIEWS DATA ARRAY
   Each object represents one customer testimonial.

   Properties:
     name   {string} — customer full name
     role   {string} — label shown below the name
     stars  {number} — star count 1–5
     text   {string} — review body text
============================================================ */
const reviews = [
  {
    name: "Sarah M.",
    role: "Happy Customer",
    stars: 5,
    text: "Absolutely stunning arrangement! The roses were fresh for over two weeks and the delivery was super fast. Will definitely order again!"
  },
  {
    name: "John Deo",
    role: "Happy Customer",
    stars: 5,
    text: "Best flower shop I've used. The custom bouquet I ordered for my wife's birthday was breathtaking. Exceptional quality and service."
  },
  {
    name: "Emily R.",
    role: "Verified Buyer",
    stars: 5,
    text: "I'm so impressed with the quality and care that goes into every arrangement. The packaging was beautiful and the flowers arrived perfectly."
  },
  {
    name: "Mike T.",
    role: "Regular Customer",
    stars: 4,
    text: "Great selection of flowers and really competitive prices. The staff was helpful in choosing the right arrangement for the occasion."
  },
  {
    name: "Lisa K.",
    role: "Happy Customer",
    stars: 5,
    text: "Ordered the exotic orchid set and it was even more beautiful in person. Excellent communication and fast delivery. Highly recommend!"
  },
  {
    name: "David W.",
    role: "First-time Buyer",
    stars: 5,
    text: "Couldn't be happier with my first order. The sunflower pot brightened up my whole living room. Amazing quality for the price!"
  },
];


/* ============================================================
   3. STATE VARIABLES
   These hold the current runtime state of the page.

   cart     {Array}  — list of products currently in the cart.
                        Each entry is a copy of a product object
                        plus a `qty` (quantity) property.
                        Example: { id:1, name:"...", price:12.99, qty:2, ... }

   wishlist {Set}    — a Set of product IDs that the user has liked.
                        Using a Set ensures each ID is stored only once
                        and gives O(1) has/add/delete operations.
============================================================ */
let cart     = [];          // shopping cart — starts empty
let wishlist = new Set();   // wishlist — starts with no liked products


/* ============================================================
   4. renderProducts(filter)
   Builds HTML for product cards and injects them into
   the #productGrid element in index.html.

   @param {string} filter  'all' renders every product.
                           A tag slug ('popular' | 'new' | 'sale')
                           renders only matching products.

   How it works:
   1. Filter the products array (or keep all).
   2. Map each product to an HTML string.
   3. Join all strings into one big HTML block.
   4. Set grid.innerHTML to replace whatever was there.
============================================================ */
function renderProducts(filter) {
  // Get the product grid container from the DOM
  const grid = document.getElementById('productGrid');

  // Step 1: filter products or keep all
  const filtered = filter === 'all'
    ? products                                    // no filter — show everything
    : products.filter(p => p.tags.includes(filter)); // keep only products with this tag

  // Step 2-4: build HTML and inject into the grid
  grid.innerHTML = filtered.map(p => `

    <!-- Product card — data-id lets filterProducts() find the matching data object -->
    <div class="product-card" data-id="${p.id}">

      <!-- ── Image area ──────────────────────── -->
      <div class="product-img">

        <!-- Emoji placeholder (replace with <img src="..."> for real photos) -->
        <span style="font-size:4.5rem;">${p.emoji}</span>

        <!-- Discount percentage badge in the top-left corner -->
        <span class="discount-badge">${p.discount}</span>

        <!-- Wishlist heart button in the top-right corner
             - "liked" class added if product is already wishlisted
             - calls toggleWishlist() with the product id and itself (this) -->
        <button
          class="wishlist-btn ${wishlist.has(p.id) ? 'liked' : ''}"
          onclick="toggleWishlist(${p.id}, this)"
        >${wishlist.has(p.id) ? '❤️' : '♡'}</button>

      </div><!-- end product-img -->

      <!-- ── Card text info ────────────────────── -->
      <div class="product-info">

        <!-- Product name -->
        <div class="product-name">${p.name}</div>

        <!-- Star rating row
             '★'.repeat(rating)  → filled stars
             '☆'.repeat(5-rating) → empty stars -->
        <div class="product-rating">
          <span class="stars">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>

        <!-- Bottom row: sale price + original price + Add to Cart -->
        <div class="product-footer">
          <div class="price-wrap">
            <span class="price-new">$${p.price.toFixed(2)}</span>
            <span class="price-old">$${p.oldPrice.toFixed(2)}</span>
          </div>
          <!-- Add to Cart calls addToCart() with the product id -->
          <button class="add-cart" onclick="addToCart(${p.id})">🛒 Add</button>
        </div>

      </div><!-- end product-info -->

    </div><!-- end product-card -->

  `).join(''); // join array of strings into one HTML block
}


/* ============================================================
   5. renderReviews()
   Builds HTML for review cards and injects them into
   the #reviewGrid element in index.html.

   How it works:
   1. Defines a helper to extract initials from a name.
   2. Maps each review to an HTML string.
   3. Sets grid.innerHTML.
============================================================ */
function renderReviews() {
  // Get the review grid container from the DOM
  const grid = document.getElementById('reviewGrid');

  // Helper: extract initials — "John Deo" → "JD"
  // Split by space, take the first character of each word, join together.
  const initials = name => name.split(' ').map(word => word[0]).join('');

  // Build and inject review card HTML
  grid.innerHTML = reviews.map(r => `

    <div class="review-card">

      <!-- Large decorative quotation mark (top-right, via CSS absolute position) -->
      <div class="quote-icon">"</div>

      <!-- Star rating: repeat ★ for each star -->
      <div class="review-stars">${'★'.repeat(r.stars)}</div>

      <!-- Review body text -->
      <p class="review-text">${r.text}</p>

      <!-- Reviewer row: initials circle + name + role -->
      <div class="reviewer">
        <!-- Circle avatar showing reviewer's initials -->
        <div class="reviewer-avatar">${initials(r.name)}</div>
        <div class="reviewer-info">
          <strong>${r.name}</strong>
          <span>${r.role}</span>
        </div>
      </div>

    </div><!-- end review-card -->

  `).join('');
}


/* ============================================================
   6. addToCart(id)
   Adds a product to the cart, or increments its quantity
   if it is already there.

   @param {number} id  The id of the product to add.

   Steps:
   1. Find the product data object in the products array.
   2. Check if it already exists in the cart array.
   3a. If yes → increment its qty.
   3b. If no  → spread the product object and add qty:1.
   4. Refresh the cart UI.
   5. Show a toast confirmation message.
============================================================ */
function addToCart(id) {
  // Step 1: find product data by id
  const product = products.find(p => p.id === id);

  // Step 2: check if this product is already in the cart
  const existing = cart.find(item => item.id === id);

  if (existing) {
    // Step 3a: product already in cart — just bump the quantity
    existing.qty++;
  } else {
    // Step 3b: new cart entry — copy all product properties + add qty:1
    cart.push({ ...product, qty: 1 });
  }

  // Step 4: sync the cart sidebar with the new state
  updateCartUI();

  // Step 5: confirm the action with a toast pop-up
  showToast(`🌸 ${product.name} added to cart!`);
}


/* ============================================================
   7. updateCartUI()
   Reads the current `cart` array and updates 3 parts of the UI:
     a) Nav badge  — shows total item count
     b) Cart total — shows total dollar amount
     c) Cart items — re-renders the list inside the sidebar

   Called by: addToCart(), changeQty()
============================================================ */
function updateCartUI() {
  const badge = document.getElementById('cartBadge');

  /* ── a) Nav badge ── */
  // Sum all qty values to get total item count
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (totalItems > 0) {
    badge.style.display = 'flex'; // show the badge
    badge.textContent = totalItems;
  } else {
    badge.style.display = 'none'; // hide when cart is empty
  }

  /* ── b) Cart total price ── */
  // Sum (price × qty) for every item
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cartTotal').textContent = '$' + totalAmount.toFixed(2);

  /* ── c) Cart item list ── */
  const itemsContainer = document.getElementById('cartItems');

  if (cart.length === 0) {
    // Show empty-cart placeholder when there are no items
    itemsContainer.innerHTML = `
      <div class="empty-cart">
        <span class="empty-icon">🛍️</span>
        Your cart is empty.<br />Start adding beautiful flowers!
      </div>
    `;
  } else {
    // Build one card row for each item in the cart
    itemsContainer.innerHTML = cart.map(item => `

      <div class="cart-item">

        <!-- Emoji thumbnail for the item -->
        <div class="cart-item-img">${item.emoji}</div>

        <div class="cart-item-info">

          <!-- Item name and price -->
          <div class="name">${item.name}</div>
          <div class="cprice">$${item.price.toFixed(2)}</div>

          <!-- Quantity controls: minus button | count | plus button -->
          <!-- changeQty(-1) decrements; changeQty(+1) increments   -->
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},  1)">+</button>
          </div>

        </div><!-- end cart-item-info -->

      </div><!-- end cart-item -->

    `).join('');
  }
}


/* ============================================================
   8. changeQty(id, delta)
   Increments or decrements the quantity of a cart item.
   Removes the item from the cart if qty drops to 0 or below.

   @param {number} id     Product id of the item to change.
   @param {number} delta  +1 to increment, -1 to decrement.
============================================================ */
function changeQty(id, delta) {
  // Find the item in the cart array
  const item = cart.find(i => i.id === id);

  // Safety check — should never be null, but guard anyway
  if (!item) return;

  // Apply the delta to the quantity
  item.qty += delta;

  // If quantity has dropped to zero (or below), remove item from cart
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id); // create a new array without this item
  }

  // Refresh the cart UI to reflect the change
  updateCartUI();
}


/* ============================================================
   9. toggleCart()
   Opens or closes the cart sidebar and its overlay.
   Also locks/unlocks page scroll while the cart is open
   to prevent the background from scrolling.

   How it works:
   - Toggles the .open class on both elements.
   - styles.css listens for .open to slide the panel in
     and make the overlay visible.
============================================================ */
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');

  // Toggle .open on both elements simultaneously
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');

  // Lock body scroll when open; restore when closed
  // sidebar.classList.contains('open') is true after the toggle if we just opened it
  document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}


/* ============================================================
   10. toggleWishlist(id, btn)
   Adds or removes a product from the wishlist Set,
   then updates the heart icon on the button element.

   @param {number}  id   Product id to toggle.
   @param {Element} btn  The button DOM element that was clicked
                         (passed as `this` from the inline onclick).
============================================================ */
function toggleWishlist(id, btn) {
  if (wishlist.has(id)) {
    // ── Already liked → unlike it ──
    wishlist.delete(id);              // remove from the Set
    btn.classList.remove('liked');    // remove pink styling from button
    btn.textContent = '♡';           // hollow heart
    showToast('Removed from wishlist');
  } else {
    // ── Not yet liked → like it ──
    wishlist.add(id);                 // add to the Set
    btn.classList.add('liked');       // apply pink styling
    btn.textContent = '❤️';          // filled heart
    showToast('❤️ Added to wishlist!');
  }
}


/* ============================================================
   11. setFilter(filter, btn)
   Handles clicks on the "All / Popular / New Arrival / On Sale"
   filter pills in the Products section.

   Switches the active visual state of the pills and
   completely re-renders the product grid via renderProducts().

   @param {string}  filter  'all' | 'popular' | 'new' | 'sale'
   @param {Element} btn     The clicked pill button element.
============================================================ */
function setFilter(filter, btn) {
  // Step 1: remove .active from every filter button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

  // Step 2: add .active to the clicked button (highlights it pink)
  btn.classList.add('active');

  // Step 3: re-render the product grid with the new tag filter
  renderProducts(filter);
}


/* ============================================================
   12. filterProducts(cat, card)
   Handles clicks on the Category section cards.

   Instead of re-rendering the HTML, this function
   shows/hides existing product cards by toggling display style.
   This is slightly more efficient for filtering by category
   because the DOM nodes already exist from renderProducts().

   @param {string}  cat   Category slug: 'all' | 'rose' | 'tulip' |
                          'sunflower' | 'exotic' | 'bouquet'
   @param {Element} card  The clicked category card element.
============================================================ */
function filterProducts(cat, card) {
  // Step 1: remove .active from all category cards
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));

  // Step 2: highlight the clicked card
  card.classList.add('active');

  // Step 3: loop through every rendered product card and show/hide it
  const productCards = document.getElementById('productGrid').querySelectorAll('.product-card');

  productCards.forEach(cardEl => {
    // Read the product's id from the data-id attribute set during renderProducts()
    const id = parseInt(cardEl.dataset.id);

    // Look up the matching product object to get its cat property
    const product = products.find(p => p.id === id);

    // Show the card if 'all' is selected, or if its category matches the filter
    // Setting display to '' (empty string) restores the element's default display value
    cardEl.style.display = (cat === 'all' || product.cat === cat) ? '' : 'none';
  });
}


/* ============================================================
   13. showToast(msg)
   Displays a small pop-up notification at the bottom of the
   screen, then automatically hides it after 2.5 seconds.

   @param {string} msg  The message text to display.

   How it works:
   - Sets the toast's text content.
   - Adds the .show class → CSS transitions slide it up + fade in.
   - A setTimeout removes .show after 2500ms → CSS transitions
     slide it back down and fade it out.
============================================================ */
function showToast(msg) {
  const toast = document.getElementById('toast');

  // Set the message text
  toast.textContent = msg;

  // Add .show to trigger the CSS slide-up + fade-in transition
  toast.classList.add('show');

  // Schedule removal of .show after 2.5 seconds
  setTimeout(() => {
    toast.classList.remove('show'); // CSS transition handles the fade-out
  }, 2500);
}


/* ============================================================
   14. toggleMenu()
   Shows or hides the navigation links on mobile screens.
   The hamburger icon in index.html calls this function.

   On mobile, .nav-links is hidden via CSS (display:none).
   This function overrides that with inline styles to create
   a dropdown panel directly below the navbar.

   Checking links.style.display === 'flex' detects whether
   the menu is currently open (we set it to 'flex' when opening).
============================================================ */
function toggleMenu() {
  const links = document.querySelector('.nav-links');

  if (links.style.display === 'flex') {
    // ── Menu is open → close it ──
    links.style.display = 'none';
  } else {
    // ── Menu is closed → open it ──
    // Override the CSS with inline styles to create the dropdown panel
    links.style.cssText = `
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 68px;
      left: 0;
      right: 0;
      background: #fff;
      padding: 1rem 6%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      z-index: 99;
      gap: 1rem;
    `;
  }
}


/* ============================================================
   15. INITIALISATION
   Runs automatically when the browser finishes loading
   script.js (which is placed at the bottom of <body>
   in index.html, so all HTML elements already exist in the DOM).

   renderProducts('all') — populates the #productGrid with all 8 cards
   renderReviews()       — populates the #reviewGrid with all 6 cards
============================================================ */
renderProducts('all'); // show all products on page load
renderReviews();       // show all reviews on page load
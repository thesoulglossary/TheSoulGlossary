// Detect base path
const BASE_PATH = window.location.pathname.split("/")[1]
  ? "/" + window.location.pathname.split("/")[1]
  : "";

// Pretty date formatting
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Smooth page fade-in
const pageWrapper = document.getElementById("page-wrapper");
if (pageWrapper) {
  requestAnimationFrame(() => {
    pageWrapper.classList.add("fade-enter-active");
  });

  document.addEventListener("click", e => {
    const link = e.target.closest("a") || e.target.closest("article");
    if (!link) return;

    const href = link.tagName === "ARTICLE"
      ? link.getAttribute("data-href") || link.querySelector("a")?.href
      : link.href;

    if (!href || !href.includes(location.origin)) return;

    e.preventDefault();
    pageWrapper.classList.remove("fade-enter-active");
    pageWrapper.classList.add("fade-exit-active");

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
}

// Hamburger menu
const hamburger = document.createElement("div");
hamburger.className = "hamburger";
hamburger.innerHTML = `<span></span><span></span><span></span>`;
document.body.appendChild(hamburger);
const sidebar = document.querySelector(".sidebar");
hamburger.addEventListener("click", () => sidebar.classList.toggle("active"));
document.addEventListener("click", e => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) sidebar.classList.remove("active");
});

// Fetch posts
fetch(BASE_PATH + "/posts.json")
  .then(res => res.json())
  .then(posts => {

    posts.sort((a,b)=> new Date(b.date)-new Date(a.date));
    const path = window.location.pathname;

    // ---------------- HOMEPAGE ----------------
    if (path.endsWith("index.html") || path === BASE_PATH + "/") {
      const container = document.getElementById("posts");
      if (!container) return;

      posts.forEach(post => {
        const article = document.createElement("article");
        const excerpt = post.content.replace(/#/g,"").replace(/\n/g,"<br>").substring(0,300)+"...";
        article.innerHTML = `
          <h2>${post.title}</h2>
          <p class="date">${formatDate(post.date)}</p>
          <p class="excerpt">${excerpt}</p>
        `;
        article.setAttribute("data-href", `${BASE_PATH}/posts.html#${post.id}`);
        article.addEventListener("click", () => {
          pageWrapper.classList.remove("fade-enter-active");
          pageWrapper.classList.add("fade-exit-active");
          setTimeout(()=>{window.location.href = `${BASE_PATH}/posts.html#${post.id}`}, 400);
        });
        container.appendChild(article);
      });
    }

    // ---------------- POST PAGE ----------------
    if (window.location.hash) {
      const slug = window.location.hash.substring(1);
      const index = posts.findIndex(p => p.id === slug);
      const post = posts[index];
      const container = document.getElementById("post-content");
      if (!container) return;

      if (!post) {
        container.innerHTML = "<p>Post not found.</p>";
        return;
      }

      // Determine next/prev
      const prevPost = posts[index+1] || null;
      const nextPost = posts[index-1] || null;

      container.innerHTML = `
        <div class="entry">
          <div class="post-nav">
            <button id="back-btn">← Back</button>
            <div>
              ${prevPost ? `<button id="prev-btn">← ${prevPost.title}</button>` : ''}
              ${nextPost ? `<button id="next-btn">${nextPost.title} →</button>` : ''}
            </div>
          </div>
          <h1 class="entry-word">${post.title}</h1>
          <p class="entry-meta">${formatDate(post.date)}</p>
          <div class="entry-definition">${marked.parse(post.content)}</div>
        </div>
      `;

      // Back button
      document.getElementById("back-btn").addEventListener("click", () => {
        pageWrapper.classList.remove("fade-enter-active");
        pageWrapper.classList.add("fade-exit-active");
        setTimeout(()=> window.location.href = BASE_PATH + "/index.html", 400);
      });

      // Prev button
      if (prevPost) {
        document.getElementById("prev-btn").addEventListener("click", () => {
          pageWrapper.classList.remove("fade-enter-active");
          pageWrapper.classList.add("fade-exit-active");
          setTimeout(()=> window.location.href = `${BASE_PATH}/posts.html#${prevPost.id}`, 400);
        });
      }

      // Next button
      if (nextPost) {
        document.getElementById("next-btn").addEventListener("click", () => {
          pageWrapper.classList.remove("fade-enter-active");
          pageWrapper.classList.add("fade-exit-active");
          setTimeout(()=> window.location.href = `${BASE_PATH}/posts.html#${nextPost.id}`, 400);
        });
      }
    }
  });

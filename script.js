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

// Hamburger toggle for mobile
const hamburger = document.createElement("div");
hamburger.className = "hamburger";
hamburger.innerHTML = `<span></span><span></span><span></span>`;
document.body.appendChild(hamburger);

const sidebar = document.querySelector(".sidebar");
hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Close sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});

// Fetch posts.json
fetch(BASE_PATH + "/posts.json")
  .then(res => res.json())
  .then(posts => {

    // Sort newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const path = window.location.pathname;

    // ---------------- HOMEPAGE ----------------
    if (path.endsWith("index.html") || path === BASE_PATH + "/") {

      const container = document.getElementById("posts");
      if (!container) return;

      posts.forEach(post => {

        const article = document.createElement("article");

        // Excerpt: preserve line breaks
        const excerpt = post.content
          .replace(/#/g, "")
          .replace(/\n/g, "<br>")
          .substring(0, 300) + "...";

        article.innerHTML = `
          <h2>${post.title}</h2>
          <p class="date">${formatDate(post.date)}</p>
          <p class="excerpt">${excerpt}</p>
        `;

        // Make entire block clickable
        article.addEventListener("click", () => {
          window.location.href = `${BASE_PATH}/posts.html#${post.id}`;
        });

        container.appendChild(article);
      });
    }

    // ---------------- POST PAGE ----------------
    if (window.location.hash) {

      const slug = window.location.hash.substring(1);
      const post = posts.find(p => p.id === slug);

      const container = document.getElementById("post-content");
      if (!container) return;

      if (!post) {
        container.innerHTML = "<p>Post not found.</p>";
        return;
      }

      container.innerHTML = `
        <div class="entry">
          <h1 class="entry-word">${post.title}</h1>
          <p class="entry-meta">${formatDate(post.date)}</p>
          <div class="entry-definition">
            ${marked.parse(post.content)}
          </div>
        </div>
      `;
    }
  });

const BASE_PATH = window.location.pathname.split("/")[1]
  ? "/" + window.location.pathname.split("/")[1]
  : "";

let POSTS = [];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function loadPosts() {
  fetch(BASE_PATH + "/posts.json?ts=" + Date.now(), {
    cache: "no-store"
  })
  .then(res => res.json())
  .then(data => {
    data.sort((a,b)=> new Date(b.date)-new Date(a.date));
    POSTS = data;

    const counter = document.getElementById("post-count");
    if (counter) counter.textContent = POSTS.length;

    renderHome();
    renderEntry();
  });
}

function renderHome() {
  if (!document.getElementById("posts")) return;

  const container = document.getElementById("posts");
  container.innerHTML = "";

  POSTS.forEach(post => {

    const card = document.createElement("div");
    card.className = "entry-card";

    const excerpt = post.content.replace(/#/g,"").substring(0,120);

    card.innerHTML = `
      <div class="entry-word">${post.title}</div>
      <div class="entry-date">${formatDate(post.date)}</div>
      <div class="entry-excerpt">${excerpt}...</div>
    `;

    card.onclick = () => {
      window.location.href = `${BASE_PATH}/posts.html#${post.id}`;
    };

    container.appendChild(card);
  });
}

function renderEntry() {
  if (!document.getElementById("post-content")) return;

  const slug = window.location.hash.substring(1);
  if (!slug) return;

  const index = POSTS.findIndex(p => p.id === slug);
  const post = POSTS[index];
  if (!post) return;

  const prev = POSTS[index + 1];
  const next = POSTS[index - 1];

  const container = document.getElementById("post-content");

  container.innerHTML = `
    <h1>${post.title}</h1>
    <div class="entry-meta">${formatDate(post.date)}</div>
    <div class="entry-definition">${marked.parse(post.content)}</div>

    <div class="post-nav">
      ${prev ? `<button onclick="window.location.hash='${prev.id}'">Previous</button>` : ""}
      <button onclick="window.location.href='${BASE_PATH}/index.html'">Back</button>
      ${next ? `<button onclick="window.location.hash='${next.id}'">Next</button>` : ""}
    </div>
  `;
}

window.addEventListener("hashchange", renderEntry);

loadPosts();

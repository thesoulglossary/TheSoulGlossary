fetch("posts.json")
  .then(res => res.json())
  .then(posts => {

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById("posts");

    posts.forEach(post => {
      const article = document.createElement("article");

      article.innerHTML = `
        <h2>
          <a href="post.html?id=${post.id}">
            ${post.title}
          </a>
        </h2>
        <p><em>${post.date}</em></p>
      `;

      container.appendChild(article);
    });
  });

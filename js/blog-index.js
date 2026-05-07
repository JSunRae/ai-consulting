document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(
    ".category-filters [data-filter]",
  );
  const posts = document.querySelectorAll(".blog-card[data-category]");

  if (!filterButtons.length || !posts.length) {
    return;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((candidate) => {
        const isActive = candidate === button;
        candidate.classList.toggle("btn-primary", isActive);
        candidate.classList.toggle("btn-secondary", !isActive);
      });

      posts.forEach((post) => {
        const matches = filter === "all" || post.dataset.category === filter;

        post.style.display = matches ? "block" : "none";

        if (matches) {
          post.style.animation = "none";
          requestAnimationFrame(() => {
            post.style.animation = "fadeIn 0.5s ease forwards";
          });
        }
      });
    });
  });
});
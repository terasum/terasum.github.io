const filters = document.querySelectorAll(".filters button");
const articles = document.querySelectorAll(".entry");

for (const button of filters) {
  button.addEventListener("click", () => {
    for (const filter of filters) {
      filter.setAttribute("aria-pressed", String(filter === button));
    }
    for (const article of articles) {
      article.hidden = button.dataset.topic !== "all" && article.dataset.topic !== button.dataset.topic;
    }
  });
}

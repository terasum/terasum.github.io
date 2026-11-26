import gallery from "../ts/gallery";

const content = document.querySelector(".article-content");
const viewer = document.querySelector(".reading-image-viewer");
const fullImage = viewer.querySelector("img");

gallery(content);
content.addEventListener("click", (event) => {
    const link = event.target.closest("a.image-link");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const image = link.querySelector("img");
    if (new URL(link.href).pathname !== new URL(image.src).pathname) return;

    event.preventDefault();
    fullImage.alt = image.alt;
    fullImage.src = link.href;
    viewer.showModal();
});

viewer.addEventListener("close", () => fullImage.removeAttribute("src"));

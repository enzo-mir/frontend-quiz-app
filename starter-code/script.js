const themeSwitcher = document.querySelector("#theme_switcher button");

document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.dataset.theme = "dark";
  } else {
    document.body.dataset.theme = "light";
  }
});

themeSwitcher.addEventListener("click", (e) => {
  document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
});

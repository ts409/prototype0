window.addEventListener("load", () => {
    const splash = document.getElementById("splash");

    if (localStorage.getItem("visited")) {
        splash.style.display = "none";
        return;
    }

    localStorage.setItem("visited", "true");

    setTimeout(() => {
        splash.style.display = "none";
    }, 3000);
});

setInterval(() => {
    index = (index + 1) % colors.length;
    document.body.style.backgroundColor = colors[index];
}, 5000);

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
});
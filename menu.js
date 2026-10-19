document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("nav");

    if (!hamburger || !nav) return;

    // ボタンを押すとメニューを開閉
    hamburger.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("active");

        hamburger.setAttribute("aria-expanded", String(isOpen));
        hamburger.setAttribute(
            "aria-label",
            isOpen ? "メニューを閉じる" : "メニューを開く"
        );
    });

    // リンクを押したらメニューを閉じる
    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute("aria-label", "メニューを開く");
        });
    });

    // PC表示に戻したら閉じる
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            nav.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute("aria-label", "メニューを開く");
        }
    });
});
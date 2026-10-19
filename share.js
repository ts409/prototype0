const shareForm = document.getElementById("shareForm");
const workImage = document.getElementById("workImage");
const workTitle = document.getElementById("workTitle");
const workComment = document.getElementById("workComment");
const shareMessage = document.getElementById("shareMessage");

const galleryTrack = document.getElementById("galleryTrack");
const galleryCount = document.getElementById("galleryCount");
const emptyMessage = document.getElementById("emptyMessage");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

const STORAGE_KEY = "emocolorSharedWorks";

let works = [];
let currentIndex = 0;

// 保存済みの作品を読み込む
try {
    works = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(works)) {
        works = [];
    }
} catch (error) {
    works = [];
}

function saveWorks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
        return true;
    } catch (error) {
        shareMessage.textContent =
            "保存できませんでした。画像のサイズを小さくして試してください。";
        return false;
    }
}

// カルーセルを表示する
function renderGallery() {
    galleryTrack.innerHTML = "";

    works.forEach((work, index) => {
        const card = document.createElement("article");
        card.className = "work-card";

        const image = document.createElement("img");
        image.src = work.image;
        image.alt = work.title;

        const content = document.createElement("div");
        content.className = "work-card-content";

        const title = document.createElement("h3");
        title.textContent = work.title;

        const comment = document.createElement("p");
        comment.textContent = work.comment || "コメントはありません。";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "この作品を削除";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm("この作品を削除しますか？");

            if (!confirmed) return;

            const previousWorks = works;
            works = works.filter((_, i) => i !== index);

            if (!saveWorks()) {
                works = previousWorks;
                return;
            }

            currentIndex = Math.min(
                currentIndex,
                Math.max(0, works.length - 1)
            );

            renderGallery();
        });

        content.append(title, comment, deleteButton);
        card.append(image, content);
        galleryTrack.append(card);
    });

    galleryCount.textContent = `${works.length}作品`;
    emptyMessage.hidden = works.length > 0;

    updateCarousel();
}

// カルーセルの位置を調整する
function updateCarousel() {
    const cards = galleryTrack.querySelectorAll(".work-card");

    if (cards.length === 0) {
        galleryTrack.style.transform = "translateX(0)";
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
    }

    currentIndex = Math.max(
        0,
        Math.min(currentIndex, cards.length - 1)
    );

    const card = cards[currentIndex];
    const offset = card.offsetLeft - galleryTrack.offsetLeft;

    galleryTrack.style.transform = `translateX(-${offset}px)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === cards.length - 1;
}

// 画像を小さくして保存しやすくする
function resizeImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => reject(new Error("画像を読み込めませんでした。"));

        reader.onload = () => {
            const image = new Image();

            image.onerror = () => reject(new Error("画像を開けませんでした。"));

            image.onload = () => {
                const maxSize = 900;
                const scale = Math.min(
                    1,
                    maxSize / Math.max(image.width, image.height)
                );

                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(image.width * scale));
                canvas.height = Math.max(1, Math.round(image.height * scale));

                const context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                resolve(canvas.toDataURL("image/jpeg", 0.75));
            };

            image.src = reader.result;
        };

        reader.readAsDataURL(file);
    });
}

// 作品を投稿する
shareForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = workImage.files[0];

    if (!file) {
        shareMessage.textContent = "作品画像を選択してください。";
        return;
    }

    if (!file.type.startsWith("image/")) {
        shareMessage.textContent = "画像ファイルを選択してください。";
        return;
    }

    if (works.length >= 20) {
        shareMessage.textContent =
            "簡易版では20作品までです。不要な作品を削除してください。";
        return;
    }

    shareMessage.textContent = "投稿を処理しています…";

    try {
        const imageData = await resizeImage(file);

        const newWork = {
            id: Date.now(),
            title: workTitle.value.trim(),
            comment: workComment.value.trim(),
            image: imageData
        };

        const previousWorks = works;
        works = [...works, newWork];
        currentIndex = works.length - 1;

        if (!saveWorks()) {
            works = previousWorks;
            return;
        }

        renderGallery();
        shareForm.reset();
        shareMessage.textContent = "作品を追加しました！";
    } catch (error) {
        shareMessage.textContent =
            error.message || "投稿に失敗しました。";
    }
});

// 左右のボタン
prevButton.addEventListener("click", () => {
    currentIndex--;
    updateCarousel();
});

nextButton.addEventListener("click", () => {
    currentIndex++;
    updateCarousel();
});

// 画面幅が変わったときに位置を調整
window.addEventListener("resize", updateCarousel);

// 初期表示
renderGallery();

const openShareForm = document.getElementById("openShareForm");

openShareForm.addEventListener("click", () => {
    shareForm.classList.toggle("is-open");

    if (shareForm.classList.contains("is-open")) {
        openShareForm.textContent = "閉じる";
        shareForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        openShareForm.textContent = "+ 作品を投稿する";
    }
});
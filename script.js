// --- いいねボタン機能 ---
const likeBtn = document.getElementById('likeBtn');
const likeCountSpan = document.getElementById('likeCount');
let isLiked = false;
let count = 2450;

likeBtn.addEventListener('click', () => {
    isLiked = !isLiked;
    
    if (isLiked) {
        count++;
        likeBtn.classList.add('active');
        likeBtn.querySelector('i').classList.remove('fa-regular');
        likeBtn.querySelector('i').classList.add('fa-solid');
    } else {
        count--;
        likeBtn.classList.remove('active');
        likeBtn.querySelector('i').classList.remove('fa-solid');
        likeBtn.querySelector('i').classList.add('fa-regular');
    }
    
    likeCountSpan.textContent = count.toLocaleString();
});

// --- Badボタン機能 ---
const batBtn = document.getElementById('batBtn');
const batCountSpan = document.getElementById('batCount');
let isbated = false;
let counted = 1254;

batBtn.addEventListener('click', () => {
    isbated = !isbated;
    
    if (isbated) {
        counted++;
        batBtn.classList.add('active');
        batBtn.querySelector('i').classList.remove('fa-regular');
        batBtn.querySelector('i').classList.add('fa-solid');
    } else {
        counted--;
        batBtn.classList.remove('active');
        batBtn.querySelector('i').classList.remove('fa-solid');
        batBtn.querySelector('i').classList.add('fa-regular');
    }
    
    batCountSpan.textContent = counted.toLocaleString();
});

// --- コメント機能 ---
const commentInput = document.getElementById('commentInput');
const submitBtn = document.getElementById('submitComment');
const cancelBtn = document.getElementById('cancelComment');
const commentList = document.getElementById('commentList');
const commentCountSpan = document.getElementById('commentCount');

commentInput.addEventListener('input', () => {
    // 入力がある場合のみボタンを有効化
    if (commentInput.value.trim().length > 0) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
});

cancelBtn.addEventListener('click', () => {
    commentInput.value = '';
    submitBtn.disabled = true;
});

submitBtn.addEventListener('click', () => {
    const text = commentInput.value;
    if (!text) return;

    const now = new Date();
    // 時間のフォーマットを少しきれいに
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newComment = document.createElement('div');
    newComment.classList.add('comment-item');
    // アニメーション用のスタイルをインラインで追加（ふわっと表示）
    newComment.style.animation = "fadeIn 0.5s ease"; 
    
    newComment.innerHTML = `
        <div class="user-avatar small">U</div>
        <div class="comment-content">
            <div class="meta">
                <span class="name">あなた</span>
                <span class="time">今日 ${timeString}</span>
            </div>
            <p class="text">${escapeHtml(text)}</p>
        </div>
    `;

    commentList.prepend(newComment);
    commentInput.value = '';
    submitBtn.disabled = true;
    
    let currentCount = parseInt(commentCountSpan.textContent);
    commentCountSpan.textContent = currentCount + 1;
});

// フェードインアニメーションの定義を追加
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
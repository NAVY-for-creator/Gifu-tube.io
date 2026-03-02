// --- 状態管理用変数 ---
let isLiked = false;
let isDisliked = false;
let likeCount = 2450;
let dislikeCount = 1254;
let commentCount = 2;

// --- 要素の取得 ---
const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const likeCountSpan = document.getElementById('likeCount');
const dislikeCountSpan = document.getElementById('dislikeCount');

const commentInput = document.getElementById('commentInput');
const submitBtn = document.getElementById('submitComment');
const cancelBtn = document.getElementById('cancelComment');
const commentList = document.getElementById('commentList');
const commentCountSpan = document.getElementById('commentCount');

// --- いいね・低評価の排他制御ロジック ---
function updateLikeUI() {
    likeBtn.classList.toggle('active', isLiked);
    const icon = likeBtn.querySelector('i');
    icon.className = isLiked ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up';
    likeCountSpan.textContent = likeCount.toLocaleString();

    dislikeBtn.classList.toggle('active', isDisliked);
    const dIcon = dislikeBtn.querySelector('i');
    dIcon.className = isDisliked ? 'fa-solid fa-thumbs-down' : 'fa-regular fa-thumbs-down';
    dislikeCountSpan.textContent = dislikeCount.toLocaleString();
}

likeBtn.addEventListener('click', () => {
    if (isDisliked) {
        isDisliked = false;
        dislikeCount--;
    }
    isLiked = !isLiked;
    likeCount += isLiked ? 1 : -1;
    updateLikeUI();
});

dislikeBtn.addEventListener('click', () => {
    if (isLiked) {
        isLiked = false;
        likeCount--;
    }
    isDisliked = !isDisliked;
    dislikeCount += isDisliked ? 1 : -1;
    updateLikeUI();
});

// --- コメント機能 ---
commentInput.addEventListener('input', () => {
    submitBtn.disabled = commentInput.value.trim().length === 0;
});

cancelBtn.addEventListener('click', () => {
    commentInput.value = '';
    submitBtn.disabled = true;
});

submitBtn.addEventListener('click', () => {
    const text = commentInput.value;
    if (!text) return;

    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newComment = document.createElement('div');
    newComment.classList.add('comment-item');
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
    commentInput.value = '';     // 入力欄を空にする
    submitBtn.disabled = true;    // 投稿ボタンを再び無効化する
    commentInput.value = '';
    submitBtn.disabled = true;
    
    commentCount++;
    commentCountSpan.textContent = commentCount;
});

function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// --- 共有ポップアップ機能 ---
const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const closeShareModal = document.getElementById('closeShareModal');
const shareUrlInput = document.getElementById('shareUrl');
const copyUrlBtn = document.getElementById('copyUrlBtn');


shareBtn.addEventListener('click', () => {
    shareUrlInput.value = window.location.href;
    shareModal.classList.add('active');
});

closeShareModal.addEventListener('click', () => shareModal.classList.remove('active'));

shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) shareModal.classList.remove('active');
});

copyUrlBtn.addEventListener('click', () => {
    shareUrlInput.select();
    navigator.clipboard.writeText(shareUrlInput.value).then(() => {
        copyUrlBtn.textContent = 'コピー完了！';
        copyUrlBtn.style.background = '#00b894';
        setTimeout(() => {
            copyUrlBtn.textContent = 'コピー';
            copyUrlBtn.style.background = '';
        }, 2000);
    });
});

// --- チャンネル登録ボタン機能 ---
const subscribeBtn = document.getElementById('subscribeBtn');

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
        const isSubscribed = subscribeBtn.classList.toggle('subscribed');
        subscribeBtn.textContent = isSubscribed ? '登録済み' : 'チャンネル登録';
        showToast(isSubscribed ? 'チャンネル登録しました' : '登録を解除しました');
    });
}
// --- アップロードモーダル機能の統合 ---
const openUploadBtn = document.querySelector('.post-btn');
const uploadModal = document.getElementById('uploadModal');
const closeModal = document.getElementById('closeModal');
const cancelUploadBtn = document.getElementById('cancelBtn');
const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');
const uploadSubmit = document.getElementById('uploadSubmit'); // IDを統一
const uploadFormContent = document.getElementById('uploadFormContent');
const progressWrapper = document.getElementById('progressWrapper');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const thumbInput = document.getElementById('thumbInput');
const thumbPreview = document.getElementById('thumbPreview');
let selectedThumbUrl = 'kesiki.jpg'; // デフォルト画像

// 入力状態をチェックしてボタンの有効/無効を切り替える
function validateUploadForm() {
    const hasFile = fileInput.files.length > 0;
    const hasTitle = videoTitle.value.trim() !== "";
    
    // ファイルがあり、かつタイトルが入力されている時のみ有効化
    uploadSubmit.disabled = !(hasFile && hasTitle);
}

// モーダルをリセットして閉じる
const hideModal = () => {
    uploadModal.classList.remove('active');
    setTimeout(() => {
        fileInput.value = '';
        videoTitle.value = '';
        videoDescription.value = '';
        fileNameDisplay.textContent = '';
        uploadSubmit.disabled = true;
        uploadFormContent.style.display = 'block';
        progressWrapper.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = 'アップロード中... 0%';
    }, 300);
};

// イベントリスナーの設定
if (openUploadBtn) openUploadBtn.addEventListener('click', () => uploadModal.classList.add('active'));
if (closeModal) closeModal.addEventListener('click', hideModal);
if (cancelUploadBtn) cancelUploadBtn.addEventListener('click', hideModal);

// ファイル選択時の処理
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = `選択済み: ${fileInput.files[0].name}`;
    } else {
        fileNameDisplay.textContent = '';
    }
    validateUploadForm();
});

// タイトル入力時の処理
videoTitle.addEventListener('input', validateUploadForm);

// アップロード実行（シミュレーション）
const videoList = document.querySelector('.side-video-list');

// アップロード実行（シミュレーション）
uploadSubmit.addEventListener('click', () => {
    const titleValue = videoTitle.value;
    const descValue = videoDescription.value;
    
    uploadFormContent.style.display = 'none';
    progressWrapper.style.display = 'block';
    uploadSubmit.disabled = true;
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            progressText.innerHTML = '<span class="success-message"><i class="fa-solid fa-check-circle"></i> アップロード完了！</span>';
            
            // リストに追加する関数を実行
            addNewVideoCard(titleValue, descValue, selectedThumbUrl);

            // サムネイルクリックでファイル選択を開く
            thumbPreview.addEventListener('click', () => thumbInput.click());
            // 画像が選択されたらプレビューを表示
            thumbInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        selectedThumbUrl = e.target.result;
                        thumbPreview.innerHTML = `<img src="${selectedThumbUrl}">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            setTimeout(hideModal, 1500);
        } else {
            width += 15;
            if (width > 100) width = 100;
            progressBar.style.width = width + '%';
            progressText.textContent = `アップロード中... ${width}%`;
        }
    }, 150);
});

// サイドバーの形式に合わせてカードを追加する関数
function addNewVideoCard(title, description, thumb) {
    const newCard = document.createElement('div');
    newCard.className = 'side-video-card';
    newCard.innerHTML = `
        <div class="thumbnail">
            <img src="${thumb}" alt="new video">
            <span class="duration">0:00</span>
        </div>
        <div class="info">
            <h5 title="${description}">${title}</h5>
            <p class="uploader">あなた</p>
            <p class="meta">0回視聴 • 今しがた</p>
        </div>
    `;

    if (videoList) {
        // アニメーション用のスタイル
        newCard.style.opacity = '0';
        newCard.style.transform = 'translateX(20px)';
        newCard.style.transition = 'all 0.5s ease';
        
        // リストの先頭に追加
        videoList.insertBefore(newCard, videoList.firstChild);
        
        setTimeout(() => {
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateX(0)';
        }, 10);

        if (typeof showToast === 'function') {
            showToast('動画を公開しました！');
        }
    }
}


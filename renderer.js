const scanBtn = document.getElementById('scan-btn');
const wifiList = document.getElementById('wifi-list');
const terminalLog = document.getElementById('terminal-log');
const progressBar = document.getElementById('progress-bar');
const passwordDisplay = document.getElementById('password-display');
const statusText = document.getElementById('status');
const rickOverlay = document.getElementById('rickroll-overlay');
const homeBtn = document.getElementById('home-btn');

let isHacking = false;

// Hàm reset toàn bộ ứng dụng
function resetToHome() {
    isHacking = false;
    wifiList.innerHTML = '';
    terminalLog.innerHTML = '<div class="line">Hệ thống đã reset. Sẵn sàng quét...</div>';
    progressBar.style.width = "0%";
    passwordDisplay.textContent = "";
    statusText.textContent = "Trạng thái: Sẵn sàng quét...";
    rickOverlay.classList.add('hidden');
}

homeBtn.addEventListener('click', resetToHome);

// Hàm hỗ trợ log vào terminal (hiệu ứng gõ chữ)
function addLog(text, delay = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'line';
            terminalLog.prepend(line); // Thêm vào trên cùng (vì panel đảo ngược)
            
            let i = 0;
            const interval = setInterval(() => {
                line.textContent += text[i];
                i++;
                if (i === text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 30);
        }, delay);
    });
}

// Nút quét WiFi
scanBtn.addEventListener('click', async () => {
    if (isHacking) return;
    
    wifiList.innerHTML = '<li class="wifi-item">Đang tìm kiếm mạng...</li>';
    statusText.textContent = "Trạng thái: Đang quét...";
    
    try {
        const networks = await window.electronAPI.scanWifi();
        wifiList.innerHTML = '';
        
        if (networks.length === 0) {
            wifiList.innerHTML = '<li class="wifi-item">Không tìm thấy WiFi nào. Thử lại?</li>';
            addLog("LỖI: Không tìm thấy giao tiếp không dây.");
        } else {
            networks.forEach(ssid => {
                const li = document.createElement('li');
                li.className = 'wifi-item';
                li.innerHTML = `<span>[SECURE]</span> <strong>${ssid}</strong>`;
                li.addEventListener('click', () => startFakeHack(ssid));
                wifiList.appendChild(li);
            });
            addLog(`Đã phát hiện ${networks.length} điểm truy cập.`);
        }
        statusText.textContent = "Trạng thái: Hoàn tất quét.";
    } catch (err) {
        addLog("LỖI HỆ THỐNG: Truy cập bị từ chối.");
    }
});

// Giả lập quá trình hack
async function startFakeHack(ssid) {
    if (isHacking) return;
    isHacking = true;
    
    // Reset UI
    passwordDisplay.textContent = "";
    progressBar.style.width = "0%";
    terminalLog.innerHTML = "";
    statusText.textContent = `Trạng thái: Đang tấn công ${ssid}...`;
    
    // Các bước giả lập
    const hacks = [
        { msg: `Khởi tạo card mạng giao thức Monitor Mode...`, progress: 10 },
        { msg: `Đang quét kênh truyền cho SSID: ${ssid}...`, progress: 20 },
        { msg: `Đang bắt gói tin Handshake WPA2/WPA3...`, progress: 35 },
        { msg: `Tìm thấy lỗ hổng trong giao thức WPS...`, progress: 50 },
        { msg: `Đang thực hiện tấn công Brute-Force từ điển (10,000 pass/s)...`, progress: 70 },
        { msg: `Bẻ khóa mã checksum tầng 4...`, progress: 85 },
        { msg: `Đang giải mã chuỗi mật khẩu thô...`, progress: 95 },
        { msg: `PHÁ KHÓA THÀNH CÔNG!`, progress: 100 },
    ];

    for (const step of hacks) {
        await addLog(`> ${step.msg}`, 500);
        progressBar.style.width = `${step.progress}%`;
    }

    // Tạo mật khẩu ngẫu nhiên
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let fakePass = "";
    const length = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < length; i++) {
        fakePass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    passwordDisplay.innerHTML = `<span style="color: yellow">MẬT KHẨU TÌM THẤY: </span> ${fakePass}`;
    statusText.textContent = "Trạng thái: ĐÃ XONG.";
    
    // Đếm ngược trước khi chuyển hướng
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        addLog(`Cửa sổ truy cập dữ liệu sẽ mở sau ${countdown} giây...`, 0);
        statusText.textContent = `Trạng thái: Chuyển hướng sau ${countdown}s...`;
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    // Hiệu ứng Rickroll
    setTimeout(() => {
        rickOverlay.classList.remove('hidden');
        addLog("!!! CÁ THÁNG TƯ VUI VẺ !!!");
        
        setTimeout(() => {
            window.electronAPI.openRickRoll();
            isHacking = false;
        }, 1500);
    }, 4000);
}

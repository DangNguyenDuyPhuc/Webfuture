document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================
    // THEME MANAGER
    // ==========================================================
    const themeButtons = document.querySelectorAll('[data-theme-select]');
    let currentTheme = localStorage.getItem('phuc_theme') || 'aurora';
    
    function applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('phuc_theme', themeName);
        
        // Update active class in button picker
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme-select') === themeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Dynamic Terminal Colors based on theme
        const terminalInput = document.getElementById('terminalInput');
        if (terminalInput) {
            if (themeName === 'terminal') {
                terminalInput.style.color = '#39ff14';
            } else if (themeName === 'cyberpunk') {
                terminalInput.style.color = '#ff007f';
            } else if (themeName === 'eclipse') {
                terminalInput.style.color = '#ebd391';
            } else {
                terminalInput.style.color = '#ffffff';
            }
        }


    }

    // Bind theme button clicks
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.getAttribute('data-theme-select');
            applyTheme(selectedTheme);
        });
    });

    // Initial theme apply
    applyTheme(currentTheme);


    // ==========================================================
    // STATS (set values directly, no animation)
    // ==========================================================
    function initStatsDashboard() {
        const statCompleted = document.getElementById('statCompleted');
        const statTech = document.getElementById('statTech');
        const statPercent = document.getElementById('statPercent');
        const statCircle = document.getElementById('statCircle');
        const statEffort = document.getElementById('statEffort');

        if (statCompleted) statCompleted.textContent = '7/7';
        if (statTech) statTech.textContent = '5';
        if (statPercent) statPercent.textContent = '100%';
        if (statEffort) statEffort.textContent = '100%';
        if (statCircle) statCircle.style.strokeDashoffset = 0;
    }

    initStatsDashboard();


    // ==========================================================
    // INTERACTIVE PROJECT VIEWPORTS (WEBOS SANDBOX MODAL)
    // ==========================================================
    const sandboxModal = document.getElementById('sandboxModal');
    const sandboxWindow = document.getElementById('sandboxWindow');
    const sandboxIframe = document.getElementById('sandboxIframe');
    const chromeUrlText = document.getElementById('chromeUrlText');
    const sandboxCloseBtn = document.getElementById('sandboxCloseBtn');
    const sandboxMinBtn = document.getElementById('sandboxMinBtn');
    const sandboxMaxBtn = document.getElementById('sandboxMaxBtn');
    const sandboxBackBtn = document.getElementById('sandboxBackBtn');
    const sandboxRefreshBtn = document.getElementById('sandboxRefreshBtn');
    const sandboxOpenNewTab = document.getElementById('sandboxOpenNewTab');
    const sandboxLoader = document.getElementById('sandboxLoader');
    const responsiveButtons = document.querySelectorAll('[data-resp-view]');
    
    let activeProjectUrl = "";

    function openProjectInSandbox(url, title) {
        if (!sandboxModal || !sandboxIframe) return;
        
        activeProjectUrl = url;
        
        // Show loader
        if (sandboxLoader) sandboxLoader.classList.add('active');
        
        // Assign iframe URL
        sandboxIframe.src = url;
        
        // Set mock address bar
        if (chromeUrlText) {
            chromeUrlText.textContent = `https://phuc-dashboard.dev/assignments/${url}`;
        }
        
        // Display Modal
        sandboxModal.classList.add('active');
        
        // Reset responsive scale style
        setResponsiveView('desktop');

        // Remove loading state on loaded
        sandboxIframe.onload = function() {
            if (sandboxLoader) sandboxLoader.classList.remove('active');
        };
    }

    function closeSandbox() {
        if (!sandboxModal || !sandboxIframe) return;
        sandboxModal.classList.remove('active');
        // Clear iframe to save memory
        sandboxIframe.src = "";
    }

    function setResponsiveView(viewType) {
        if (!sandboxWindow) return;
        
        // Clear old classes
        sandboxWindow.classList.remove('view-desktop', 'view-tablet', 'view-mobile');
        
        // Apply view class
        if (viewType === 'mobile') {
            sandboxWindow.classList.add('view-mobile');
        } else if (viewType === 'tablet') {
            sandboxWindow.classList.add('view-tablet');
        } else {
            sandboxWindow.classList.add('view-desktop');
        }

        // Active class toggle on tabs
        responsiveButtons.forEach(btn => {
            if (btn.getAttribute('data-resp-view') === viewType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Intercept clicks on Project Cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            const title = this.querySelector('.project-title').textContent;
            openProjectInSandbox(url, title);
        });
    });

    // Close buttons binding
    if (sandboxCloseBtn) sandboxCloseBtn.addEventListener('click', closeSandbox);
    if (sandboxMinBtn) sandboxMinBtn.addEventListener('click', closeSandbox);
    
    // Maximize toggle
    if (sandboxMaxBtn) {
        sandboxMaxBtn.addEventListener('click', () => {
            if (sandboxWindow) {
                sandboxWindow.style.width = sandboxWindow.style.width === '100%' ? '92%' : '100%';
                sandboxWindow.style.height = sandboxWindow.style.height === '100%' ? '90%' : '100%';
            }
        });
    }

    // Refresh project iframe
    if (sandboxRefreshBtn) {
        sandboxRefreshBtn.addEventListener('click', () => {
            if (sandboxIframe && activeProjectUrl) {
                if (sandboxLoader) sandboxLoader.classList.add('active');
                sandboxIframe.src = activeProjectUrl;
            }
        });
    }

    // Nav Back
    if (sandboxBackBtn) {
        sandboxBackBtn.addEventListener('click', () => {
            try {
                if (sandboxIframe && sandboxIframe.contentWindow) {
                    sandboxIframe.contentWindow.history.back();
                }
            } catch (err) {
                console.log("IFrame cross-origin error navigating back", err);
            }
        });
    }

    // Open link out of mockup
    if (sandboxOpenNewTab) {
        sandboxOpenNewTab.addEventListener('click', () => {
            if (activeProjectUrl) {
                window.open(activeProjectUrl, '_blank');
            }
        });
    }

    // Responsive Buttons toggle binding
    responsiveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewType = btn.getAttribute('data-resp-view');
            setResponsiveView(viewType);
        });
    });

    // Close modal on click background
    if (sandboxModal) {
        sandboxModal.addEventListener('click', function(e) {
            if (e.target === sandboxModal) {
                closeSandbox();
            }
        });
    }


    // ==========================================================
    // DYNAMIC GREETING & TYPEWRITER TITLE
    // ==========================================================
    const greetingTextEl = document.getElementById('greetingText');
    const greetingEmojiEl = document.getElementById('greetingEmoji');
    
    function setDynamicGreeting() {
        if (!greetingTextEl || !greetingEmojiEl) return;
        const currentHour = new Date().getHours();
        let greeting = "";
        let emoji = "";

        if (currentHour >= 5 && currentHour < 12) {
            greeting = "Chào buổi sáng!";
            emoji = "☀️";
        } else if (currentHour >= 12 && currentHour < 18) {
            greeting = "Chào buổi chiều!";
            emoji = "🌤️";
        } else if (currentHour >= 18 && currentHour < 22) {
            greeting = "Chào buổi tối!";
            emoji = "🌙";
        } else {
            greeting = "Đêm muộn rồi!";
            emoji = "✨";
        }
        
        greetingTextEl.textContent = `${greeting} Lập trình viên tốt lành!`;
        greetingEmojiEl.textContent = emoji;
    }
    setDynamicGreeting();

    // Set title text directly (no typewriter)
    const titleTextEl = document.getElementById('mainTitleText');
    if (titleTextEl) {
        titleTextEl.textContent = "Trung Tâm Dự Án và Bài Tập";
    }


    // ==========================================================
    // GRID VS LIST VIEW SWITCHERS
    // ==========================================================
    const btnGridView = document.getElementById('btnGridView');
    const btnListView = document.getElementById('btnListView');
    const projectGrid = document.getElementById('projectGrid');

    if (btnGridView && btnListView && projectGrid) {
        btnGridView.addEventListener('click', () => {
            projectGrid.classList.remove('list-view');
            btnGridView.classList.add('active');
            btnListView.classList.remove('active');
        });

        btnListView.addEventListener('click', () => {
            projectGrid.classList.add('list-view');
            btnListView.classList.add('active');
            btnGridView.classList.remove('active');
        });
    }


    // ==========================================================
    // AMBIENT MUSIC PLAYER CONTROLLER
    // ==========================================================
    const lofiTracks = [
        { name: "Synthetic Sunset", artist: "Retrowave Collective", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { name: "Coffee & Rain Code", artist: "Hacker Lofi Club", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
        { name: "Neon Cyber Lounge", artist: "Future Synthwave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
        { name: "Midnight Sleep Lofi", artist: "Cozy Panda Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ];

    let currentTrackIdx = 0;
    let isPlaying = false;
    let audio = new Audio();
    audio.volume = 0.5; // Default 50%

    const trackNameEl = document.getElementById('trackName');
    const trackArtistEl = document.getElementById('trackArtist');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const playIcon = document.getElementById('playIcon');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const volumeSlider = document.getElementById('volumeSlider');
    const playerVisualizer = document.getElementById('playerVisualizer');
    const lofiPlayerCard = document.getElementById('lofiPlayerCard');
    const playerCover = document.getElementById('playerCover');

    function loadTrack(trackIdx) {
        const track = lofiTracks[trackIdx];
        audio.src = track.url;
        audio.load();
        
        if (trackNameEl) trackNameEl.textContent = track.name;
        if (trackArtistEl) trackArtistEl.textContent = track.artist;
    }

    function playTrack() {
        audio.play().then(() => {
            isPlaying = true;
            if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            if (lofiPlayerCard) lofiPlayerCard.classList.add('playing');
            if (playerCover) playerCover.classList.add('playing');
        }).catch(err => {
            console.log("Audio failed to auto-play", err);
        });
    }

    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        if (playIcon) playIcon.setAttribute('data-lucide', 'play');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        if (lofiPlayerCard) lofiPlayerCard.classList.remove('playing');
        if (playerCover) playerCover.classList.remove('playing');
    }

    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    function nextTrack() {
        currentTrackIdx = (currentTrackIdx + 1) % lofiTracks.length;
        loadTrack(currentTrackIdx);
        if (isPlaying) playTrack();
    }

    function prevTrack() {
        currentTrackIdx = (currentTrackIdx - 1 + lofiTracks.length) % lofiTracks.length;
        loadTrack(currentTrackIdx);
        if (isPlaying) playTrack();
    }

    // Audio Setup
    loadTrack(currentTrackIdx);

    // Controls Binding
    if (btnPlayPause) btnPlayPause.addEventListener('click', togglePlay);
    if (btnNext) btnNext.addEventListener('click', nextTrack);
    if (btnPrev) btnPrev.addEventListener('click', prevTrack);

    // Audio ended fallback
    audio.addEventListener('ended', nextTrack);

    // Volume Adjustment
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value / 100;
        });
    }


    // ==========================================================
    // DEVELOPER INTERACTIVE TERMINAL
    // ==========================================================
    const terminalBody = document.getElementById('terminalBody');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    const terminalFocusBtn = document.getElementById('terminalFocusBtn');
    
    let commandHistory = [];

    const assignmentsInfo = [
        { id: "1", name: "Bài Thơ", folder: "baitho/index.html", tech: "HTML5, CSS3, Google Fonts" },
        { id: "2", name: "Web Âm Nhạc", folder: "webnhac/index.html", tech: "Vanilla JS, LocalStorage, HTML Audio API" },
        { id: "3", name: "Giới thiệu bản thân", folder: "gioithieubanthan/index.html", tech: "Glassmorphism UI, Responsive Transitions" },
        { id: "4", name: "Trang Login", folder: "tranglogin/index.html", tech: "Captcha Generator, Regex Form Validation" },
        { id: "5", name: "Đăng kí dự thi", folder: "trangdangkiduthi/index.html", tech: "Complex Forms, Validations, File Uploader" },
        { id: "6", name: "Thuê sân cầu lông", folder: "thuesancaulong/index.html", tech: "Booking Application, Custom Pricing Algorithm" },
        { id: "7", name: "Thế giới di động", folder: "thegioididong/index.html", tech: "E-Commerce Clone, Grid Layouts, Carousels" }
    ];

    function printLine(text, cssClass = '') {
        if (!terminalOutput) return;
        const line = document.createElement('div');
        if (cssClass) line.className = cssClass;
        line.textContent = text;
        terminalOutput.appendChild(line);
        
        // Scroll terminal to bottom
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    function initTerminalWelcome() {
        printLine("Hệ điều hành ảo quản lý bài tập v4.0.0 khởi động thành công...", "terminal-welcome");
        printLine("Đặng Nguyễn Duy Phúc lớp DA25TTC. Toàn bộ 7/7 dự án an toàn trực tuyến.", "terminal-welcome");
        printLine("Gõ 'help' để hiển thị toàn bộ các lệnh tương tác lập trình có sẵn.", "terminal-welcome");
        printLine("----------------------------------------------------------------", "terminal-welcome");
    }

    function executeCommand(cmdStr) {
        cmdStr = cmdStr.trim();
        if (!cmdStr) return;

        printLine(`guest@phuc-pc:~$ ${cmdStr}`, 'terminal-cmd-echo');

        const parts = cmdStr.toLowerCase().split(' ');
        const mainCmd = parts[0];
        const arg = parts.slice(1).join(' ');

        switch (mainCmd) {
            case 'help':
                printLine("Các lệnh khả dụng trên hệ thống:");
                printLine("  help               - Hiển thị bảng hướng dẫn này.");
                printLine("  about              - Thông tin hồ sơ Đặng Nguyễn Duy Phúc.");
                printLine("  projects           - Liệt kê toàn bộ 7 bài tập trong hệ thống.");
                printLine("  open <id>          - Khởi chạy nhanh bài tập tương ứng sandbox viewer (1-7).");
                printLine("  theme <name>       - Đổi chủ đề: 'aurora', 'cyberpunk', 'eclipse', 'terminal'.");
                printLine("  play               - Kích hoạt phát nhạc ambient lofi.");
                printLine("  pause              - Tạm dừng trình nhạc lofi.");
                printLine("  neofetch           - Hiển thị Neofetch thông số cấu hình ảo học viên.");
                printLine("  matrix             - Bật hiệu ứng dòng thác ma trận nhấp nháy.");
                printLine("  clear              - Xóa màn hình điều khiển console.");
                break;
                
            case 'about':
                printLine("Hồ sơ lập trình sinh viên:");
                printLine("  Họ và tên: Đặng Nguyễn Duy Phúc");
                printLine("  Lớp chuyên ngành: DA25TTC");
                printLine("  Vai trò: Frontend Developer");
                printLine("  Mã số đào tạo: 2026-WEBFUTURE-HUB");
                printLine("  Công nghệ thế mạnh: HTML5, Vanilla CSS3, Javascript (ES6+), Bootstrap framework.");
                break;

            case 'projects':
                printLine("Danh mục 7 bài tập học tập đã hoàn thành:");
                assignmentsInfo.forEach(p => {
                    printLine(`  [${p.id}] ${p.name} - Sử dụng: ${p.tech}`);
                });
                break;

            case 'open':
                if (!arg || isNaN(arg) || parseInt(arg) < 1 || parseInt(arg) > 7) {
                    printLine("Lỗi: Vui lòng nhập số thứ tự bài tập từ 1 đến 7. Ví dụ: 'open 2'", "text-danger");
                } else {
                    const idx = parseInt(arg) - 1;
                    const p = assignmentsInfo[idx];
                    printLine(`Đang mở dự án ${p.name} trong Sandbox Browser...`, "text-success");
                    setTimeout(() => {
                        openProjectInSandbox(p.folder, p.name);
                    }, 500);
                }
                break;

            case 'theme':
                if (['aurora', 'cyberpunk', 'eclipse', 'terminal'].includes(arg)) {
                    printLine(`Đang chuyển chủ đề hệ thống sang: ${arg.toUpperCase()}...`, "text-success");
                    applyTheme(arg);
                } else {
                    printLine("Chủ đề không khả dụng. Chọn: 'aurora', 'cyberpunk', 'eclipse' hoặc 'terminal'.", "text-danger");
                }
                break;

            case 'play':
                printLine("Đang kích hoạt Ambient Lofi Music...", "text-success");
                playTrack();
                break;

            case 'pause':
                printLine("Đã tạm dừng Music Player.", "text-muted");
                pauseTrack();
                break;

            case 'clear':
                if (terminalOutput) terminalOutput.innerHTML = "";
                break;

            case 'matrix':
                printLine("Bắt đầu khởi tạo dòng thác ma trận...");
                runMatrixRain();
                break;

            case 'neofetch':
                printLine("  ______   __    __  __    __   ______  ", "text-success");
                printLine(" /      \\ /  |  /  |/  |  /  | /      \\ ", "text-success");
                printLine("/$$$$$$  |$$ |  $$ |$$ |  $$ |/$$$$$$  |", "text-success");
                printLine("$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$/ ", "text-success");
                printLine("$$ |__$$ |$$ \\__$$ |$$ \\__$$ |$$ |      ", "text-success");
                printLine("$$    $$/ $$    $$/ $$    $$/ $$ |      ", "text-success");
                printLine("$$$$$$$/   $$$$$$/   $$$$$$/  $$/       ", "text-success");
                printLine("OS: PhucOS v4.0.0 LTS x86_64");
                printLine("Class: DA25TTC (Web Developer Major)");
                printLine("Editor: Visual Studio Code");
                printLine("Shell: bash 5.2.15");
                printLine("Resolution: Responsive (Auto-scales)");
                printLine("Uptime: 100% effort");
                break;

            default:
                printLine(`Lệnh không tồn tại: '${mainCmd}'. Gõ 'help' để xem danh sách lệnh.`, 'text-danger');
        }
    }

    function runMatrixRain() {
        let count = 0;
        const interval = setInterval(() => {
            let line = "";
            for (let i = 0; i < 40; i++) {
                line += Math.random() > 0.5 ? "1" : "0";
            }
            printLine(line, "text-success");
            count++;
            if (count > 25) {
                clearInterval(interval);
                printLine("Đã hoàn tất truyền tải dòng thác nhị phân.", "text-success");
            }
        }, 80);
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value;
                executeCommand(cmd);
                terminalInput.value = "";
            }
        });
    }

    // Scroll to terminal section and focus input
    if (terminalFocusBtn && terminalInput) {
        terminalFocusBtn.addEventListener('click', () => {
            const termSection = document.getElementById('terminalSection');
            if (termSection) {
                termSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    terminalInput.focus();
                }, 800);
            }
        });
    }

    initTerminalWelcome();


    // ==========================================================
    // KEYBOARD NAVIGATION HOTKEYS
    // ==========================================================
    document.addEventListener('keydown', (e) => {
        // Prevent hotkeys triggering when user is actively typing in input/textarea
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        const uppercaseKey = e.key.toUpperCase();

        // Music Play/Pause Toggle hotkey
        if (uppercaseKey === 'M') {
            e.preventDefault();
            togglePlay();
            printLine("[Hotkey] Kích hoạt Play/Pause Audio Player.", "text-muted");
        }

        // Focus Terminal hotkey
        if (uppercaseKey === 'T') {
            e.preventDefault();
            const termSection = document.getElementById('terminalSection');
            if (termSection && terminalInput) {
                termSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => terminalInput.focus(), 600);
                printLine("[Hotkey] Trực quan tiêu điểm dòng Terminal Command.", "text-muted");
            }
        }

        // Help Modal shortcut
        if (uppercaseKey === 'H') {
            e.preventDefault();
            showShortcutsDialog();
        }

        // Assignments Sandbox Launchers (Keys 1 to 7)
        if (e.key >= '1' && e.key <= '7') {
            const idx = parseInt(e.key) - 1;
            const p = assignmentsInfo[idx];
            if (p) {
                e.preventDefault();
                printLine(`[Hotkey] Khởi chạy dự án ${p.name}...`, "text-success");
                openProjectInSandbox(p.folder, p.name);
            }
        }
    });

    // Shortcut Help Click Trigger
    const shortcutHelpBtn = document.getElementById('shortcutHelpBtn');
    if (shortcutHelpBtn) {
        shortcutHelpBtn.addEventListener('click', showShortcutsDialog);
    }

    function showShortcutsDialog() {
        alert(
            "DANH SÁCH CÁC PHÍM TẮT ĐIỀU HƯỚNG NHANH:\n\n" +
            "• Phím [ 1 ] - [ 7 ] : Mở nhanh bài tập tương ứng (1 đến 7) trong Sandbox Emulator.\n" +
            "• Phím [ T ] : Trộn màn hình xuống Terminal và tự động focus thanh nhập lệnh.\n" +
            "• Phím [ M ] : Phát hoặc tạm dừng trình phát nhạc lofi ambient.\n" +
            "• Phím [ H ] : Hiển thị hộp thoại phím tắt này.\n\n" +
            "Hệ thống điều khiển PhucOS v4.0.0."
        );
    }


    // ==========================================================
    // CLOCK & TIME FUNCTIONS
    // ==========================================================
    const clockEl = document.getElementById('currentTime');
    function updateClock() {
        if (!clockEl) return;
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        clockEl.textContent = now.toLocaleDateString('vi-VN', options);
    }
    updateClock();
    setInterval(updateClock, 1000);
});

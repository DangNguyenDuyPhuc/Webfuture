/* ================================================
   SCRIPT.JS - Xử lý logic cho hệ thống Điểm Rèn Luyện
   Bao gồm: Dữ liệu sinh viên, Render bảng, Biểu đồ, Lọc
   ================================================ */

// ===== DỮ LIỆU SINH VIÊN (44 sinh viên) =====
const students = [
    { mssv: "110125233", name: "abc", score: 0 },
    { mssv: "110125246", name: "ABC", score: 0 },
    { mssv: "110125234", name: "Abc", score: 0 },
    { mssv: "110125066", name: "123", score: 0 },
    { mssv: "110125202", name: "", score: 0 },
    { mssv: "110125155", name: "", score: 65 },
    { mssv: "110125018", name: "", score: 82 },
    { mssv: "110125216", name: "", score: 81 },
    { mssv: "110125115", name: "", score: 80 },
    { mssv: "110125113", name: "", score: 92 },
    { mssv: "110125046", name: "", score: 56 },
    { mssv: "110125078", name: "", score: 75 },
    { mssv: "110125091", name: "", score: 70 },
    { mssv: "110125102", name: "", score: 68 },
    { mssv: "110125134", name: "", score: 72 },
    { mssv: "110125145", name: "", score: 63 },
    { mssv: "110125167", name: "", score: 88 },
    { mssv: "110125178", name: "", score: 85 },
    { mssv: "110125189", name: "", score: 58 },
    { mssv: "110125201", name: "", score: 74 },
    { mssv: "110125212", name: "", score: 67 },
    { mssv: "110125223", name: "", score: 71 },
    { mssv: "110125235", name: "", score: 60 },
    { mssv: "110125247", name: "", score: 76 },
    { mssv: "110125258", name: "", score: 83 },
    { mssv: "110125269", name: "", score: 69 },
    { mssv: "110125280", name: "", score: 55 },
    { mssv: "110125291", name: "", score: 77 },
    { mssv: "110125302", name: "", score: 62 },
    { mssv: "110125313", name: "", score: 90 },
    { mssv: "110125324", name: "", score: 73 },
    { mssv: "110125335", name: "", score: 84 },
    { mssv: "110125346", name: "", score: 66 },
    { mssv: "110125357", name: "", score: 78 },
    { mssv: "110125368", name: "", score: 57 },
    { mssv: "110125379", name: "", score: 87 },
    { mssv: "110125390", name: "", score: 64 },
    { mssv: "110125401", name: "", score: 79 },
    { mssv: "110125412", name: "", score: 86 },
    { mssv: "110125423", name: "", score: 61 },
    { mssv: "110125434", name: "", score: 53 },
    { mssv: "110125445", name: "", score: 89 },
    { mssv: "110125456", name: "", score: 54 },
    { mssv: "110125467", name: "", score: 59 },
];

// ===== HÀM XẾP LOẠI THEO ĐIỂM =====
function getRank(score) {
    if (score >= 90) return "Xuất sắc";
    if (score >= 80) return "Tốt";
    if (score >= 65) return "Khá";
    if (score >= 50) return "Trung bình";
    if (score >= 35) return "Yếu";
    return "Kém";
}

// Trả về CSS class tương ứng với xếp loại
function getRankClass(rank) {
    const map = {
        "Xuất sắc": "rank-xuatsac",
        "Tốt": "rank-tot",
        "Khá": "rank-kha",
        "Trung bình": "rank-trungbinh",
        "Yếu": "rank-yeu",
        "Kém": "rank-kem",
    };
    return map[rank] || "rank-kem";
}

// Trả về màu biểu đồ tương ứng với xếp loại
function getRankColor(rank) {
    const colors = {
        "Xuất sắc": "#27ae60",
        "Tốt": "#2e86ab",
        "Khá": "#3498db",
        "Trung bình": "#95a5a6",
        "Yếu": "#e67e22",
        "Kém": "#c0392b",
    };
    return colors[rank] || "#999";
}

// ===== TRẠNG THÁI ỨNG DỤNG =====
let currentPage = 1;
const rowsPerPage = 15;
let filteredStudents = [...students];

// ===== KHỞI TẠO =====
document.addEventListener("DOMContentLoaded", () => {
    // Thêm xếp loại cho từng sinh viên
    students.forEach(s => {
        s.rank = getRank(s.score);
    });
    filteredStudents = [...students];

    // Render lần đầu
    renderTable();
    renderChart();
    setupEventListeners();
});

// ===== RENDER BẢNG DANH SÁCH SINH VIÊN =====
function renderTable() {
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageStudents = filteredStudents.slice(start, end);

    // Render các dòng bảng
    tbody.innerHTML = pageStudents
        .map((student, index) => {
            const stt = start + index + 1;
            return `
                <tr>
                    <td>${stt}</td>
                    <td>${student.mssv}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                    <td>
                        <span class="rank-badge ${getRankClass(student.rank)}">
                            ${student.rank}
                        </span>
                    </td>
                </tr>
            `;
        })
        .join("");

    // Render phân trang
    renderPagination(totalPages);
}

// ===== RENDER PHÂN TRANG =====
function renderPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = "";

    // Nút trước
    html += `<button class="page-btn" ${currentPage === 1 ? "disabled" : ""} onclick="goToPage(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;

    // Các nút trang
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`;
    }

    // Nút sau
    html += `<button class="page-btn" ${currentPage === totalPages ? "disabled" : ""} onclick="goToPage(${currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;

    pagination.innerHTML = html;
}

// Chuyển trang
function goToPage(page) {
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

// ===== RENDER BIỂU ĐỒ DONUT =====
function renderChart() {
    const ctx = document.getElementById("statsChart");
    if (!ctx) return;

    // Thống kê số lượng theo từng xếp loại
    const ranks = ["Xuất sắc", "Tốt", "Khá", "Trung bình", "Yếu", "Kém"];
    const counts = ranks.map(rank =>
        filteredStudents.filter(s => s.rank === rank).length
    );
    const total = filteredStudents.length;
    const colors = ranks.map(rank => getRankColor(rank));

    // Hủy biểu đồ cũ nếu có
    if (window.statsChartInstance) {
        window.statsChartInstance.destroy();
    }

    // Tạo biểu đồ mới
    window.statsChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ranks,
            datasets: [
                {
                    data: counts,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: "#fff",
                    hoverBorderWidth: 3,
                    hoverOffset: 8,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: "58%",
            plugins: {
                legend: {
                    display: false, // Ẩn legend mặc định, dùng legend tùy chỉnh
                },
                tooltip: {
                    backgroundColor: "rgba(26,46,74,0.95)",
                    titleFont: { family: "'Inter', sans-serif", size: 13, weight: 600 },
                    bodyFont: { family: "'Inter', sans-serif", size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed;
                            const percent = ((value / total) * 100).toFixed(1);
                            return ` ${context.label}: ${value}/${total} (${percent}%)`;
                        },
                    },
                },
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: "easeOutQuart",
            },
        },
    });

    // Render chú thích biểu đồ tùy chỉnh
    renderChartLegend(ranks, counts, total, colors);
}

// ===== RENDER CHÚ THÍCH BIỂU ĐỒ =====
function renderChartLegend(ranks, counts, total, colors) {
    const legendEl = document.getElementById("chartLegend");
    if (!legendEl) return;

    legendEl.innerHTML = ranks
        .map((rank, i) => {
            const percent = total > 0 ? ((counts[i] / total) * 100).toFixed(1) : "0.0";
            return `
                <div class="legend-item">
                    <div class="legend-left">
                        <span class="legend-dot" style="background:${colors[i]}"></span>
                        <span class="legend-label">${rank}</span>
                        <span class="legend-count">(${counts[i]}/${total})</span>
                    </div>
                    <span class="legend-percent">${percent}%</span>
                </div>
            `;
        })
        .join("");
}

// ===== XỬ LÝ SỰ KIỆN =====
function setupEventListeners() {
    // Nút tìm kiếm
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", handleSearch);
    }

    // Nút reset
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", handleReset);
    }

    // Toggle sidebar trên mobile
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            overlay.classList.toggle("active");
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            overlay.classList.remove("active");
        });
    }

    // Click vào menu item
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Đóng sidebar trên mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("open");
                overlay.classList.remove("active");
            }
        });
    });
}

// ===== LỌC TÌM KIẾM =====
function handleSearch() {
    const classificationFilter = document.getElementById("classification").value;

    // Lọc theo xếp loại
    if (classificationFilter) {
        filteredStudents = students.filter(s => s.rank === classificationFilter);
    } else {
        filteredStudents = [...students];
    }

    // Reset trang về 1
    currentPage = 1;

    // Render lại bảng và biểu đồ
    renderTable();
    renderChart();

    // Animation cho bảng
    animateTable();
}

// ===== RESET BỘ LỌC =====
function handleReset() {
    // Reset các dropdown
    document.getElementById("semester").selectedIndex = 0;
    document.getElementById("classSelect").selectedIndex = 0;
    document.getElementById("classification").selectedIndex = 0;
    document.getElementById("role").selectedIndex = 0;

    // Reset dữ liệu
    filteredStudents = [...students];
    currentPage = 1;

    // Render lại
    renderTable();
    renderChart();
    animateTable();
}

// ===== ANIMATION CHO BẢNG =====
function animateTable() {
    const rows = document.querySelectorAll("#studentTableBody tr");
    rows.forEach((row, index) => {
        row.style.opacity = "0";
        row.style.transform = "translateY(10px)";
        setTimeout(() => {
            row.style.transition = "all 0.3s ease";
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
        }, index * 30);
    });
}

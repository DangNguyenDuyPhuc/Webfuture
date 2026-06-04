/* ==========================================================================
   THẾ GIỚI DI ĐỘNG - LOGIC XỬ LÝ ỨNG DỤNG (VANILLA JS)
   ========================================================================== */

// 1. CƠ SỞ DỮ LIỆU SẢN PHẨM (MOCK DATABASE)
const PRODUCTS_DB = [
    {
        id: "p1",
        name: "iPhone 15 Pro Max 256GB - Titanium",
        brand: "Apple",
        category: "phone",
        price: 29990000,
        originalPrice: 34990000,
        rating: 4.8,
        reviewsCount: 154,
        image: "assets/iphone_15.png",
        badge: "Trả góp 0%",
        badgeClass: "yellow",
        promo: "Tặng củ sạc nhanh Apple 20W chính hãng trị giá 550.000₫",
        colors: [
            { name: "Titan Tự Nhiên", hex: "#BEBDB8", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Titan Xanh", hex: "#2F4452", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Titan Đen", hex: "#232426", priceOffset: 0, img: "assets/iphone_15.png" }
        ],
        storages: [
            { name: "256GB", priceOffset: 0 },
            { name: "512GB", priceOffset: 4500000 },
            { name: "1TB", priceOffset: 9000000 }
        ],
        specs: {
            "Màn hình": "6.7 inch, Super Retina XDR OLED, 120Hz",
            "Chip xử lý": "Apple A17 Pro 6 nhân siêu mạnh",
            "RAM": "8 GB",
            "Bộ nhớ trong": "256 GB",
            "Camera sau": "Chính 48 MP & Phụ 12 MP, 12 MP",
            "Dung lượng pin": "4422 mAh, Sạc nhanh 25W"
        }
    },
    {
        id: "p2",
        name: "MacBook Air M3 13 inch 8GB/256GB",
        brand: "Apple",
        category: "laptop",
        price: 27490000,
        originalPrice: 29990000,
        rating: 4.9,
        reviewsCount: 88,
        image: "assets/macbook_m3.png",
        badge: "HOT DEAL",
        badgeClass: "red",
        promo: "Tặng túi chống sốc cao cấp + Giảm 500k cho Học sinh - Sinh viên",
        colors: [
            { name: "Xám Không Gian", hex: "#5d5e62", priceOffset: 0, img: "assets/macbook_m3.png" },
            { name: "Bạc", hex: "#e3e4e5", priceOffset: 0, img: "assets/macbook_m3.png" },
            { name: "Vàng Ánh Kim", hex: "#f0e4d3", priceOffset: 500000, img: "assets/macbook_m3.png" }
        ],
        storages: [
            { name: "256GB", priceOffset: 0 },
            { name: "512GB", priceOffset: 5000000 }
        ],
        specs: {
            "Màn hình": "13.6 inch, Liquid Retina (2560 x 1664)",
            "Chip xử lý": "Apple M3 8-core CPU",
            "RAM": "8 GB",
            "Ổ cứng SSD": "256 GB",
            "Đồ họa": "8-core GPU",
            "Trọng lượng": "1.24 kg"
        }
    },
    {
        id: "p3",
        name: "Samsung Galaxy S24 Ultra 12GB/256GB",
        brand: "Samsung",
        category: "phone",
        price: 28990000,
        originalPrice: 33990000,
        rating: 4.7,
        reviewsCount: 120,
        image: "assets/iphone_15.png", // giao diện ảnh dự phòng
        badge: "Giảm 5 triệu",
        badgeClass: "red",
        promo: "Tặng Bao da Smart View + Trợ giá thu cũ đổi mới đến 2 triệu",
        colors: [
            { name: "Xám Titan", hex: "#8c8e91", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Vàng Titan", hex: "#d1c2a5", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Đen Titan", hex: "#303133", priceOffset: 0, img: "assets/iphone_15.png" }
        ],
        storages: [
            { name: "256GB", priceOffset: 0 },
            { name: "512GB", priceOffset: 4000000 },
            { name: "1TB", priceOffset: 8000000 }
        ],
        specs: {
            "Màn hình": "6.8 inch, Dynamic AMOLED 2X, QHD+, 120Hz",
            "Chip xử lý": "Snapdragon 8 Gen 3 for Galaxy",
            "RAM": "12 GB",
            "Bộ nhớ trong": "256 GB",
            "Camera sau": "Chính 200 MP & Phụ 50 MP, 12 MP, 10 MP",
            "Dung lượng pin": "5000 mAh, Sạc nhanh 45W"
        }
    },
    {
        id: "p4",
        name: "Asus ROG Phone 8 16GB/512GB",
        brand: "Asus",
        category: "phone",
        price: 22490000,
        originalPrice: 24990000,
        rating: 4.9,
        reviewsCount: 42,
        image: "assets/iphone_15.png",
        badge: "Gaming Beast",
        badgeClass: "blue",
        promo: "Tặng Quạt Tản Nhiệt AeroActive Cooler X trị giá 1.8 triệu",
        colors: [
            { name: "Đen Phantom", hex: "#1c1d21", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Xám Storm", hex: "#5c5e63", priceOffset: 0, img: "assets/iphone_15.png" }
        ],
        storages: [
            { name: "512GB", priceOffset: 0 }
        ],
        specs: {
            "Màn hình": "6.78 inch, AMOLED, Full HD+, 165Hz",
            "Chip xử lý": "Snapdragon 8 Gen 3 8 nhân",
            "RAM": "16 GB",
            "Bộ nhớ trong": "512 GB",
            "Camera sau": "50 MP & Phụ 32 MP, 13 MP",
            "Dung lượng pin": "5500 mAh, Sạc nhanh 65W"
        }
    },
    {
        id: "p5",
        name: "Xiaomi 14 Ultra 16GB/512GB",
        brand: "Xiaomi",
        category: "phone",
        price: 26990000,
        originalPrice: 32990000,
        rating: 4.8,
        reviewsCount: 36,
        image: "assets/iphone_15.png",
        badge: "Leica Camera",
        badgeClass: "yellow",
        promo: "Tặng Leica Photography Kit trị giá 3.990.000₫",
        colors: [
            { name: "Đen Leather", hex: "#262626", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Trắng Leather", hex: "#ededed", priceOffset: 0, img: "assets/iphone_15.png" }
        ],
        storages: [
            { name: "512GB", priceOffset: 0 }
        ],
        specs: {
            "Màn hình": "6.73 inch, LTPO AMOLED, WQHD+, 120Hz",
            "Chip xử lý": "Snapdragon 8 Gen 3",
            "RAM": "16 GB",
            "Bộ nhớ trong": "512 GB",
            "Camera sau": "4 camera Leica 50 MP siêu cảm biến",
            "Dung lượng pin": "5000 mAh, Sạc nhanh 90W"
        }
    },
    {
        id: "p6",
        name: "Laptop Asus Vivobook Go 15 M1504FA",
        brand: "Asus",
        category: "laptop",
        price: 11490000,
        originalPrice: 13990000,
        rating: 4.5,
        reviewsCount: 76,
        image: "assets/macbook_m3.png",
        badge: "Học tập văn phòng",
        badgeClass: "blue",
        promo: "Tặng chuột không dây Logitech + Balo Asus chính hãng",
        colors: [
            { name: "Bạc Cool", hex: "#cfd3d6", priceOffset: 0, img: "assets/macbook_m3.png" },
            { name: "Đen Mixed", hex: "#323336", priceOffset: 0, img: "assets/macbook_m3.png" }
        ],
        storages: [
            { name: "256GB SSD", priceOffset: 0 },
            { name: "512GB SSD", priceOffset: 1200000 }
        ],
        specs: {
            "Màn hình": "15.6 inch, Full HD (1920 x 1080) IPS",
            "Chip xử lý": "AMD Ryzen 5 7520U",
            "RAM": "8 GB LPDDR5",
            "Ổ cứng": "256 GB SSD",
            "Đồ họa": "AMD Radeon Graphics",
            "Trọng lượng": "1.63 kg"
        }
    },
    {
        id: "p7",
        name: "Oppo Reno11 Pro 5G 12GB/512GB",
        brand: "Oppo",
        category: "phone",
        price: 14990000,
        originalPrice: 16990000,
        rating: 4.6,
        reviewsCount: 65,
        image: "assets/iphone_15.png",
        badge: "Chuyên Gia Chân Dung",
        badgeClass: "yellow",
        promo: "Tặng phiếu mua hàng 500k + Trả góp 0% lãi suất",
        colors: [
            { name: "Trắng Ngọc Trai", hex: "#eae6df", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Xám San Hô", hex: "#52575e", priceOffset: 0, img: "assets/iphone_15.png" }
        ],
        storages: [
            { name: "512GB", priceOffset: 0 }
        ],
        specs: {
            "Màn hình": "6.7 inch, AMOLED, 120Hz, HDR10+",
            "Chip xử lý": "MediaTek Dimensity 8200",
            "RAM": "12 GB",
            "Bộ nhớ trong": "512 GB",
            "Camera sau": "Chính 50 MP & Chân dung 32 MP, Góc rộng 8 MP",
            "Dung lượng pin": "4600 mAh, Sạc nhanh SuperVOOC 80W"
        }
    },
    {
        id: "p8",
        name: "iPad Air 6 M2 11 inch Wifi 128GB",
        brand: "Apple",
        category: "tablet",
        price: 15990000,
        originalPrice: 17990000,
        rating: 4.9,
        reviewsCount: 38,
        image: "assets/macbook_m3.png", // giao diện ảnh dự phòng cho máy tính bảng
        badge: "New Release",
        badgeClass: "yellow",
        promo: "Giảm ngay 1 triệu + Giảm 30% khi mua bút Apple Pencil Pro",
        colors: [
            { name: "Xám Không Gian", hex: "#5e6063", priceOffset: 0, img: "assets/macbook_m3.png" },
            { name: "Xanh Dương Mới", hex: "#b4c3d6", priceOffset: 0, img: "assets/macbook_m3.png" },
            { name: "Ánh Sao", hex: "#e0dcd3", priceOffset: 0, img: "assets/macbook_m3.png" }
        ],
        storages: [
            { name: "128GB", priceOffset: 0 },
            { name: "256GB", priceOffset: 2500000 }
        ],
        specs: {
            "Màn hình": "11 inch, Liquid Retina IPS",
            "Chip xử lý": "Apple M2 8-core CPU",
            "RAM": "8 GB",
            "Bộ nhớ trong": "128 GB",
            "Camera": "12 MP trước & sau",
            "Hệ điều hành": "iPadOS 17.4"
        }
    },
    {
        id: "p9",
        name: "Samsung Galaxy Tab S9 FE Wifi",
        brand: "Samsung",
        category: "tablet",
        price: 8990000,
        originalPrice: 11990000,
        rating: 4.6,
        reviewsCount: 52,
        image: "assets/macbook_m3.png",
        badge: "Tặng Bút S-Pen",
        badgeClass: "blue",
        promo: "Đi kèm bút S-Pen thông minh + Giảm thêm 5% qua quà tặng Galaxy",
        colors: [
            { name: "Xám Phong Cách", hex: "#505254", priceOffset: 0, img: "assets/macbook_m3.png" },
            { name: "Bạc Thanh Lịch", hex: "#cfd1d4", priceOffset: 0, img: "assets/macbook_m3.png" }
        ],
        storages: [
            { name: "128GB", priceOffset: 0 },
            { name: "256GB", priceOffset: 1800000 }
        ],
        specs: {
            "Màn hình": "10.9 inch, IPS LCD, 90Hz",
            "Chip xử lý": "Exynos 1380 8 nhân",
            "RAM": "6 GB",
            "Bộ nhớ trong": "128 GB",
            "Tiêu chuẩn chống nước": "IP68 kháng nước kháng bụi",
            "Dung lượng pin": "8000 mAh"
        }
    },
    {
        id: "p10",
        name: "Apple Watch Series 9 GPS 41mm viền nhôm",
        brand: "Apple",
        category: "watch",
        price: 9490000,
        originalPrice: 10490000,
        rating: 4.8,
        reviewsCount: 67,
        image: "assets/iphone_15.png", // giao diện ảnh dự phòng cho đồng hồ
        badge: "Smart Gesture",
        badgeClass: "yellow",
        promo: "Giảm 15% khi mua kèm iPhone + Trả góp 0%",
        colors: [
            { name: "Midnight", hex: "#1a1f26", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Starlight", hex: "#e0dcd3", priceOffset: 0, img: "assets/iphone_15.png" },
            { name: "Pink", hex: "#fae1e6", priceOffset: 0, img: "assets/iphone_15.png" }
        ],
        storages: [
            { name: "Standard Size", priceOffset: 0 }
        ],
        specs: {
            "Kích thước màn hình": "41 mm, Always-On Retina LTPO OLED",
            "Chip xử lý": "Apple S9 SiP lõi kép",
            "Thời lượng pin": "Lên đến 18 giờ (36 giờ tiết kiệm pin)",
            "Chống nước": "Kháng nước 50m (WR50)",
            "Kết nối": "Wifi, Bluetooth, GPS"
        }
    },
    {
        id: "p11",
        name: "Tai nghe True Wireless AirPods Pro 2 USB-C",
        brand: "Apple",
        category: "accessories",
        price: 5690000,
        originalPrice: 6290000,
        rating: 4.9,
        reviewsCount: 114,
        image: "assets/macbook_m3.png", // giao diện ảnh dự phòng cho phụ kiện
        badge: "Chống ồn ANC",
        badgeClass: "blue",
        promo: "Tặng 6 tháng Apple Music miễn phí + Giao hàng siêu tốc 2h",
        colors: [
            { name: "Trắng Băng Tuyết", hex: "#ffffff", priceOffset: 0, img: "assets/macbook_m3.png" }
        ],
        storages: [
            { name: "Cáp sạc USB-C", priceOffset: 0 }
        ],
        specs: {
            "Công nghệ âm thanh": "Chống ồn chủ động (ANC) & Xuyên âm thích ứng",
            "Bộ vi xử lý": "Chip H2 siêu mạnh mẽ",
            "Thời gian nghe nhạc": "Đến 6 giờ (30 giờ kèm hộp sạc)",
            "Cổng sạc": "USB-C, MagSafe sạc không dây",
            "Kháng nước": "IP54 chống bụi bẩn & mồ hôi"
        }
    },
    {
        id: "p12",
        name: "Sạc dự phòng Anker 10000mAh PowerCore 22.5W",
        brand: "Anker",
        category: "accessories",
        price: 590000,
        originalPrice: 790000,
        rating: 4.7,
        reviewsCount: 218,
        image: "assets/macbook_m3.png",
        badge: "Bảo hành 18 tháng",
        badgeClass: "blue",
        promo: "1 đổi 1 trong 12 tháng lỗi nhà sản xuất + Giảm 10% khi mua chiếc thứ 2",
        colors: [
            { name: "Đen", hex: "#1c1c1c", priceOffset: 0, img: "assets/macbook_m3.png" },
            { name: "Trắng", hex: "#f0f0f0", priceOffset: 0, img: "assets/macbook_m3.png" },
            { name: "Xanh Dương", hex: "#325c82", priceOffset: 0, img: "assets/macbook_m3.png" }
        ],
        storages: [
            { name: "10000mAh", priceOffset: 0 }
        ],
        specs: {
            "Dung lượng pin": "10.000 mAh, lõi Li-Polymer bền bỉ",
            "Công suất sạc": "Tối đa 22.5W, hỗ trợ Power Delivery & Quick Charge",
            "Cổng sạc ra": "2 x USB-A, 1 x USB-C",
            "Cổng sạc vào": "1 x USB-C",
            "Kích thước": "Chỉ nhỏ bằng chiếc thẻ ATM"
        }
    }
];

// 2. QUẢN LÝ TRẠNG THÁI TOÀN CỤC CỦA ỨNG DỤNG (STATE MANAGEMENT)
let appState = {
    cart: JSON.parse(localStorage.getItem('tgdd_cart')) || [],
    selectedCategory: 'all',
    selectedBrand: 'all',
    selectedPrice: 'all',
    sortBy: 'popular',
    searchQuery: '',
    theme: localStorage.getItem('tgdd_theme') || 'light',
    location: localStorage.getItem('tgdd_location') || 'Hồ Chí Minh',
    appliedVoucher: null,
    voucherDiscount: 0,
    searchHistory: JSON.parse(localStorage.getItem('tgdd_search_history')) || []
};

// KHAI BÁO MÃ GIẢM GIÁ (VOUCHER) HỢP LỆ
const VALID_VOUCHER = {
    code: "TGDD2026",
    percent: 10
};

// 3. KHỞI TẠO ỨNG DỤNG KHI TẢI XONG TRANG
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLocation();
    initHeroCarousel();
    initCountdownTimer();
    renderCatalog();
    renderFlashSale();
    updateCartUI();
    setupEventListeners();
});

// 4. ĐIỀU KHIỂN GIAO DIỆN SÁNG/TỐI (THEME)
function initTheme() {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (appState.theme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

function toggleTheme() {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('tgdd_theme', appState.theme);
    initTheme();
    showToast(`Đã chuyển sang giao diện ${appState.theme === 'light' ? 'Sáng' : 'Tối'}!`, 'success');
}

// 5. ĐIỀU KHIỂN VÀ CHỌN KHU VỰC MUA HÀNG (LOCATION)
function initLocation() {
    document.getElementById('current-location').innerText = appState.location;
}

function selectLocation(locName) {
    appState.location = locName;
    localStorage.setItem('tgdd_location', locName);
    initLocation();
    
    // Đóng hộp thoại
    closeModal('location-modal', 'location-modal-overlay');
    showToast(`Đã chuyển khu vực mua hàng sang: ${locName}`, 'success');
    
    // Tải lại danh mục sản phẩm (Trong bản mô phỏng này chỉ cập nhật lại giao diện)
    renderCatalog();
}

// 6. LOGIC TRÌNH CHIẾU BANNER (HERO CAROUSEL)
let carouselIndex = 0;
let carouselInterval;

function initHeroCarousel() {
    const slides = document.querySelectorAll('#carousel-slides .carousel-slide');
    const dots = document.querySelectorAll('#carousel-indicators .dot');
    
    if (!slides.length) return;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    document.getElementById('carousel-next').addEventListener('click', () => {
        carouselIndex = (carouselIndex + 1) % slides.length;
        showSlide(carouselIndex);
        resetCarouselTimer();
    });
    
    document.getElementById('carousel-prev').addEventListener('click', () => {
        carouselIndex = (carouselIndex - 1 + slides.length) % slides.length;
        showSlide(carouselIndex);
        resetCarouselTimer();
    });
    
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            carouselIndex = idx;
            showSlide(carouselIndex);
            resetCarouselTimer();
        });
    });
    
    startCarouselTimer(slides.length);
}

function startCarouselTimer(totalSlides) {
    carouselInterval = setInterval(() => {
        carouselIndex = (carouselIndex + 1) % totalSlides;
        const slides = document.querySelectorAll('#carousel-slides .carousel-slide');
        const dots = document.querySelectorAll('#carousel-indicators .dot');
        if(slides[carouselIndex]) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[carouselIndex].classList.add('active');
            dots[carouselIndex].classList.add('active');
        }
    }, 5000);
}

function resetCarouselTimer() {
    clearInterval(carouselInterval);
    const slides = document.querySelectorAll('#carousel-slides .carousel-slide');
    if (slides.length) startCarouselTimer(slides.length);
}

// 7. BỘ ĐẾM NGƯỢC THỜI GIAN FLASH SALE
function initCountdownTimer() {
    let targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 4); // Flash sale kết thúc sau 4 tiếng kể từ lúc tải trang
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetTime - now;
        
        if (difference <= 0) {
            targetTime = new Date();
            targetTime.setHours(targetTime.getHours() + 4); // thiết lập lại vòng lặp đếm ngược
            return;
        }
        
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        document.getElementById('hour-box').innerText = String(hours).padStart(2, '0');
        document.getElementById('minute-box').innerText = String(minutes).padStart(2, '0');
        document.getElementById('second-box').innerText = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 8. KẾT XUẤT DANH SÁCH SẢN PHẨM FLASH SALE
function renderFlashSale() {
    const listContainer = document.getElementById('flash-sale-list');
    if (!listContainer) return;
    
    // Lấy 5 sản phẩm đầu tiên trong database để đưa vào Flash Sale
    const saleProducts = PRODUCTS_DB.slice(0, 5);
    
    listContainer.innerHTML = saleProducts.map(p => {
        const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        const soldQty = Math.floor(Math.random() * 15) + 5; // Mô phỏng ngẫu nhiên số lượng đã bán từ 5 đến 20 sản phẩm
        const totalQty = 25;
        const progressPercent = Math.round((soldQty / totalQty) * 100);
        
        return `
            <div class="product-card">
                <div class="card-top-badges">
                    <span class="card-badge red">-${discountPercent}%</span>
                    <span class="card-badge yellow">${p.badge || 'FLASH'}</span>
                </div>
                <div class="card-img-wrapper" onclick="openProductDetail('${p.id}')">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <span class="card-brand">${p.brand}</span>
                <h4 class="card-name" onclick="openProductDetail('${p.id}')">${p.name}</h4>
                <div class="card-rating-row">
                    <span class="stars-row">⭐ ${p.rating}</span>
                    <span class="reviews-qty">(${p.reviewsCount})</span>
                </div>
                <div class="card-price-block">
                    <span class="price-orig">${formatCurrency(p.originalPrice)}</span>
                    <span class="price-curr">${formatCurrency(p.price)}</span>
                </div>
                
                <!-- Progress bar for remaining items -->
                <div class="flash-sale-progress-wrapper">
                    <div class="progress-label">
                        <span>Đã bán ${soldQty}/${totalQty}</span>
                        <span>${progressPercent}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                </div>
                
                <div class="card-cta-group" style="margin-top: 15px;">
                    <button class="btn-card-primary" onclick="quickAddToCart('${p.id}')">MUA NGAY</button>
                    <button class="btn-card-secondary" onclick="openProductDetail('${p.id}')">Chi tiết</button>
                </div>
            </div>
        `;
    }).join('');
}

// 9. KẾT XUẤT LƯỚI SẢN PHẨM CHÍNH (KÈM BỘ LỌC & SẮP XẾP)
function renderCatalog() {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-products');
    const qtyTag = document.getElementById('product-qty-tag');
    const titleTag = document.getElementById('catalog-title');
    
    if (!grid) return;
    
    // Cập nhật tiêu đề danh mục dựa trên bộ lọc danh mục đang hoạt động
    let currentCategoryText = "Tất cả sản phẩm";
    if (appState.selectedCategory === 'phone') currentCategoryText = "Điện thoại";
    else if (appState.selectedCategory === 'laptop') currentCategoryText = "Laptop";
    else if (appState.selectedCategory === 'tablet') currentCategoryText = "Máy tính bảng (Tablet)";
    else if (appState.selectedCategory === 'watch') currentCategoryText = "Đồng hồ thông minh (Smartwatch)";
    else if (appState.selectedCategory === 'accessories') currentCategoryText = "Phụ kiện công nghệ";
    
    titleTag.innerText = currentCategoryText;

    // Thực hiện các logic lọc sản phẩm
    let filteredList = PRODUCTS_DB.filter(p => {
        // Lọc sản phẩm theo danh mục
        if (appState.selectedCategory !== 'all' && p.category !== appState.selectedCategory) {
            return false;
        }
        // Lọc sản phẩm theo hãng sản xuất (thương hiệu)
        if (appState.selectedBrand !== 'all' && p.brand !== appState.selectedBrand) {
            return false;
        }
        // Lọc sản phẩm theo khoảng giá tiền
        if (appState.selectedPrice !== 'all') {
            if (appState.selectedPrice === 'under-10m' && p.price >= 10000000) return false;
            if (appState.selectedPrice === '10m-20m' && (p.price < 10000000 || p.price > 20000000)) return false;
            if (appState.selectedPrice === 'over-20m' && p.price <= 20000000) return false;
        }
        // Lọc sản phẩm theo từ khóa tìm kiếm của người dùng
        if (appState.searchQuery !== '') {
            const query = appState.searchQuery.toLowerCase().trim();
            const nameMatch = p.name.toLowerCase().includes(query);
            const brandMatch = p.brand.toLowerCase().includes(query);
            const catMatch = p.category.toLowerCase().includes(query);
            if (!nameMatch && !brandMatch && !catMatch) return false;
        }
        return true;
    });

    // Thực hiện các logic sắp xếp
    if (appState.sortBy === 'popular') {
        filteredList.sort((a, b) => b.rating - a.rating);
    } else if (appState.sortBy === 'price-asc') {
        filteredList.sort((a, b) => a.price - b.price);
    } else if (appState.sortBy === 'price-desc') {
        filteredList.sort((a, b) => b.price - a.price);
    } else if (appState.sortBy === 'rating') {
        filteredList.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    // Kết xuất kết quả ra màn hình
    qtyTag.innerText = `${filteredList.length} sản phẩm`;
    
    if (filteredList.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = filteredList.map(p => {
        const showBadge = p.badge ? `<span class="card-badge ${p.badgeClass}">${p.badge}</span>` : '';
        const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        
        return `
            <div class="product-card" data-id="${p.id}">
                <div class="card-top-badges">
                    <span class="card-badge red">-${discountPercent}%</span>
                    ${showBadge}
                </div>
                <div class="card-img-wrapper" onclick="openProductDetail('${p.id}')">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                </div>
                <span class="card-brand">${p.brand}</span>
                <h4 class="card-name" onclick="openProductDetail('${p.id}')">${p.name}</h4>
                <div class="card-rating-row">
                    <span class="stars-row">⭐ ${p.rating}</span>
                    <span class="reviews-qty">(${p.reviewsCount})</span>
                </div>
                <div class="card-price-block">
                    <span class="price-orig">${formatCurrency(p.originalPrice)}</span>
                    <span class="price-curr">${formatCurrency(p.price)}</span>
                </div>
                <div class="card-promo-gift">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                    <span>${p.promo}</span>
                </div>
                <div class="card-cta-group">
                    <button class="btn-card-primary" onclick="quickAddToCart('${p.id}')">MUA NGAY</button>
                    <button class="btn-card-secondary" onclick="openProductDetail('${p.id}')">Chi tiết</button>
                </div>
            </div>
        `;
    }).join('');
}

// 10. XỬ LÝ THANH TÌM KIẾM & GỢI Ý TÌM KIẾM TỰ ĐỘNG
const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');
const historyList = document.getElementById('search-history-list');
const historySection = document.getElementById('history-suggestions');

searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
        searchSuggestions.classList.add('active');
        renderSearchSuggestions(val);
    } else {
        renderSearchHistory();
    }
});

searchInput.addEventListener('focus', () => {
    searchSuggestions.classList.add('active');
    if (searchInput.value.trim().length === 0) {
        renderSearchHistory();
    }
});

// Đóng hộp gợi ý khi click ra ngoài vùng tìm kiếm
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove('active');
    }
});

function renderSearchSuggestions(query) {
    const tagsContainer = document.querySelector('.suggestion-tags');
    const titleContainer = document.querySelector('.suggestion-title');
    
    titleContainer.innerText = "Sản phẩm gợi ý";
    
    // Lọc các sản phẩm có tên trùng khớp với từ khóa gõ vào
    const matches = PRODUCTS_DB.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    
    if (matches.length === 0) {
        tagsContainer.innerHTML = `<span style="font-size:0.8rem; color:var(--text-light)">Không có gợi ý trùng khớp</span>`;
        return;
    }
    
    tagsContainer.innerHTML = matches.map(p => `
        <div class="suggestion-item" onclick="triggerSuggestionSearch('${p.name}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>${p.name}</span>
        </div>
    `).join('');
}

function triggerSuggestionSearch(text) {
    searchInput.value = text;
    searchSuggestions.classList.remove('active');
    
    appState.searchQuery = text;
    addToSearchHistory(text);
    
    renderCatalog();
    scrollToSection('catalog-section');
}

function addToSearchHistory(query) {
    if (!query) return;
    appState.searchHistory = appState.searchHistory.filter(h => h.toLowerCase() !== query.toLowerCase());
    appState.searchHistory.unshift(query);
    appState.searchHistory = appState.searchHistory.slice(0, 5); // Chỉ giữ lại tối đa 5 từ khóa tìm kiếm gần nhất
    localStorage.setItem('tgdd_search_history', JSON.stringify(appState.searchHistory));
}

function renderSearchHistory() {
    const titleContainer = document.querySelector('.suggestion-title');
    const tagsContainer = document.querySelector('.suggestion-tags');
    
    titleContainer.innerText = "Tìm kiếm phổ biến";
    tagsContainer.innerHTML = `
        <span class="sug-tag" onclick="triggerSuggestionSearch('iPhone 15')">iPhone 15</span>
        <span class="sug-tag" onclick="triggerSuggestionSearch('Samsung S24')">Samsung S24</span>
        <span class="sug-tag" onclick="triggerSuggestionSearch('Macbook Air')">Macbook Air</span>
        <span class="sug-tag" onclick="triggerSuggestionSearch('AirPods Pro')">AirPods Pro</span>
        <span class="sug-tag" onclick="triggerSuggestionSearch('iPad Pro')">iPad Pro</span>
    `;
    
    if (appState.searchHistory.length > 0) {
        historySection.style.display = 'block';
        historyList.innerHTML = appState.searchHistory.map(h => `
            <li class="suggestion-item" onclick="triggerSuggestionSearch('${h}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>${h}</span>
            </li>
        `).join('');
    } else {
        historySection.style.display = 'none';
    }
}

// Xử lý sự kiện gửi form tìm kiếm (khi nhấn Enter hoặc click nút Kính lúp)
document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = searchInput.value.trim();
    appState.searchQuery = val;
    addToSearchHistory(val);
    searchSuggestions.classList.remove('active');
    renderCatalog();
    scrollToSection('catalog-section');
});

// 11. CẤU HÌNH VÀ HIỂN THỊ MODAL CHI TIẾT SẢN PHẨM
let currentDetailProduct = null;
let selectedDetailColorIdx = 0;
let selectedDetailStorageIdx = 0;

function openProductDetail(productId) {
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return;
    
    currentDetailProduct = product;
    selectedDetailColorIdx = 0;
    selectedDetailStorageIdx = 0;
    
    // Điền các thông tin cơ bản của sản phẩm
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-brand').innerText = product.brand;
    document.getElementById('detail-badge').innerText = product.badge || "KM LỚN";
    document.getElementById('detail-reviews').innerText = `(${product.reviewsCount} đánh giá)`;
    
    // Cập nhật giá bán và ảnh theo màu sắc / bộ nhớ
    updateDetailPriceAndImages();
    
    // Hiển thị danh sách tùy chọn màu sắc
    const colorsRow = document.getElementById('detail-color-options');
    colorsRow.innerHTML = product.colors.map((c, idx) => `
        <div class="color-opt-item ${idx === 0 ? 'active' : ''}" onclick="selectDetailColor(${idx})">
            <span class="color-circle" style="background-color: ${c.hex}"></span>
            <span>${c.name}</span>
        </div>
    `).join('');
    
    // Hiển thị danh sách tùy chọn dung lượng bộ nhớ
    const storageRow = document.getElementById('detail-memory-options');
    storageRow.innerHTML = product.storages.map((s, idx) => `
        <div class="mem-opt-item ${idx === 0 ? 'active' : ''}" onclick="selectDetailStorage(${idx})">
            <span>${s.name}</span>
        </div>
    `).join('');

    // Hiển thị bảng thông số kỹ thuật
    const specsTable = document.getElementById('specs-table');
    specsTable.innerHTML = Object.entries(product.specs).map(([key, val]) => `
        <tr>
            <td>${key}</td>
            <td>${val}</td>
        </tr>
    `).join('');

    // Hiển thị danh sách ảnh thu nhỏ
    const thumbsRow = document.getElementById('detail-thumbnails');
    thumbsRow.innerHTML = product.colors.map((c, idx) => `
        <div class="detail-thumb ${idx === 0 ? 'active' : ''}" onclick="selectDetailColor(${idx})">
            <img src="${c.img}" alt="${c.name}">
        </div>
    `).join('');

    // Mở hộp thoại chi tiết sản phẩm
    openModal('product-detail-modal', 'detail-modal-overlay');
}

function selectDetailColor(colorIdx) {
    selectedDetailColorIdx = colorIdx;
    
    // Cập nhật trạng thái hiển thị active trên giao diện
    const items = document.querySelectorAll('#detail-color-options .color-opt-item');
    items.forEach((item, idx) => {
        if(idx === colorIdx) item.classList.add('active');
        else item.classList.remove('active');
    });

    const thumbs = document.querySelectorAll('#detail-thumbnails .detail-thumb');
    thumbs.forEach((thumb, idx) => {
        if(idx === colorIdx) thumb.classList.add('active');
        else thumb.classList.remove('active');
    });
    
    updateDetailPriceAndImages();
}

function selectDetailStorage(storageIdx) {
    selectedDetailStorageIdx = storageIdx;
    
    // Cập nhật trạng thái hiển thị active trên giao diện
    const items = document.querySelectorAll('#detail-memory-options .mem-opt-item');
    items.forEach((item, idx) => {
        if(idx === storageIdx) item.classList.add('active');
        else item.classList.remove('active');
    });
    
    updateDetailPriceAndImages();
}

function updateDetailPriceAndImages() {
    if (!currentDetailProduct) return;
    
    const colorObj = currentDetailProduct.colors[selectedDetailColorIdx];
    const storageObj = currentDetailProduct.storages[selectedDetailStorageIdx];
    
    // Tính toán giá tiền thực tế (Giá gốc + giá chênh lệch của màu/bộ nhớ chọn thêm)
    const basePrice = currentDetailProduct.price;
    const baseOrigPrice = currentDetailProduct.originalPrice;
    
    const offset = colorObj.priceOffset + storageObj.priceOffset;
    const finalPrice = basePrice + offset;
    const finalOrigPrice = baseOrigPrice + offset;
    
    document.getElementById('detail-price-curr').innerText = formatCurrency(finalPrice);
    document.getElementById('detail-price-orig').innerText = formatCurrency(finalOrigPrice);
    
    // Cập nhật ảnh đại diện chính của sản phẩm
    document.getElementById('detail-main-img').src = colorObj.img;
}

// Logic ẩn/hiện bảng thông số kỹ thuật chi tiết
document.getElementById('specs-toggle-btn').addEventListener('click', () => {
    const table = document.getElementById('specs-table');
    table.classList.toggle('active');
    
    const svg = document.querySelector('#specs-toggle-btn svg');
    if (table.classList.contains('active')) {
        svg.style.transform = 'rotate(0deg)';
    } else {
        svg.style.transform = 'rotate(180deg)';
    }
});

// Kích hoạt hành động Mua ngay / Thêm vào giỏ từ màn hình Chi tiết sản phẩm
document.getElementById('detail-add-cart-btn').addEventListener('click', () => {
    if (!currentDetailProduct) return;
    const color = currentDetailProduct.colors[selectedDetailColorIdx].name;
    const storage = currentDetailProduct.storages[selectedDetailStorageIdx].name;
    const offset = currentDetailProduct.colors[selectedDetailColorIdx].priceOffset + currentDetailProduct.storages[selectedDetailStorageIdx].priceOffset;
    
    addToCart(currentDetailProduct.id, 1, color, storage, offset);
    closeModal('product-detail-modal', 'detail-modal-overlay');
    openCartDrawer();
});

document.getElementById('detail-buy-now-btn').addEventListener('click', () => {
    if (!currentDetailProduct) return;
    const color = currentDetailProduct.colors[selectedDetailColorIdx].name;
    const storage = currentDetailProduct.storages[selectedDetailStorageIdx].name;
    const offset = currentDetailProduct.colors[selectedDetailColorIdx].priceOffset + currentDetailProduct.storages[selectedDetailStorageIdx].priceOffset;
    
    addToCart(currentDetailProduct.id, 1, color, storage, offset);
    closeModal('product-detail-modal', 'detail-modal-overlay');
    openCartDrawer();
    openCheckout();
});

// 12. LOGIC QUẢN LÝ VÀ XỬ LÝ GIỎ HÀNG
function addToCart(productId, qty, color = '', storage = '', priceOffset = 0) {
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return;
    
    const cartItemId = `${productId}-${color}-${storage}`.replace(/\s+/g, '-');
    const existingIndex = appState.cart.findIndex(item => item.cartItemId === cartItemId);
    
    const itemPrice = product.price + priceOffset;
    
    if (existingIndex > -1) {
        appState.cart[existingIndex].qty += qty;
    } else {
        appState.cart.push({
            cartItemId: cartItemId,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            color: color,
            storage: storage,
            price: itemPrice,
            qty: qty
        });
    }
    
    localStorage.setItem('tgdd_cart', JSON.stringify(appState.cart));
    updateCartUI();
    showToast(`Đã thêm ${product.name} (${color} - ${storage}) vào giỏ hàng!`, 'success');
}

function quickAddToCart(productId) {
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return;
    
    // Chọn màu sắc và dung lượng mặc định (đầu tiên)
    const color = product.colors[0].name;
    const storage = product.storages[0].name;
    
    addToCart(productId, 1, color, storage, 0);
    
    // Tạo hiệu ứng nảy (bounce) trên nút giỏ hàng để thông báo cho người dùng
    const cartBtn = document.getElementById('cart-drawer-btn');
    cartBtn.style.animation = 'none';
    setTimeout(() => {
        cartBtn.style.animation = 'cartBounce 0.4s ease';
    }, 10);
}

function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const cartQtyBadge = document.getElementById('cart-qty-badge');
    const checkoutTotalTag = document.getElementById('checkout-total-tag');
    
    const totalQty = appState.cart.reduce((total, item) => total + item.qty, 0);
    
    cartCountElement.innerText = totalQty;
    cartQtyBadge.innerText = totalQty;
    
    renderCartItems();
    calculateCartTotals();
    
    const grandTotal = getGrandTotal();
    checkoutTotalTag.innerText = formatCurrency(grandTotal);
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    if (appState.cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <h4>Giỏ hàng của bạn đang trống!</h4>
                <p>Nhấp vào nút bên dưới để chọn ngay một sản phẩm ưng ý.</p>
            </div>
        `;
        document.getElementById('cart-drawer-footer').style.display = 'none';
        return;
    }
    
    document.getElementById('cart-drawer-footer').style.display = 'block';
    
    container.innerHTML = appState.cart.map(item => `
        <div class="cart-item-row" data-cart-id="${item.cartItemId}">
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-variant">${item.color} | ${item.storage}</div>
                <div class="cart-item-price-qty">
                    <span class="cart-item-price">${formatCurrency(item.price)}</span>
                    <div style="display:flex; align-items:center;">
                        <div class="qty-selector">
                            <button class="qty-btn" onclick="adjustItemQty('${item.cartItemId}', -1)">-</button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn" onclick="adjustItemQty('${item.cartItemId}', 1)">+</button>
                        </div>
                        <button class="remove-cart-item-btn" onclick="removeCartItem('${item.cartItemId}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function adjustItemQty(cartItemId, amount) {
    const index = appState.cart.findIndex(item => item.cartItemId === cartItemId);
    if (index === -1) return;
    
    appState.cart[index].qty += amount;
    
    if (appState.cart[index].qty <= 0) {
        removeCartItem(cartItemId);
        return;
    }
    
    localStorage.setItem('tgdd_cart', JSON.stringify(appState.cart));
    updateCartUI();
}

function removeCartItem(cartItemId) {
    const item = appState.cart.find(item => item.cartItemId === cartItemId);
    appState.cart = appState.cart.filter(item => item.cartItemId !== cartItemId);
    
    localStorage.setItem('tgdd_cart', JSON.stringify(appState.cart));
    updateCartUI();
    if(item) {
        showToast(`Đã xóa ${item.name} khỏi giỏ hàng.`, 'warning');
    }
}

function calculateCartTotals() {
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('cart-subtotal').innerText = formatCurrency(subtotal);
    
    if (appState.appliedVoucher) {
        appState.voucherDiscount = Math.round(subtotal * (appState.appliedVoucher.percent / 100));
        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('cart-discount').innerText = `-${formatCurrency(appState.voucherDiscount)}`;
    } else {
        appState.voucherDiscount = 0;
        document.getElementById('discount-row').style.display = 'none';
    }
    
    const total = subtotal - appState.voucherDiscount;
    document.getElementById('cart-total').innerText = formatCurrency(total);
}

function getGrandTotal() {
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return subtotal - appState.voucherDiscount;
}

// Áp dụng mã voucher giảm giá
document.getElementById('apply-voucher-btn').addEventListener('click', () => {
    const input = document.getElementById('voucher-input').value.trim();
    const msgElement = document.getElementById('voucher-message');
    
    if (input === '') {
        msgElement.innerText = "Vui lòng nhập mã voucher!";
        msgElement.className = "voucher-message error";
        return;
    }
    
    if (input.toLowerCase() === VALID_VOUCHER.code.toLowerCase()) {
        appState.appliedVoucher = VALID_VOUCHER;
        msgElement.innerText = `Áp dụng thành công voucher giảm giá ${VALID_VOUCHER.percent}%!`;
        msgElement.className = "voucher-message success";
        showToast(`Áp dụng thành công mã voucher: ${VALID_VOUCHER.code}`, 'success');
        updateCartUI();
    } else {
        msgElement.innerText = "Mã voucher không hợp lệ hoặc đã hết hạn!";
        msgElement.className = "voucher-message error";
    }
});

// 13. MÔ PHỎNG QUY TRÌNH THANH TOÁN & TIẾN TRÌNH ĐƠN HÀNG
const checkoutForm = document.getElementById('checkout-form');
const deliveryHome = document.getElementById('type-home');
const deliveryStore = document.getElementById('type-store');
const addressSection = document.getElementById('delivery-address-section');

deliveryHome.addEventListener('click', () => {
    deliveryHome.classList.add('active');
    deliveryStore.classList.remove('active');
    document.querySelector('input[name="delivery-type"][value="home"]').checked = true;
    addressSection.innerHTML = `
        <div class="form-input-group" style="grid-column: 1 / -1;">
            <input type="text" id="cust-address" placeholder="Nhập số nhà, tên đường, phường/xã..." required>
        </div>
    `;
});

deliveryStore.addEventListener('click', () => {
    deliveryStore.classList.add('active');
    deliveryHome.classList.remove('active');
    document.querySelector('input[name="delivery-type"][value="store"]').checked = true;
    addressSection.innerHTML = `
        <div class="form-input-group" style="grid-column: 1 / -1;">
            <select id="cust-address" required style="width:100%; padding:12px; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); font-weight:600;">
                <option value="Store 1">Siêu thị 136 Nguyễn Ảnh Thủ, Hóc Môn, TP.HCM</option>
                <option value="Store 2">Siêu thị 364 Nguyễn Thị Thập, Quận 7, TP.HCM</option>
                <option value="Store 3">Siêu thị 26 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội</option>
            </select>
        </div>
    `;
});

// Cập nhật giao diện active cho các thẻ chọn phương thức thanh toán
const paymentCards = document.querySelectorAll('.payment-method-card');
paymentCards.forEach(card => {
    card.addEventListener('click', () => {
        paymentCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        card.querySelector('input[type="radio"]').checked = true;
    });
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const delivery = document.querySelector('input[name="delivery-type"]:checked').value;
    
    // Kiểm tra giỏ hàng có trống không
    if (appState.cart.length === 0) {
        showToast("Giỏ hàng của bạn đang trống! Không thể đặt hàng.", "error");
        return;
    }
    
    // Mô phỏng đặt hàng thành công
    closeModal('checkout-modal', 'checkout-modal-overlay');
    closeCartDrawer();
    
    // Tạo tóm tắt thông tin chi tiết đơn hàng
    const summaryContainer = document.getElementById('order-summary-items');
    summaryContainer.innerHTML = appState.cart.map(item => `
        <div class="summary-item-line">
            <span>${item.qty}x ${item.name} (${item.color})</span>
            <span>${formatCurrency(item.price * item.qty)}</span>
        </div>
    `).join('');
    
    const finalAmount = getGrandTotal();
    document.getElementById('order-summary-total').innerText = formatCurrency(finalAmount);
    
    // Tạo mã đơn hàng ngẫu nhiên dạng TGDD-xxxxx
    const orderCode = `TGDD-${Math.floor(Math.random() * 90000) + 10000}`;
    document.getElementById('order-code-tag').innerText = `Mã đơn hàng: #` + orderCode;
    
    // Hiển thị modal chúc mừng đặt hàng thành công
    openModal('order-success-modal', 'order-modal-overlay');
    showToast("Đặt hàng thành công! Đang xử lý đơn...", "success");
    
    // Chạy hiệu ứng bắn pháo hoa giấy chúc mừng!
    startConfetti();
    
    // Làm trống giỏ hàng và xóa dữ liệu giỏ hàng cũ
    appState.cart = [];
    localStorage.removeItem('tgdd_cart');
    appState.appliedVoucher = null;
    appState.voucherDiscount = 0;
    document.getElementById('voucher-input').value = '';
    document.getElementById('voucher-message').innerText = '';
    updateCartUI();
    
    // Mô phỏng tiến trình vận chuyển đơn hàng thay đổi theo thời gian
    const steps = document.querySelectorAll('.order-status-timeline .timeline-step');
    steps.forEach((step, idx) => {
        step.className = 'timeline-step'; // reset
        if (idx === 0) step.classList.add('completed');
        if (idx === 1) step.classList.add('active');
    });
    
    // Bước 2 hoàn thành -> Bước 3 hoạt động (sau 6 giây)
    setTimeout(() => {
        if(document.getElementById('order-success-modal').classList.contains('active')) {
            steps[0].className = 'timeline-step completed';
            steps[1].className = 'timeline-step completed';
            steps[2].className = 'timeline-step active';
            showToast("Đơn hàng đã được SIÊU THỊ XÁC NHẬN! Đang bắt đầu vận chuyển.", "success");
        }
    }, 6000);

    // Bước 3 hoàn thành -> Bước 4 hoạt động (sau 12 giây)
    setTimeout(() => {
        if(document.getElementById('order-success-modal').classList.contains('active')) {
            steps[0].className = 'timeline-step completed';
            steps[1].className = 'timeline-step completed';
            steps[2].className = 'timeline-step completed';
            steps[3].className = 'timeline-step active';
            showToast("Nhân viên đang giao hàng tới địa chỉ của bạn!", "success");
        }
    }, 12000);
});

// 14. CÁC HÀM TIỆN ÍCH HỖ TRỢ (UTILITIES)
function formatCurrency(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', '₫');
}

// Hệ thống hiển thị thông báo Toast nổi nhanh
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let svgIcon = '';
    if (type === 'success') {
        svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else if (type === 'warning') {
        svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${svgIcon}</div>
        <span class="toast-msg">${msg}</span>
    `;
    
    container.appendChild(toast);
    
    // Tự động xóa thông báo Toast sau 4 giây
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// Logic hoạt họa vẽ các hạt pháo hoa rơi trên canvas
let confettiActive = false;
let confettiRequest;
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    const particles = [];
    const colors = ['#ffd400', '#ef4444', '#3b82f6', '#10b981', '#a855f7', '#f97316'];
    
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }
    
    confettiActive = true;
    function draw() {
        if (!confettiActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, idx) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;
            
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
            
            // Đưa các hạt rơi hết màn hình quay lại vị trí phía trên cùng
            if (p.y > canvas.height) {
                particles[idx] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngleIncremental: p.tiltAngleIncremental,
                    tiltAngle: p.tiltAngle
                };
            }
        });
        
        confettiRequest = requestAnimationFrame(draw);
    }
    
    draw();
    
    // Dừng chạy hiệu ứng bắn pháo hoa sau 6 giây
    setTimeout(() => {
        confettiActive = false;
        cancelAnimationFrame(confettiRequest);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 6000);
}

// Các hàm hỗ trợ mở/đóng Modal chung
function openModal(modalId, overlayId) {
    document.getElementById(modalId).classList.add('active');
    document.getElementById(overlayId).classList.add('active');
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang nền của website
}

function closeModal(modalId, overlayId) {
    document.getElementById(modalId).classList.remove('active');
    document.getElementById(overlayId).classList.remove('active');
    document.body.style.overflow = ''; // Mở khóa cuộn trang nền
}

// Mở/Đóng ngăn kéo giỏ hàng
function openCartDrawer() {
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-drawer-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('cart-drawer-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function openCheckout() {
    updateCartUI();
    if(appState.cart.length === 0) {
        showToast("Vui lòng thêm sản phẩm vào giỏ để đặt hàng!", "error");
        return;
    }
    openModal('checkout-modal', 'checkout-modal-overlay');
}

// 15. MÔ PHỎNG ĐIỀU HƯỚNG LIÊN TRANG VÀ CUỘN MÀN HÌNH
function scrollToProducts(categoryName, brandName = 'all') {
    appState.selectedCategory = categoryName;
    appState.selectedBrand = brandName;
    appState.selectedPrice = 'all';
    appState.searchQuery = '';
    searchInput.value = '';
    
    // Cập nhật trạng thái active cho các nút danh mục trên nav
    const catItems = document.querySelectorAll('.cat-item');
    catItems.forEach(item => {
        if(item.getAttribute('data-category') === categoryName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Cập nhật trạng thái active cho các tag hãng
    const brandTags = document.querySelectorAll('#brand-filters .filter-tag');
    brandTags.forEach(tag => {
        if(tag.getAttribute('data-brand') === brandName) {
            tag.classList.add('active');
        } else {
            tag.classList.remove('active');
        }
    });

    // Cập nhật trạng thái active cho các tag khoảng giá
    const priceTags = document.querySelectorAll('#price-filters .filter-tag');
    priceTags.forEach((tag, idx) => {
        if(idx === 0) tag.classList.add('active');
        else tag.classList.remove('active');
    });

    renderCatalog();
    scrollToSection('catalog-section');
}

function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return;
    
    const yOffset = -90; // khoảng cách bù trừ cho header cố định
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

// 16. THIẾT LẬP CÁC SỰ KIỆN TƯƠNG TÁC (EVENT LISTENERS)
function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Location modal open/close
    document.getElementById('location-select-btn').addEventListener('click', () => {
        openModal('location-modal', 'location-modal-overlay');
    });
    document.getElementById('close-location-btn').addEventListener('click', () => {
        closeModal('location-modal', 'location-modal-overlay');
    });
    document.getElementById('location-modal-overlay').addEventListener('click', () => {
        closeModal('location-modal', 'location-modal-overlay');
    });
    
    // Đăng ký sự kiện click cho các nút chọn Tỉnh/Thành
    const locButtons = document.querySelectorAll('.loc-select-item');
    locButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            locButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectLocation(btn.getAttribute('data-loc'));
        });
    });

    // Cart Drawer triggers
    document.getElementById('cart-drawer-btn').addEventListener('click', openCartDrawer);
    document.getElementById('close-cart-btn').addEventListener('click', closeCartDrawer);
    document.getElementById('cart-drawer-overlay').addEventListener('click', closeCartDrawer);
    document.getElementById('continue-shopping-btn').addEventListener('click', closeCartDrawer);
    document.getElementById('open-checkout-btn').addEventListener('click', () => {
        openCheckout();
    });

    // Đăng ký sự kiện đóng modal thanh toán
    document.getElementById('close-checkout-btn').addEventListener('click', () => {
        closeModal('checkout-modal', 'checkout-modal-overlay');
    });
    document.getElementById('checkout-modal-overlay').addEventListener('click', () => {
        closeModal('checkout-modal', 'checkout-modal-overlay');
    });

    // Đăng ký sự kiện đóng modal chúc mừng thành công
    document.getElementById('back-home-btn').addEventListener('click', () => {
        closeModal('order-success-modal', 'order-modal-overlay');
        scrollToSection('logo');
    });
    document.getElementById('order-modal-overlay').addEventListener('click', () => {
        closeModal('order-success-modal', 'order-modal-overlay');
    });

    // Product Detail modal close
    document.getElementById('close-detail-btn').addEventListener('click', () => {
        closeModal('product-detail-modal', 'detail-modal-overlay');
    });
    document.getElementById('detail-modal-overlay').addEventListener('click', () => {
        closeModal('product-detail-modal', 'detail-modal-overlay');
    });

    // Click vào logo để đặt lại toàn bộ bộ lọc và về trang chủ
    document.getElementById('logo').addEventListener('click', (e) => {
        e.preventDefault();
        scrollToProducts('all');
    });

    // Đăng ký sự kiện click cho thanh danh mục sản phẩm
    const catItems = document.querySelectorAll('.cat-item');
    catItems.forEach(item => {
        item.addEventListener('click', () => {
            catItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const cat = item.getAttribute('data-category');
            appState.selectedCategory = cat;
            appState.selectedBrand = 'all'; // reset brand filter on category change
            
            // Sync brand tags display
            const brandTags = document.querySelectorAll('#brand-filters .filter-tag');
            brandTags.forEach((tag, idx) => {
                if(idx === 0) tag.classList.add('active');
                else tag.classList.remove('active');
            });
            
            renderCatalog();
        });
    });

    // Đăng ký sự kiện click cho bộ lọc thương hiệu
    const brandTags = document.querySelectorAll('#brand-filters .filter-tag');
    brandTags.forEach(tag => {
        tag.addEventListener('click', () => {
            brandTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            appState.selectedBrand = tag.getAttribute('data-brand');
            renderCatalog();
        });
    });

    // Đăng ký sự kiện click cho bộ lọc khoảng giá
    const priceTags = document.querySelectorAll('#price-filters .filter-tag');
    priceTags.forEach(tag => {
        tag.addEventListener('click', () => {
            priceTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            appState.selectedPrice = tag.getAttribute('data-price');
            renderCatalog();
        });
    });

    // Đăng ký sự kiện thay đổi kiểu sắp xếp
    document.getElementById('sort-select').addEventListener('change', (e) => {
        appState.sortBy = e.target.value;
        renderCatalog();
    });

    // Đăng ký sự kiện click nút Xóa bộ lọc khi không có sản phẩm
    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        scrollToProducts('all');
    });
    
    // Đăng ký sự kiện click cho nút Tin công nghệ
    document.getElementById('shortcut-news').addEventListener('click', (e) => {
        e.preventDefault();
        showToast("Chào mừng bạn đến với mục 24h Công Nghệ. Trình mô phỏng sẽ hiển thị tin tức sớm nhất!", "warning");
    });
    document.getElementById('order-history-btn').addEventListener('click', (e) => {
        e.preventDefault();
        showToast("Chức năng tra cứu đơn hàng của bạn đang được phát triển!", "warning");
    });
}

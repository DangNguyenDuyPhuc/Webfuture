// ============================================
// BOOKING.JS - Logic đặt sân mượt mà chuẩn IDBooker
// ============================================

let selectedDate = getTodayStr(); // YYYY-MM-DD
let selectedCourt = 'random';    // 'random' hoặc Court ID (number)
let selectedDuration = 120;       // Thời lượng mặc định 120 phút (2 tiếng)
let selectedStartTime = null;     // Giờ chơi được chọn (e.g. '19:00')
let courtQuantity = 1;            // Số lượng sân mặc định là 1
let isCaptchaChecked = false;     // Trạng thái Robot Captcha

// Theo dõi tháng/năm trên lịch inline
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth(); // 0-indexed

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('calendar-days-grid')) return;
    initIDBookerWorkflow();
});

function initIDBookerWorkflow() {
    // 1. Gán mặc định & Khởi động Calendar
    updateSlotsSelectedDateLabel();
    renderInlineCalendar();
    
    // 2. Load danh sách sân vào dropdown ở Bước 2
    populateCourtsDropdown();

    // 3. Lắng nghe các sự kiện điều khiển
    setupEventListeners();

    // 4. Render lần đầu các khung giờ trống
    renderAvailableSlots();
}

// ---- POPULATE COURTS ----
function populateCourtsDropdown() {
    const courtSelect = document.getElementById('idb-court-select');
    if (!courtSelect) return;

    // Giữ lại option mặc định là Ngẫu nhiên
    courtSelect.innerHTML = `<option value="random">Sân ngẫu nhiên (Tự xếp sân trống)</option>`;
    
    COURTS.forEach(court => {
        let typeText = 'Standard';
        if (court.type === 'premium') typeText = 'Premium';
        if (court.type === 'vip') typeText = 'VIP';
        
        const option = document.createElement('option');
        option.value = court.id;
        option.textContent = `${court.image} ${court.name} (${typeText})`;
        courtSelect.appendChild(option);
    });
}

// ---- EVENT LISTENERS ----
function setupEventListeners() {
    // A. Bước 1: Accordion Số lượng sân
    const qtyHeader = document.getElementById('court-qty-header');
    const qtyBody = document.getElementById('court-qty-body');
    const collapseArrow = document.getElementById('collapse-arrow-icon');
    
    if (qtyHeader && qtyBody) {
        qtyHeader.addEventListener('click', () => {
            const isVisible = qtyBody.style.display !== 'none';
            qtyBody.style.display = isVisible ? 'none' : 'block';
            collapseArrow.textContent = isVisible ? '▶' : '▼';
        });
    }

    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyVal = document.getElementById('court-qty-val');
    const qtyLbl = document.getElementById('selected-court-qty-lbl');
    const qtyWarning = document.getElementById('qty-warning-box');

    if (qtyMinus && qtyPlus && qtyVal) {
        qtyMinus.addEventListener('click', () => {
            if (courtQuantity > 1) {
                courtQuantity--;
                qtyVal.textContent = courtQuantity;
                qtyLbl.textContent = `${courtQuantity} sân`;
                if (courtQuantity === 1) {
                    qtyWarning.style.display = 'none';
                }
            }
        });

        qtyPlus.addEventListener('click', () => {
            courtQuantity++;
            qtyVal.textContent = courtQuantity;
            qtyLbl.textContent = `${courtQuantity} sân`;
            if (courtQuantity > 1) {
                qtyWarning.style.display = 'block';
            }
        });
    }

    // B. Bước 2: Thay đổi Sân & Thời lượng
    const courtSelect = document.getElementById('idb-court-select');
    if (courtSelect) {
        courtSelect.addEventListener('change', (e) => {
            selectedCourt = e.target.value === 'random' ? 'random' : parseInt(e.target.value);
            selectedStartTime = null; // Reset giờ khi đổi sân
            hideFloatingFooter();
            renderAvailableSlots();
            updateStepActiveStates();
        });
    }

    const durationSelect = document.getElementById('idb-duration-select');
    if (durationSelect) {
        durationSelect.addEventListener('change', (e) => {
            selectedDuration = parseInt(e.target.value);
            selectedStartTime = null; // Reset giờ khi đổi thời lượng
            hideFloatingFooter();
            renderAvailableSlots();
        });
    }

    const btnShowPrices = document.getElementById('btn-show-prices');
    if (btnShowPrices) {
        btnShowPrices.addEventListener('click', () => {
            openModal('idb-pricing-modal');
        });
    }

    // C. Tabs bảng giá
    setupPricingTabs();

    // D. Calendar Navigation
    const calPrev = document.getElementById('cal-prev');
    const calNext = document.getElementById('cal-next');
    if (calPrev && calNext) {
        calPrev.addEventListener('click', () => {
            calMonth--;
            if (calMonth < 0) {
                calMonth = 11;
                calYear--;
            }
            renderInlineCalendar();
        });

        calNext.addEventListener('click', () => {
            calMonth++;
            if (calMonth > 11) {
                calMonth = 0;
                calYear++;
            }
            renderInlineCalendar();
        });
    }

    // E. Floating Footer & Scroll Navigation
    const btnFloatingContinue = document.getElementById('btn-floating-continue');
    if (btnFloatingContinue) {
        btnFloatingContinue.addEventListener('click', () => {
            // Cuộn xuống Form liên hệ Bước 4
            const step4 = document.getElementById('step-card-4');
            if (step4) {
                step4.classList.add('active');
                step4.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus vào ô tên
                document.getElementById('customer-name-custom')?.focus();
            }
        });
    }

    // F. Robot Captcha Widget
    const captchaTrigger = document.getElementById('captcha-trigger');
    const captchaBox = document.getElementById('captcha-box');
    const btnSubmit = document.getElementById('btn-submit-booking');

    if (captchaTrigger && captchaBox) {
        captchaTrigger.addEventListener('click', () => {
            if (isCaptchaChecked) return;

            captchaBox.innerHTML = `<span class="captcha-spinner"></span>`;
            captchaBox.classList.add('loading');

            setTimeout(() => {
                captchaBox.innerHTML = `✓`;
                captchaBox.classList.remove('loading');
                captchaBox.classList.add('checked');
                isCaptchaChecked = true;
                validateFormAndEnableSubmit();
            }, 1000);
        });
    }

    // G. Live validate form
    const inputName = document.getElementById('customer-name-custom');
    const inputPhone = document.getElementById('customer-phone-custom');
    
    if (inputName && inputPhone) {
        inputName.addEventListener('input', validateFormAndEnableSubmit);
        inputPhone.addEventListener('input', validateFormAndEnableSubmit);
    }

    // H. Submit Booking
    const btnSubmitBooking = document.getElementById('btn-submit-booking');
    if (btnSubmitBooking) {
        btnSubmitBooking.addEventListener('click', handleSubmitBooking);
    }

    // Close success modal button
    const btnCloseSuccess = document.getElementById('btn-close-success');
    if (btnCloseSuccess) {
        btnCloseSuccess.addEventListener('click', () => {
            closeSuccessModal();
            window.location.href = 'index.html';
        });
    }
}

// ---- TABS BẢNG GIÁ ----
function setupPricingTabs() {
    const tabMonSat = document.getElementById('tab-btn-mon-sat');
    const tabSun = document.getElementById('tab-btn-sun');
    const tabHoliday = document.getElementById('tab-btn-holiday');

    const contentMonSat = document.getElementById('tab-mon-sat');
    const contentSun = document.getElementById('tab-sun');
    const contentHoliday = document.getElementById('tab-holiday');

    if (tabMonSat && tabSun && tabHoliday) {
        const switchTab = (activeTab, activeContent) => {
            [tabMonSat, tabSun, tabHoliday].forEach(btn => btn.classList.remove('active'));
            [contentMonSat, contentSun, contentHoliday].forEach(content => {
                if (content) content.style.display = 'none';
            });

            activeTab.classList.add('active');
            if (activeContent) activeContent.style.display = 'block';
        };

        tabMonSat.addEventListener('click', () => switchTab(tabMonSat, contentMonSat));
        tabSun.addEventListener('click', () => switchTab(tabSun, contentSun));
        tabHoliday.addEventListener('click', () => switchTab(tabHoliday, contentHoliday));
    }
}

// ---- INLINE CALENDAR PICKER ----
function renderInlineCalendar() {
    const grid = document.getElementById('calendar-days-grid');
    const monthLbl = document.getElementById('cal-month-lbl');
    if (!grid || !monthLbl) return;

    grid.innerHTML = '';
    
    // Đặt tên tháng
    const monthNames = [
        'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
        'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
    ];
    monthLbl.textContent = `${monthNames[calMonth]} / ${calYear}`;

    // Ngày đầu tiên của tháng
    const firstDay = new Date(calYear, calMonth, 1);
    // Ngày cuối cùng của tháng
    const lastDay = new Date(calYear, calMonth + 1, 0).getDate();
    
    // Đổi ngày bắt đầu tuần: T2 -> CN. getDay() trả về 0 cho CN, 1 cho T2, ...
    let startDayIdx = firstDay.getDay() - 1; 
    if (startDayIdx < 0) startDayIdx = 6; // Nếu là Chủ nhật thì đưa về cuối (index 6)

    // Lấy ngày hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Điền các ngày trống ở đầu tháng
    for (let i = 0; i < startDayIdx; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'cal-day empty';
        grid.appendChild(emptyCell);
    }

    // Điền các ngày trong tháng
    for (let day = 1; day <= lastDay; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'cal-day';
        dayCell.textContent = day;

        const cellDate = new Date(calYear, calMonth, day);
        const cellDateStr = formatDateObj(cellDate);

        // Kiểm tra xem ngày này có trong quá khứ không
        if (cellDate < today) {
            dayCell.classList.add('disabled');
        } else {
            // Sự kiện chọn ngày
            dayCell.addEventListener('click', () => {
                selectedDate = cellDateStr;
                selectedStartTime = null;
                hideFloatingFooter();
                
                // Cập nhật giao diện active
                document.querySelectorAll('.cal-day').forEach(cell => cell.classList.remove('selected'));
                dayCell.classList.add('selected');

                updateSlotsSelectedDateLabel();
                renderAvailableSlots();
                updateStepActiveStates();
            });

            // Highlight ngày đang được chọn
            if (cellDateStr === selectedDate) {
                dayCell.classList.add('selected');
            }
        }

        grid.appendChild(dayCell);
    }
}

function formatDateObj(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function updateSlotsSelectedDateLabel() {
    const lbl = document.getElementById('slots-selected-date');
    if (lbl) {
        const parts = selectedDate.split('-');
        lbl.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
}

// ---- AVAILABLE SLOTS GRID ----
function renderAvailableSlots() {
    const containerMorning = document.getElementById('slots-morning');
    const containerAfternoon = document.getElementById('slots-afternoon');
    const containerEvening = document.getElementById('slots-evening');

    if (!containerMorning || !containerAfternoon || !containerEvening) return;

    containerMorning.innerHTML = '';
    containerAfternoon.innerHTML = '';
    containerEvening.innerHTML = '';

    const todayStr = getTodayStr();
    const currentHour = new Date().getHours();
    const currentMin = new Date().getMinutes();

    // Duyệt qua tất cả khung giờ bắt đầu
    TIME_SLOTS.forEach(time => {
        const hour = parseInt(time.split(':')[0]);
        const min = parseInt(time.split(':')[1]);

        // 1. Nếu là ngày hôm nay, chặn các giờ đã trôi qua
        if (selectedDate === todayStr) {
            if (hour < currentHour || (hour === currentHour && currentMin >= 30)) {
                return; // Bỏ qua vì đã trôi qua
            }
        }

        // 2. Kiểm tra xem có sân trống cho thời lượng được chọn hay không
        const isFree = checkSlotAvailability(selectedCourt, selectedDate, time, selectedDuration);

        if (!isFree) {
            // Không trống thì bỏ qua hoặc render dạng disabled
            return;
        }

        // RENDER SLOT BUTTON
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot-btn';
        btn.textContent = time;

        // Active state
        if (selectedStartTime === time) {
            btn.classList.add('selected');
        }

        btn.addEventListener('click', () => {
            document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedStartTime = time;

            // Kích hoạt floating footer
            showFloatingFooter(time);
            updateStepActiveStates();
        });

        // Phân bổ vào 3 buổi
        if (hour < 11) {
            containerMorning.appendChild(btn);
        } else if (hour < 17) {
            containerAfternoon.appendChild(btn);
        } else {
            containerEvening.appendChild(btn);
        }
    });

    // Nếu không có slots nào ở từng buổi, hiển thị thông báo trống
    checkEmptySlotsContainer(containerMorning);
    checkEmptySlotsContainer(containerAfternoon);
    checkEmptySlotsContainer(containerEvening);
}

function checkEmptySlotsContainer(container) {
    if (container.children.length === 0) {
        container.innerHTML = `<span class="no-slots-lbl">Không có giờ trống</span>`;
    }
}

// Kiểm tra sân trống cho thời lượng chơi (e.g. 120 phút thì cần 2 slots liên tục trống)
function checkSlotAvailability(courtId, date, startTime, durationMins) {
    const slotsNeeded = Math.ceil(durationMins / 60);
    const startHour = parseInt(startTime.split(':')[0]);

    // Tính toán danh sách các giờ cần kiểm tra
    const timesToCheck = [];
    for (let i = 0; i < slotsNeeded; i++) {
        const h = startHour + i;
        if (h >= 22) return false; // Vượt quá giờ mở cửa (đóng cửa lúc 22:00)
        timesToCheck.push(`${String(h).padStart(2, '0')}:00`);
    }

    if (courtId === 'random') {
        // Cần ít nhất 1 sân trống trong toàn bộ block giờ cần kiểm tra
        return COURTS.some(court => {
            return timesToCheck.every(t => !isSlotBooked(court.id, date, t));
        });
    } else {
        // Kiểm tra đúng sân đó có trống tất cả các slot cần thiết không
        return timesToCheck.every(t => !isSlotBooked(courtId, date, t));
    }
}

// ---- FLOATING FOOTER SUMMARY ----
function showFloatingFooter(startTime) {
    const footer = document.getElementById('idb-floating-footer');
    const details = document.getElementById('floating-sum-details');
    const priceLbl = document.getElementById('floating-sum-price');

    if (!footer || !details || !priceLbl) return;

    // Tính giờ kết thúc
    const startHour = parseInt(startTime.split(':')[0]);
    const durationHours = selectedDuration / 60;
    const endHour = startHour + durationHours;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;

    // Định dạng ngày
    const dateParts = selectedDate.split('-');
    const dateFormatted = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    // Lấy tên sân
    let courtName = 'Sân ngẫu nhiên';
    let courtType = 'standard';
    if (selectedCourt !== 'random') {
        const court = COURTS.find(c => c.id === selectedCourt);
        courtName = court.name;
        courtType = court.type;
    }

    details.textContent = `${courtName} | Ngày ${dateFormatted} | Giờ: ${startTime} - ${endTime} (${selectedDuration} phút)`;

    // Tính tổng tiền dựa trên giờ bắt đầu và thời lượng
    const totalPrice = calculateTotalPrice(courtType, startTime, selectedDuration);
    priceLbl.textContent = formatCurrency(totalPrice);

    footer.classList.add('active');
}

function hideFloatingFooter() {
    const footer = document.getElementById('idb-floating-footer');
    if (footer) footer.classList.remove('active');
}

function calculateTotalPrice(courtType, startTime, durationMins) {
    const slotsNeeded = Math.ceil(durationMins / 60);
    const startHour = parseInt(startTime.split(':')[0]);
    let total = 0;

    for (let i = 0; i < slotsNeeded; i++) {
        const h = startHour + i;
        const timeStr = `${String(h).padStart(2, '0')}:00`;
        total += getPrice(courtType, timeStr);
    }
    return total;
}

// ---- STEP STATES ANIMATION ----
function updateStepActiveStates() {
    const step1 = document.getElementById('step-card-1');
    const step2 = document.getElementById('step-card-2');
    const step3 = document.getElementById('step-card-3');
    const step4 = document.getElementById('step-card-4');

    // Bước 1 mặc định active
    // Bước 2: Khi đã chọn số lượng sân (mặc định luôn có)
    step2.classList.add('active');

    // Bước 3: Khi đã chọn xong dịch vụ & sân
    if (selectedCourt !== null) {
        step3.classList.add('active');
    }

    // Bước 4: Kích hoạt khi đã click chọn Giờ bắt đầu
    if (selectedStartTime !== null) {
        step4.classList.add('active');
    }
}

// ---- FORM VALIDATION & CAPTCHA ----
function validateFormAndEnableSubmit() {
    const name = document.getElementById('customer-name-custom')?.value.trim();
    const phone = document.getElementById('customer-phone-custom')?.value.trim();
    const btnSubmit = document.getElementById('btn-submit-booking');

    if (!btnSubmit) return;

    if (name && phone && phone.length >= 9 && isCaptchaChecked && selectedStartTime) {
        btnSubmit.disabled = false;
        btnSubmit.classList.add('pulse');
    } else {
        btnSubmit.disabled = true;
        btnSubmit.classList.remove('pulse');
    }
}

// ---- SUBMIT BOOKING ----
function handleSubmitBooking() {
    const name = document.getElementById('customer-name-custom')?.value.trim();
    const phone = document.getElementById('customer-phone-custom')?.value.trim();
    const email = document.getElementById('customer-email-custom')?.value.trim() || 'Trống';
    const note = document.getElementById('customer-note-custom')?.value.trim() || 'Không';

    if (!name || !phone || phone.length < 9) {
        showToast('Vui lòng điền họ tên và số điện thoại hợp lệ!', 'error');
        return;
    }

    if (!selectedStartTime) {
        showToast('Vui lòng chọn khung giờ bắt đầu!', 'error');
        return;
    }

    // Xác định sân thực tế để gán (Nếu chọn ngẫu nhiên thì tìm sân trống đầu tiên)
    let assignedCourtId = selectedCourt;
    if (selectedCourt === 'random') {
        const freeCourt = COURTS.find(court => {
            return checkSlotAvailability(court.id, selectedDate, selectedStartTime, selectedDuration);
        });
        if (freeCourt) {
            assignedCourtId = freeCourt.id;
        } else {
            showToast('Rất tiếc, hiện tại không còn sân nào trống cho khung giờ và thời lượng bạn chọn!', 'error');
            return;
        }
    }

    const courtObj = COURTS.find(c => c.id === assignedCourtId);
    
    // Tính giờ chơi
    const startHour = parseInt(selectedStartTime.split(':')[0]);
    const durationHours = selectedDuration / 60;
    const endHour = startHour + durationHours;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;

    // Tổng tiền
    const totalPrice = calculateTotalPrice(courtObj.type, selectedStartTime, selectedDuration);

    // Lưu từng khung giờ vào LocalStorage để đồng bộ với data.js & admin.js
    const slotsNeeded = Math.ceil(selectedDuration / 60);
    const bookingCode = 'SA-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    for (let i = 0; i < slotsNeeded; i++) {
        const h = startHour + i;
        const timeStr = `${String(h).padStart(2, '0')}:00`;
        
        addBooking({
            bookingCode: bookingCode,
            courtId: courtObj.id,
            courtName: courtObj.name,
            courtType: courtObj.type,
            date: selectedDate,
            time: timeStr,
            price: getPrice(courtObj.type, timeStr),
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            note: note,
        });
    }

    // Hiển thị Popup Hóa Đơn & QR Code Thanh Toán
    showSuccessReceiptModal(bookingCode, name, phone, courtObj.name, selectedDate, selectedStartTime, endTime, totalPrice);
}

// ---- SUCCESS RECEIPT & VIETQR PAYMENT ----
function showSuccessReceiptModal(code, name, phone, courtName, dateStr, startTime, endTime, totalAmount) {
    // 1. Cập nhật thông tin vé
    document.getElementById('ticket-code').textContent = code;
    document.getElementById('ticket-name').textContent = name;
    document.getElementById('ticket-phone').textContent = phone;
    document.getElementById('ticket-court').textContent = courtName;
    
    // Định dạng ngày
    const parts = dateStr.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    document.getElementById('ticket-date').textContent = formattedDate;
    document.getElementById('ticket-time').textContent = `${startTime} - ${endTime} (${selectedDuration} phút)`;
    
    const formattedPrice = formatCurrency(totalAmount);
    document.getElementById('ticket-total-price').textContent = formattedPrice;
    document.getElementById('payment-amount').textContent = formattedPrice;

    // Nội dung CK
    const paymentDesc = `SmashArena Dat San ${phone} Code ${code}`;
    document.getElementById('payment-desc').textContent = paymentDesc;

    // 2. Tạo VietQR Code tự động qua VietQR API
    // BIDV mã ngân hàng (BIN): 970418
    const qrImg = document.getElementById('vietqr-img');
    const qrSpinner = document.getElementById('qr-spinner');
    
    if (qrImg && qrSpinner) {
        qrImg.style.display = 'none';
        qrSpinner.style.display = 'block';

        const addInfoEncoded = encodeURIComponent(paymentDesc);
        const nameEncoded = encodeURIComponent('DANG NGUYEN DUY PHUC');
        const qrUrl = `https://api.vietqr.io/image/970418-0334273056-vietqr.jpg?accountName=${nameEncoded}&amount=${totalAmount}&addInfo=${addInfoEncoded}`;
        
        qrImg.src = qrUrl;
        qrImg.onload = () => {
            qrSpinner.style.display = 'none';
            qrImg.style.display = 'block';
        };
        qrImg.onerror = () => {
            // Thay thế bằng ảnh mock đẹp nếu lỗi API
            qrImg.src = `https://quickchart.io/qr?text=${encodeURIComponent(`STK:0334273056-BIDV-Amt:${totalAmount}-Msg:${paymentDesc}`)}&size=200`;
            qrSpinner.style.display = 'none';
            qrImg.style.display = 'block';
        };
    }

    // 3. Mở Modal
    openModal('idb-success-modal');
    hideFloatingFooter();
    showToast('Đặt sân thành công! 🎉', 'success');

    // 4. Kích hoạt mô phỏng thanh toán tự động (Lựa chọn số 4)
    initPaymentSimulation(code);
}

// ---- MÔ PHỎNG KIỂM TRA & DUYỆT GIAO DỊCH TỰ ĐỘNG ----
function initPaymentSimulation(bookingCode) {
    const statusText = document.getElementById('payment-status-text');
    const progressBar = document.getElementById('payment-progress-bar');
    const btnSimulate = document.getElementById('btn-simulate-pay');

    if (statusText) statusText.textContent = "Hệ thống đang quét tìm giao dịch chuyển khoản...";
    if (progressBar) {
        progressBar.style.width = "0%";
        progressBar.className = "status-progress-fill";
    }
    if (btnSimulate) {
        btnSimulate.disabled = false;
        btnSimulate.innerHTML = "⚡ Xác nhận đã chuyển khoản (Duyệt nhanh)";
        btnSimulate.className = "btn btn-primary btn-full btn-simulate-pay";
        btnSimulate.onclick = () => {
            completePaymentSuccess(bookingCode);
        };
    }

    let currentProgress = 0;
    if (window.paymentProgressInterval) clearInterval(window.paymentProgressInterval);
    if (window.paymentCheckTimeout) clearTimeout(window.paymentCheckTimeout);

    // Tiến trình quét (nhích từ 0% đến 90%)
    window.paymentProgressInterval = setInterval(() => {
        if (currentProgress < 90) {
            currentProgress += Math.random() * 12 + 5;
            if (currentProgress > 90) currentProgress = 90;
            if (progressBar) progressBar.style.width = `${currentProgress}%`;
        }
    }, 800);

    // Tự động nhận diện sau 8 - 10 giây (giống như webhook thật khớp lệnh ngân hàng)
    window.paymentCheckTimeout = setTimeout(() => {
        completePaymentSuccess(bookingCode);
    }, 9000);
}

function completePaymentSuccess(bookingCode) {
    if (window.paymentProgressInterval) clearInterval(window.paymentProgressInterval);
    if (window.paymentCheckTimeout) clearTimeout(window.paymentCheckTimeout);

    // Cập nhật trạng thái 'paid' trong LocalStorage để đồng bộ với doanh thu Admin
    const bookings = getBookings();
    let updated = false;
    bookings.forEach(b => {
        if (b.bookingCode === bookingCode) {
            b.status = 'paid';
            updated = true;
        }
    });
    if (updated) {
        saveBookings(bookings);
    }

    // Cập nhật giao diện Trạng thái
    const statusText = document.getElementById('payment-status-text');
    const progressBar = document.getElementById('payment-progress-bar');
    const btnSimulate = document.getElementById('btn-simulate-pay');

    if (statusText) statusText.innerHTML = "🎉 <strong>ĐÃ NHẬN THANH TOÁN THÀNH CÔNG! Lịch đặt đã được kích hoạt.</strong>";
    if (progressBar) {
        progressBar.style.width = "100%";
        progressBar.classList.add('success-bg');
    }
    if (btnSimulate) {
        btnSimulate.disabled = true;
        btnSimulate.textContent = "✓ Đã Thanh Toán";
        btnSimulate.className = "btn btn-success btn-full btn-simulate-pay success-btn";
        btnSimulate.onclick = null;
    }

    showToast('Nhận tiền thành công! Sân của bạn đã được khóa giữ chỗ. 🎉', 'success');
    triggerConfetti();
}

// Hiệu ứng pháo hoa chúc mừng thanh toán thành công
function triggerConfetti() {
    for (let i = 0; i < 35; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `-20px`;
        confetti.style.backgroundColor = ['#fa8c16', '#22c55e', '#3b82f6', '#fbbf24', '#ec4899'][Math.floor(Math.random() * 5)];
        confetti.style.width = `${Math.random() * 8 + 6}px`;
        confetti.style.height = `${Math.random() * 8 + 6}px`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.position = 'fixed';
        confetti.style.zIndex = '99999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);

        const duration = Math.random() * 2000 + 1500;
        const animation = confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(105vh) translateX(${Math.random() * 120 - 60}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

function closeSuccessModal() {
    closeModal('idb-success-modal');
    
    // Dừng tiến trình quét thanh toán
    if (window.paymentProgressInterval) clearInterval(window.paymentProgressInterval);
    if (window.paymentCheckTimeout) clearTimeout(window.paymentCheckTimeout);

    // Trả về mặc định
    selectedStartTime = null;
    isCaptchaChecked = false;
    
    const captchaBox = document.getElementById('captcha-box');
    if (captchaBox) {
        captchaBox.className = 'captcha-box';
        captchaBox.innerHTML = '';
    }

    // Reset inputs
    document.getElementById('customer-name-custom').value = '';
    document.getElementById('customer-phone-custom').value = '';
    document.getElementById('customer-email-custom').value = '';
    document.getElementById('customer-note-custom').value = '';

    renderAvailableSlots();
    updateStepActiveStates();
}

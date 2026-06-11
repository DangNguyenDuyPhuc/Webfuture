document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // STATE MANAGEMENT & LOCAL STORAGE
    // ==========================================================================
    let state = {
        activeDate: "",       // Format: "dd/mm/yyyy"
        activeCourt: null,    // Format: { id, type, price }
        selectedHours: [],    // Array of strings (e.g. ["17:00", "18:00"])
        addons: {
            racket: false,
            drink: false,
            pt: false
        },
        customer: {
            name: "",
            phone: "",
            notes: ""
        }
    };

    // Load existing bookings from LocalStorage, or load 3 realistic mock entries
    let bookings = JSON.parse(localStorage.getItem('smash_arena_bookings'));
    if (!bookings || bookings.length === 0) {
        const today = new Date();
        const dateStr = formatDate(today);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = formatDate(tomorrow);

        bookings = [
            {
                invoiceId: "BK-82914",
                name: "Nguyễn Minh Hoàng",
                phone: "0908123456",
                courtId: "2",
                courtType: "VIP",
                date: dateStr,
                hours: ["18:00", "19:00"],
                total: 280000,
                addons: ["Yonex Astrox Racket"],
                status: "paid"
            },
            {
                invoiceId: "BK-39182",
                name: "Trần Minh Tâm",
                phone: "0912999888",
                courtId: "4",
                courtType: "Premium",
                date: dateStr,
                hours: ["08:00", "09:00", "10:00"],
                total: 300000,
                addons: [],
                status: "paid"
            },
            {
                invoiceId: "BK-71049",
                name: "Phạm Khánh Linh",
                phone: "0987654321",
                courtId: "1",
                courtType: "VIP",
                date: tomorrowStr,
                hours: ["17:00", "18:00"],
                total: 580000,
                addons: ["Yonex Astrox Racket", "PT Coach Support"],
                status: "unpaid"
            }
        ];
        localStorage.setItem('smash_arena_bookings', JSON.stringify(bookings));
    }

    // Helper: Format Date to DD/MM/YYYY
    function formatDate(dateObj) {
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const yyyy = dateObj.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    // Generate Invoice ID
    function generateInvoiceId() {
        return "BK-" + Math.floor(10000 + Math.random() * 90000);
    }


    // ==========================================================================
    // TOAST NOTIFICATIONS SYSTEM
    // ==========================================================================
    const toastContainer = document.getElementById('toastContainer');
    
    function showToast(title, message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast-message glass-box ${type === 'error' ? 'toast-error' : type === 'info' ? 'toast-info' : ''}`;
        
        let iconName = 'check-circle';
        if (type === 'error') iconName = 'alert-triangle';
        else if (type === 'info') iconName = 'info';

        toast.innerHTML = `
            <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Animate in
        setTimeout(() => toast.classList.add('active'), 50);

        // Remove after 4s
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }


    // ==========================================================================
    // 1. DATE PICKER GENERATOR (HORIZONTAL DIAL)
    // ==========================================================================
    const datePickerContainer = document.getElementById('datePickerContainer');
    
    function initDatePicker() {
        if (!datePickerContainer) return;
        datePickerContainer.innerHTML = "";
        
        const daysOfWeekVi = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const tempDate = new Date(today);
            tempDate.setDate(today.getDate() + i);

            const dayIndex = tempDate.getDay();
            const dateNum = tempDate.getDate();
            const fullDateStr = formatDate(tempDate);
            const dayLabel = i === 0 ? "H.Nay" : daysOfWeekVi[dayIndex];

            const dateCard = document.createElement('div');
            dateCard.className = `date-card ${i === 0 ? 'active' : ''}`;
            dateCard.setAttribute('data-date', fullDateStr);
            dateCard.innerHTML = `
                <span class="day-lbl">${dayLabel}</span>
                <span class="date-num">${dateNum}</span>
            `;

            dateCard.addEventListener('click', () => {
                document.querySelectorAll('.date-card').forEach(c => c.classList.remove('active'));
                dateCard.classList.add('active');
                
                state.activeDate = fullDateStr;
                state.selectedHours = []; // Reset selected hours on date switch
                
                showToast("Đổi Ngày Chơi", `Đã xem lịch biểu đặt sân ngày ${fullDateStr}`, "info");
                
                renderTimeline();
                updateReceipt();
                syncCourtStatuses();
            });

            datePickerContainer.appendChild(dateCard);
            
            // Set initial date to today
            if (i === 0) {
                state.activeDate = fullDateStr;
            }
        }
    }


    // ==========================================================================
    // 2. ISOMETRIC SVG COURT MAP & SPECS BINDING
    // ==========================================================================
    const svgCourts = document.querySelectorAll('.svg-court-group');
    const courtSpecBox = document.getElementById('courtSpecBox');
    const specCourtName = document.getElementById('specCourtName');
    const specCourtDesc = document.getElementById('specCourtDesc');
    const specCourtPrice = document.getElementById('specCourtPrice');

    const courtDescriptions = {
        "1": {
            desc: "Sân Showcourt VIP tiêu chuẩn Yonex, đệm cao su 5.0mm giảm chấn tối đa. Phục vụ thi đấu chung kết.",
            detailsName: "Sân 1 - Đỉnh Cao Yonex Showcourt (VIP)"
        },
        "2": {
            desc: "Sân Showcourt VIP thảm Yonex dày dặn, chiếu sáng 1200 lumens chống lóa. Hệ thống điều hòa vách mát.",
            detailsName: "Sân 2 - Tiêu Chuẩn Yonex VIP"
        },
        "3": {
            desc: "Sân Standard thảm cao su Silicon bám sàn tốt, quạt công nghiệp làm mát. Phù hợp chơi phong trào.",
            detailsName: "Sân 3 - Cơ Bản Silicon (Standard)"
        },
        "4": {
            desc: "Sân Premium thảm 4 lớp bền bỉ, độ đàn hồi cao, quạt trần đối lưu gió. Phù hợp đấu đơn/đôi cường độ cao.",
            detailsName: "Sân 4 - Thảm Premium Yonex 4 Lớp"
        },
        "5": {
            desc: "Sân Standard thảm vân cát chống trơn trượt, đèn LED phân cực. Tiết kiệm chi phí luyện tập hàng ngày.",
            detailsName: "Sân 5 - Tiết Kiệm Silicon (Standard)"
        },
        "6": {
            desc: "Sân Premium thảm dày, hệ thống chiếu sáng LED thông minh cân bằng sáng. Thoải mái và chống mỏi cơ.",
            detailsName: "Sân 6 - Thảm Premium 4 Lớp Sáng"
        }
    };

    function selectCourt(courtElement) {
        if (courtElement.classList.contains('court-booked')) {
            showToast("Sân Đã Bận", "Sân đấu này đã được đặt trọn trong ngày. Vui lòng chọn sân khác hoặc đổi ngày chơi.", "error");
            return;
        }

        svgCourts.forEach(c => c.classList.remove('court-selected'));
        courtElement.classList.add('court-selected');

        const courtId = courtElement.getAttribute('data-court-id');
        const courtType = courtElement.getAttribute('data-court-type');
        const courtPrice = parseInt(courtElement.getAttribute('data-price'));

        state.activeCourt = {
            id: courtId,
            type: courtType,
            price: courtPrice
        };
        state.selectedHours = []; // Clear selected hours on court switch

        // Update Spec Card Below Map
        if (courtSpecBox) courtSpecBox.classList.add('highlighted');
        if (specCourtName) specCourtName.textContent = courtDescriptions[courtId].detailsName;
        if (specCourtDesc) specCourtDesc.textContent = courtDescriptions[courtId].desc;
        if (specCourtPrice) specCourtPrice.textContent = `${courtPrice.toLocaleString('vi-VN')}đ/h`;

        showToast("Chọn Sân Thành Công", `Đã chọn Sân ${courtId} (${courtType}). Vui lòng chọn giờ!`, "success");

        renderTimeline();
        updateReceipt();
    }

    svgCourts.forEach(court => {
        court.addEventListener('click', () => {
            selectCourt(court);
        });
    });

    // Auto-sync visual booked/free classes based on loaded reservations
    function syncCourtStatuses() {
        svgCourts.forEach(court => {
            const courtId = court.getAttribute('data-court-id');
            
            // Check if this court is fully booked (all hours 6-22 are booked on activeDate)
            const courtBookingsOnDate = bookings.filter(b => b.courtId === courtId && b.date === state.activeDate);
            let totalReservedHours = 0;
            courtBookingsOnDate.forEach(b => totalReservedHours += b.hours.length);
            
            // If total hours booked reaches 10 hours, mark fully booked
            if (totalReservedHours >= 12) {
                court.className.baseVal = "svg-court-group court-booked";
            } else {
                // If it was selected, preserve selection
                if (state.activeCourt && state.activeCourt.id === courtId) {
                    court.className.baseVal = "svg-court-group court-selected";
                } else {
                    court.className.baseVal = "svg-court-group court-free";
                }
            }
        });
    }


    // ==========================================================================
    // 3. TIMELINE HOURS GRID GENERATOR
    // ==========================================================================
    const timelineGrid = document.getElementById('timelineGrid');
    
    function renderTimeline() {
        if (!timelineGrid) return;
        timelineGrid.innerHTML = "";

        if (!state.activeCourt) {
            timelineGrid.innerHTML = `<div class="col-span-full text-center text-muted py-4">Vui lòng click chọn một Sân Đấu trên bản đồ 3D để hiển thị timeline giờ!</div>`;
            return;
        }

        // Get already reserved hours for this court on this date
        const takenHours = [];
        bookings.forEach(b => {
            if (b.courtId === state.activeCourt.id && b.date === state.activeDate) {
                b.hours.forEach(h => takenHours.push(h));
            }
        });

        // Loop hours 6:00 to 22:00
        for (let h = 6; h < 22; h++) {
            const startHour = String(h).padStart(2, '0') + ":00";
            const endHour = String(h + 1).padStart(2, '0') + ":00";
            const hourSlotStr = `${startHour}`;

            const isBooked = takenHours.includes(hourSlotStr);
            const isSelected = state.selectedHours.includes(hourSlotStr);
            // Peak Surcharges Hour Range: 17:00 to 21:00 (5PM - 9PM)
            const isPeak = h >= 17 && h < 21;

            const block = document.createElement('div');
            block.className = `hour-block ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`;
            block.innerHTML = `
                <span class="hour-lbl">${startHour} - ${endHour}</span>
                ${isPeak ? '<span class="peak-flame"><i data-lucide="flame"></i> Giờ Vàng</span>' : ''}
            `;

            if (!isBooked) {
                block.addEventListener('click', () => {
                    if (state.selectedHours.includes(hourSlotStr)) {
                        // De-select
                        state.selectedHours = state.selectedHours.filter(hr => hr !== hourSlotStr);
                        block.classList.remove('selected');
                    } else {
                        // Select
                        state.selectedHours.push(hourSlotStr);
                        block.classList.add('selected');
                    }
                    
                    // Sort hours chronologically
                    state.selectedHours.sort();
                    
                    updateReceipt();
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                });
            }

            timelineGrid.appendChild(block);
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }


    // ==========================================================================
    // 4. ADD-ON SERVICES & CALCULATOR SUMMARY
    // ==========================================================================
    const svcRacket = document.getElementById('svcRacket');
    const svcDrink = document.getElementById('svcDrink');
    const svcPT = document.getElementById('svcPT');
    
    // Receipt visual elements
    const receiptCourt = document.getElementById('receiptCourt');
    const receiptDate = document.getElementById('receiptDate');
    const receiptDuration = document.getElementById('receiptDuration');
    const receiptCourtCost = document.getElementById('receiptCourtCost');
    const receiptSvcCost = document.getElementById('receiptSvcCost');
    const receiptTotal = document.getElementById('receiptTotal');
    const receiptId = document.getElementById('receiptId');

    function getAddonPricing() {
        let totalSvc = 0;
        if (svcRacket && svcRacket.checked) totalSvc += 50000;
        if (svcDrink && svcDrink.checked) totalSvc += 20000;
        if (svcPT && svcPT.checked) {
            // PT is per hour!
            totalSvc += 150000 * state.selectedHours.length;
        }
        return totalSvc;
    }

    function updateReceipt() {
        if (!state.activeCourt) {
            if (receiptCourt) receiptCourt.textContent = "-";
            if (receiptDate) receiptDate.textContent = "-";
            if (receiptDuration) receiptDuration.textContent = "-";
            if (receiptCourtCost) receiptCourtCost.textContent = "0đ";
            if (receiptSvcCost) receiptSvcCost.textContent = "0đ";
            if (receiptTotal) receiptTotal.textContent = "0đ";
            return;
        }

        // 1. Calculate Base Court Cost with Peak surcharge (+20k/h during 17:00-21:00)
        let totalCourtCost = 0;
        state.selectedHours.forEach(hour => {
            const startH = parseInt(hour.split(":")[0]);
            let hourCost = state.activeCourt.price;
            if (startH >= 17 && startH < 21) {
                hourCost += 20000; // Peak surcharge
            }
            totalCourtCost += hourCost;
        });

        // 2. Sum Services cost
        const servicesCost = getAddonPricing();

        // 3. Sum grand total
        const grandTotal = totalCourtCost + servicesCost;

        // Render Values
        if (receiptCourt) receiptCourt.textContent = `Sân ${state.activeCourt.id} (${state.activeCourt.type})`;
        if (receiptDate) receiptDate.textContent = state.activeDate;
        if (receiptDuration) receiptDuration.textContent = `${state.selectedHours.length} giờ (${state.selectedHours.join(', ') || 'Chưa chọn giờ'})`;
        if (receiptCourtCost) receiptCourtCost.textContent = `${totalCourtCost.toLocaleString('vi-VN')}đ`;
        if (receiptSvcCost) receiptSvcCost.textContent = `${servicesCost.toLocaleString('vi-VN')}đ`;
        if (receiptTotal) receiptTotal.textContent = `${grandTotal.toLocaleString('vi-VN')}đ`;
    }

    // Checkbox dynamic change listeners
    [svcRacket, svcDrink, svcPT].forEach(check => {
        if (check) {
            check.addEventListener('change', () => {
                state.addons.racket = svcRacket.checked;
                state.addons.drink = svcDrink.checked;
                state.addons.pt = svcPT.checked;
                updateReceipt();
            });
        }
    });


    // ==========================================================================
    // 5. VIETQR MOCK CHECKOUT MODAL ENGINE
    // ==========================================================================
    const qrModal = document.getElementById('qrModal');
    const btnSubmitBooking = document.getElementById('btnSubmitBooking');
    const btnCloseQrModal = document.getElementById('btnCloseQrModal');
    const btnCancelBooking = document.getElementById('btnCancelBooking');
    const btnDonePayment = document.getElementById('btnDonePayment');
    
    // Modal Text Inputs
    const modalInvoiceId = document.getElementById('modalInvoiceId');
    const modalCustomerName = document.getElementById('modalCustomerName');
    const modalCustomerPhone = document.getElementById('modalCustomerPhone');
    const modalCourtName = document.getElementById('modalCourtName');
    const modalDate = document.getElementById('modalDate');
    const modalHours = document.getElementById('modalHours');
    const modalServices = document.getElementById('modalServices');
    const modalAmount = document.getElementById('modalAmount');
    const modalDescription = document.getElementById('modalDescription');
    const modalTimer = document.getElementById('modalTimer');

    let countdownTimerInterval = null;
    let pendingInvoiceId = "";

    function openQrCheckoutModal() {
        // Form validations first
        const custNameInput = document.getElementById('custName');
        const custPhoneInput = document.getElementById('custPhone');
        
        if (!state.activeCourt) {
            showToast("Lỗi đặt sân", "Vui lòng click chọn 1 sân đấu trên sơ đồ 3D trước!", "error");
            return;
        }
        if (state.selectedHours.length === 0) {
            showToast("Lỗi đặt sân", "Vui lòng chọn ít nhất một block khung giờ chơi!", "error");
            return;
        }
        if (!custNameInput || !custNameInput.value.trim()) {
            showToast("Lỗi nhập liệu", "Họ và tên khách hàng là bắt buộc!", "error");
            custNameInput.focus();
            return;
        }
        if (!custPhoneInput || !custPhoneInput.value.trim()) {
            showToast("Lỗi nhập liệu", "Số điện thoại liên lạc là bắt buộc!", "error");
            custPhoneInput.focus();
            return;
        }

        // Compile customer state data
        state.customer.name = custNameInput.value.trim();
        state.customer.phone = custPhoneInput.value.trim();
        state.customer.notes = document.getElementById('custNotes') ? document.getElementById('custNotes').value.trim() : "";

        // Set pending Invoice variables
        pendingInvoiceId = generateInvoiceId();
        
        // Sum total amount
        let totalCourtCost = 0;
        state.selectedHours.forEach(hour => {
            const startH = parseInt(hour.split(":")[0]);
            let hourCost = state.activeCourt.price;
            if (startH >= 17 && startH < 21) {
                hourCost += 20000;
            }
            totalCourtCost += hourCost;
        });
        const finalAmount = totalCourtCost + getAddonPricing();

        // Compile Services Text List
        const listAddons = [];
        if (state.addons.racket) listAddons.push("Thuê vợt Yonex Astrox");
        if (state.addons.drink) listAddons.push("Revive Bù khoáng");
        if (state.addons.pt) listAddons.push("PT Trọng tài hướng dẫn");
        const listAddonsText = listAddons.join(', ') || "Không có dịch vụ đính kèm";

        // Assign details inside Modal Elements
        if (modalInvoiceId) modalInvoiceId.textContent = `#${pendingInvoiceId}`;
        if (modalCustomerName) modalCustomerName.textContent = state.customer.name;
        if (modalCustomerPhone) modalCustomerPhone.textContent = state.customer.phone;
        if (modalCourtName) modalCourtName.textContent = `Sân ${state.activeCourt.id} (${state.activeCourt.type})`;
        if (modalDate) modalDate.textContent = state.activeDate;
        if (modalHours) modalHours.textContent = `${state.selectedHours.length} tiếng (${state.selectedHours.join(', ')})`;
        if (modalServices) modalServices.textContent = listAddonsText;
        if (modalAmount) modalAmount.textContent = `${finalAmount.toLocaleString('vi-VN')}đ`;
        if (modalDescription) modalDescription.textContent = `SMASHARENA ${pendingInvoiceId}`;

        // Save immediately as "unpaid" in localStorage to block slots and support lookup
        const unpaidBooking = {
            invoiceId: pendingInvoiceId,
            name: state.customer.name,
            phone: state.customer.phone,
            courtId: state.activeCourt.id,
            courtType: state.activeCourt.type,
            date: state.activeDate,
            hours: [...state.selectedHours],
            total: finalAmount,
            addons: listAddons,
            status: "unpaid"
        };
        bookings.push(unpaidBooking);
        localStorage.setItem('smash_arena_bookings', JSON.stringify(bookings));

        // Refresh layouts
        renderTimeline();
        updateReceipt();
        syncCourtStatuses();
        renderAdminDashboard();

        // Turn on Modal screen
        if (qrModal) qrModal.classList.add('active');
        
        // Start 10-minute visual countdown timer
        startCountdownTimer(600); // 10 minutes in seconds

        showToast("Tạo Mã QR Thành Công", "Cổng VietQR đã khởi tạo hóa đơn, vui lòng thanh toán!", "success");
    }

    // Open QR modal for an existing unpaid booking
    function openQrCheckoutModalForBooking(bk) {
        pendingInvoiceId = bk.invoiceId;
        
        // Assign details inside Modal Elements
        if (modalInvoiceId) modalInvoiceId.textContent = `#${bk.invoiceId}`;
        if (modalCustomerName) modalCustomerName.textContent = bk.name;
        if (modalCustomerPhone) modalCustomerPhone.textContent = bk.phone;
        if (modalCourtName) modalCourtName.textContent = `Sân ${bk.courtId} (${bk.courtType})`;
        if (modalDate) modalDate.textContent = bk.date;
        if (modalHours) modalHours.textContent = `${bk.hours.length} tiếng (${bk.hours.join(', ')})`;
        if (modalServices) modalServices.textContent = bk.addons.join(', ') || "Không có dịch vụ đính kèm";
        if (modalAmount) modalAmount.textContent = `${bk.total.toLocaleString('vi-VN')}đ`;
        if (modalDescription) modalDescription.textContent = `SMASHARENA ${bk.invoiceId}`;

        // Turn on Modal screen
        if (qrModal) qrModal.classList.add('active');
        
        // Start 10-minute visual countdown timer
        startCountdownTimer(600); // 10 minutes in seconds

        showToast("Tạo Mã QR Thành Công", "Cổng VietQR đã khởi tạo hóa đơn, vui lòng thanh toán!", "success");
    }

    function closeQrCheckoutModal() {
        if (qrModal) qrModal.classList.remove('active');
        if (countdownTimerInterval) clearInterval(countdownTimerInterval);
    }

    // Countdown Timer logic
    function startCountdownTimer(seconds) {
        if (countdownTimerInterval) clearInterval(countdownTimerInterval);
        
        let remaining = seconds;
        function updateTimerDisplay() {
            const min = Math.floor(remaining / 60);
            const sec = remaining % 60;
            if (modalTimer) {
                modalTimer.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
            }
        }
        
        updateTimerDisplay();

        countdownTimerInterval = setInterval(() => {
            remaining--;
            updateTimerDisplay();
            if (remaining <= 0) {
                clearInterval(countdownTimerInterval);
                
                // Remove the unpaid booking from list to release the blocked slots
                const idx = bookings.findIndex(b => b.invoiceId === pendingInvoiceId);
                if (idx !== -1 && bookings[idx].status === "unpaid") {
                    bookings.splice(idx, 1);
                    localStorage.setItem('smash_arena_bookings', JSON.stringify(bookings));
                }
                
                closeQrCheckoutModal();
                showToast("Mã QR Hết Hạn", "Thời gian giữ sân đã hết hạn, giao dịch tự động hủy bỏ.", "error");

                // Refresh layouts
                renderTimeline();
                updateReceipt();
                syncCourtStatuses();
                renderAdminDashboard();
            }
        }, 1000);
    }

    // Done and save booking into localStorage
    function finalizeBooking() {
        // Find the existing unpaid booking and set its status to paid
        let booking = bookings.find(b => b.invoiceId === pendingInvoiceId);
        if (booking) {
            booking.status = "paid";
        } else {
            // Fallback just in case
            const listAddons = [];
            if (state.addons.racket) listAddons.push("Thuê vợt Yonex Astrox");
            if (state.addons.drink) listAddons.push("Revive Bù khoáng");
            if (state.addons.pt) listAddons.push("PT Trọng tài hướng dẫn");

            let totalCourtCost = 0;
            state.selectedHours.forEach(hour => {
                const startH = parseInt(hour.split(":")[0]);
                let hourCost = state.activeCourt.price;
                if (startH >= 17 && startH < 21) {
                    hourCost += 20000;
                }
                totalCourtCost += hourCost;
            });
            const finalCost = totalCourtCost + getAddonPricing();

            booking = {
                invoiceId: pendingInvoiceId,
                name: state.customer.name,
                phone: state.customer.phone,
                courtId: state.activeCourt.id,
                courtType: state.activeCourt.type,
                date: state.activeDate,
                hours: [...state.selectedHours],
                total: finalCost,
                addons: listAddons,
                status: "paid"
            };
            bookings.push(booking);
        }

        localStorage.setItem('smash_arena_bookings', JSON.stringify(bookings));

        // Pop success and clear
        showToast("Đặt Lịch Thành Công!", `Hóa đơn ${pendingInvoiceId} đã được hệ thống ghi nhận. Hẹn gặp bạn tại SmashArena!`, "success");
        
        // Reset state & inputs
        resetBookingAppForm();
        closeQrCheckoutModal();

        // Refresh layouts
        renderTimeline();
        updateReceipt();
        syncCourtStatuses();
        renderAdminDashboard();
    }

    function resetBookingAppForm() {
        state.selectedHours = [];
        state.addons.racket = false;
        state.addons.drink = false;
        state.addons.pt = false;
        
        if (svcRacket) svcRacket.checked = false;
        if (svcDrink) svcDrink.checked = false;
        if (svcPT) svcPT.checked = false;
        
        const custNameInput = document.getElementById('custName');
        const custPhoneInput = document.getElementById('custPhone');
        const custNotesInput = document.getElementById('custNotes');
        
        if (custNameInput) custNameInput.value = "";
        if (custPhoneInput) custPhoneInput.value = "";
        if (custNotesInput) custNotesInput.value = "";
    }

    // Modal click listeners
    if (btnSubmitBooking) btnSubmitBooking.addEventListener('click', openQrCheckoutModal);
    if (btnCloseQrModal) btnCloseQrModal.addEventListener('click', closeQrCheckoutModal);
    
    if (btnCancelBooking) {
        btnCancelBooking.addEventListener('click', () => {
            // Remove the unpaid booking from database to release blocked slots
            const idx = bookings.findIndex(b => b.invoiceId === pendingInvoiceId);
            if (idx !== -1 && bookings[idx].status === "unpaid") {
                bookings.splice(idx, 1);
                localStorage.setItem('smash_arena_bookings', JSON.stringify(bookings));
            }
            closeQrCheckoutModal();
            showToast("Đã Hủy Giao Dịch", "Hóa đơn đã được hủy bỏ thành công theo yêu cầu.", "info");

            // Refresh layouts
            renderTimeline();
            updateReceipt();
            syncCourtStatuses();
            renderAdminDashboard();
        });
    }

    if (btnDonePayment) {
        btnDonePayment.addEventListener('click', () => {
            // Visual simulated loading state on button click
            btnDonePayment.disabled = true;
            btnDonePayment.innerHTML = `<span class="spinner"></span> Đang xác thực GD...`;
            
            setTimeout(() => {
                btnDonePayment.disabled = false;
                btnDonePayment.innerHTML = `TÔI ĐÃ CHUYỂN KHOẢN`;
                finalizeBooking();
            }, 1200);
        });
    }


    // ==========================================================================
    // 6. ADMIN AUTHORIZATION & ANALYTICS ENGINE
    // ==========================================================================
    const adminSection = document.getElementById('admin-panel');
    const btnAdminPanel = document.getElementById('btnAdminPanel');
    const btnMobileAdmin = document.getElementById('btnMobileAdmin');
    const adminTotalRevenue = document.getElementById('adminTotalRevenue');
    const adminTotalBookings = document.getElementById('adminTotalBookings');
    const adminOccupancyRate = document.getElementById('adminOccupancyRate');
    const adminHotCourt = document.getElementById('adminHotCourt');
    const adminBookingsTableBody = document.getElementById('adminBookingsTableBody');
    const btnAdminClearAll = document.getElementById('btnAdminClearAll');
    const btnAdminLogout = document.getElementById('btnAdminLogout');

    // Admin Modal Elements
    const adminLoginModal = document.getElementById('adminLoginModal');
    const btnCloseLoginModal = document.getElementById('btnCloseLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUser = document.getElementById('adminUser');
    const adminPass = document.getElementById('adminPass');

    // Check if Admin is logged in (session storage)
    function isAdminLoggedIn() {
        return sessionStorage.getItem('smash_admin_logged_in') === 'true';
    }

    function toggleAdminDashboard() {
        if (!adminSection) return;
        
        if (!isAdminLoggedIn()) {
            // Open Admin Login Modal
            if (adminLoginModal) {
                adminLoginModal.classList.add('active');
                if (adminUser) adminUser.focus();
                showToast("Yêu Cầu Đăng Nhập", "Vui lòng nhập tài khoản admin để truy cập quản trị.", "info");
            }
            return;
        }

        // Toggle admin-panel class active
        if (adminSection.classList.contains('active')) {
            adminSection.classList.remove('active');
            if (btnAdminPanel) btnAdminPanel.classList.remove('active');
            if (btnMobileAdmin) btnMobileAdmin.classList.remove('active');
            showToast("Hệ Thống Quản Trị", "Đã đóng Bảng quản trị viên.", "info");
        } else {
            adminSection.classList.add('active');
            if (btnAdminPanel) btnAdminPanel.classList.add('active');
            if (btnMobileAdmin) btnMobileAdmin.classList.add('active');
            
            // Scroll to admin dashboard
            setTimeout(() => {
                adminSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            
            renderAdminDashboard();
            showToast("Hệ Thống Quản Trị", "Đã mở Bảng phân tích kinh doanh.", "info");
        }
    }

    if (btnAdminPanel) btnAdminPanel.addEventListener('click', toggleAdminDashboard);
    if (btnMobileAdmin) btnMobileAdmin.addEventListener('click', toggleAdminDashboard);

    // Close Login Modal
    if (btnCloseLoginModal) {
        btnCloseLoginModal.addEventListener('click', () => {
            if (adminLoginModal) adminLoginModal.classList.remove('active');
        });
    }

    if (adminLoginModal) {
        adminLoginModal.addEventListener('click', (e) => {
            if (e.target === adminLoginModal) {
                adminLoginModal.classList.remove('active');
            }
        });
    }

    // SHA-256 hash function using Web Crypto API
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Pre-computed SHA-256 hashes (credentials are NOT stored as plaintext)
    // These hashes cannot be reversed back to the original credentials
    const ADMIN_USER_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // hash of username
    const ADMIN_PASS_HASH = '56126bc374c900be6ebaac98aa6046077a7d4c4e94950dc49d4f70d81f638b6b'; // hash of password

    // Submit Admin Login Form
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = adminUser.value.trim();
            const password = adminPass.value.trim();

            const userHash = await sha256(username);
            const passHash = await sha256(password);

            if (userHash === ADMIN_USER_HASH && passHash === ADMIN_PASS_HASH) {
                sessionStorage.setItem('smash_admin_logged_in', 'true');
                if (adminLoginModal) adminLoginModal.classList.remove('active');
                
                // Clear inputs
                adminUser.value = "";
                adminPass.value = "";

                // Show Admin Dashboard immediately
                adminSection.classList.add('active');
                if (btnAdminPanel) btnAdminPanel.classList.add('active');
                if (btnMobileAdmin) btnMobileAdmin.classList.add('active');
                
                setTimeout(() => {
                    adminSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);

                renderAdminDashboard();
                showToast("Đăng Nhập Thành Công", "Chào mừng Quản trị viên trở lại!", "success");
            } else {
                // Shake effect on form container
                const modalWindow = adminLoginModal.querySelector('.qr-window');
                if (modalWindow) {
                    modalWindow.style.animation = 'none';
                    // Trigger reflow
                    void modalWindow.offsetWidth;
                    modalWindow.style.animation = 'shakeModal 0.4s cubic-bezier(.36,.07,.19,.97) both';
                }
                showToast("Đăng Nhập Thất Bại", "Tài khoản hoặc mật khẩu không chính xác.", "error");
            }
        });
    }

    // Add CSS Keyframe for Shake Animation if it's not present
    if (!document.getElementById('shake-modal-style')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'shake-modal-style';
        styleSheet.innerText = `
            @keyframes shakeModal {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                40%, 60% { transform: translate3d(4px, 0, 0); }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // Logout Action
    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', () => {
            sessionStorage.removeItem('smash_admin_logged_in');
            if (adminSection) adminSection.classList.remove('active');
            if (btnAdminPanel) btnAdminPanel.classList.remove('active');
            if (btnMobileAdmin) btnMobileAdmin.classList.remove('active');
            
            // Scroll back to Home
            const homeSec = document.getElementById('home');
            if (homeSec) homeSec.scrollIntoView({ behavior: 'smooth' });
            
            showToast("Đăng Xuất", "Quản trị viên đã đăng xuất an toàn.", "info");
        });
    }

    function renderAdminDashboard() {
        if (!adminBookingsTableBody) return;
        adminBookingsTableBody.innerHTML = "";

        if (bookings.length === 0) {
            adminBookingsTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-5">Không có dữ liệu lịch đặt sân nào. Hãy tạo một lịch đặt sân phía trên!</td></tr>`;
            if (adminTotalRevenue) adminTotalRevenue.textContent = "0đ";
            if (adminTotalBookings) adminTotalBookings.textContent = "0";
            if (adminOccupancyRate) adminOccupancyRate.textContent = "0%";
            return;
        }

        let revenueTotal = 0;
        let activeBookingsCount = bookings.length;
        let courtBookingCounts = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 };
        let totalReservedHoursCount = 0;

        // Loop through all saved entries
        bookings.forEach((bk, index) => {
            revenueTotal += bk.total;
            totalReservedHoursCount += bk.hours.length;
            if (courtBookingCounts[bk.courtId] !== undefined) {
                courtBookingCounts[bk.courtId] += bk.hours.length;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="invoice-id">${bk.invoiceId}</td>
                <td class="font-bold">${bk.name}</td>
                <td>${bk.phone}</td>
                <td><span class="court-name-tag">Sân ${bk.courtId} (${bk.courtType})</span></td>
                <td>${bk.date}</td>
                <td class="font-mono">${bk.hours.join(', ')}</td>
                <td class="price-val highlight">${bk.total.toLocaleString('vi-VN')}đ</td>
                <td>
                    <span class="status-badge ${bk.status === 'paid' ? 'status-paid' : 'status-unpaid'}">
                        ${bk.status === 'paid' ? 'Đã Thanh Toán' : 'Chờ Chuyển Khoản'}
                    </span>
                </td>
                <td>
                    <button class="btn-delete-row" data-index="${index}" title="Xóa lịch đặt này">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            `;

            // Row delete listener
            tr.querySelector('.btn-delete-row').addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                const removed = bookings[idx];
                
                if (confirm(`Bạn có chắc chắn muốn hủy lịch đặt mã #${removed.invoiceId} của khách hàng ${removed.name}?`)) {
                    bookings.splice(idx, 1);
                    localStorage.setItem('smash_arena_bookings', JSON.stringify(bookings));
                    showToast("Xóa Thành Công", `Đã xóa lịch đặt #${removed.invoiceId}`, "info");
                    
                    renderAdminDashboard();
                    renderTimeline();
                    updateReceipt();
                    syncCourtStatuses();
                }
            });

            adminBookingsTableBody.appendChild(tr);
        });

        // Compute analytical widgets KPI metrics
        if (adminTotalRevenue) adminTotalRevenue.textContent = `${revenueTotal.toLocaleString('vi-VN')}đ`;
        if (adminTotalBookings) adminTotalBookings.textContent = activeBookingsCount;

        // 6 courts x 16 available hours per day = 96 maximum hour slots per day
        const maxDailyCapacity = 96;
        const ratePercent = Math.min(100, Math.round((totalReservedHoursCount / maxDailyCapacity) * 100));
        if (adminOccupancyRate) adminOccupancyRate.textContent = `${ratePercent}%`;

        // Determine hottest popular court in active entries
        let hottestCourtId = "1";
        let maxHrs = 0;
        for (const court in courtBookingCounts) {
            if (courtBookingCounts[court] > maxHrs) {
                maxHrs = courtBookingCounts[court];
                hottestCourtId = court;
            }
        }
        const courtTypesMap = { "1": "VIP", "2": "VIP", "3": "Standard", "4": "Premium", "5": "Standard", "6": "Premium" };
        if (adminHotCourt) adminHotCourt.textContent = `SÂN ${hottestCourtId} (${courtTypesMap[hottestCourtId]})`;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Clear all entries
    if (btnAdminClearAll) {
        btnAdminClearAll.addEventListener('click', () => {
            if (confirm("Cảnh báo! Bạn có chắc chắn muốn xóa toàn bộ danh sách lịch đặt sân trong cơ sở dữ liệu ảo không?")) {
                bookings = [];
                localStorage.setItem('smash_arena_bookings', JSON.stringify(bookings));
                showToast("Xóa Cơ Sở Dữ Liệu", "Đã xóa toàn bộ lịch đặt sân ảo.", "error");
                
                renderAdminDashboard();
                renderTimeline();
                updateReceipt();
                syncCourtStatuses();
            }
        });
    }

    // ==========================================================================
    // 6b. GUEST BOOKING LOOKUP SYSTEM
    // ==========================================================================
    const bookingLookupModal = document.getElementById('bookingLookupModal');
    const btnCloseLookupModal = document.getElementById('btnCloseLookupModal');
    const btnBookingLookup = document.getElementById('btnBookingLookup');
    const btnMobileLookup = document.getElementById('btnMobileLookup');
    const lookupPhoneInput = document.getElementById('lookupPhoneInput');
    const btnSearchLookup = document.getElementById('btnSearchLookup');
    const lookupResultsContainer = document.getElementById('lookupResultsContainer');

    function openBookingLookupModal() {
        if (bookingLookupModal) {
            bookingLookupModal.classList.add('active');
            if (lookupPhoneInput) {
                lookupPhoneInput.value = "";
                lookupPhoneInput.focus();
            }
            if (lookupResultsContainer) {
                lookupResultsContainer.innerHTML = `
                    <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
                        Vui lòng nhập số điện thoại để tra cứu
                    </div>
                `;
            }
        }
    }

    if (btnBookingLookup) btnBookingLookup.addEventListener('click', openBookingLookupModal);
    if (btnMobileLookup) btnMobileLookup.addEventListener('click', openBookingLookupModal);

    if (btnCloseLookupModal) {
        btnCloseLookupModal.addEventListener('click', () => {
            if (bookingLookupModal) bookingLookupModal.classList.remove('active');
        });
    }

    if (bookingLookupModal) {
        bookingLookupModal.addEventListener('click', (e) => {
            if (e.target === bookingLookupModal) {
                bookingLookupModal.classList.remove('active');
            }
        });
    }

    function executeLookup() {
        if (!lookupPhoneInput || !lookupResultsContainer) return;
        const phone = lookupPhoneInput.value.trim();

        if (!phone) {
            showToast("Lỗi Tra Cứu", "Vui lòng nhập số điện thoại cần tra cứu!", "error");
            lookupPhoneInput.focus();
            return;
        }

        // Search matches
        const matches = bookings.filter(b => b.phone === phone);

        if (matches.length === 0) {
            lookupResultsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 10px;">
                    <div style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-muted);">📭</div>
                    <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Không tìm thấy lịch đặt nào</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted); max-width: 320px; margin: 0 auto;">Không tìm thấy lịch đặt sân nào khớp với số điện thoại "${phone}". Hãy đặt sân để lưu trữ!</p>
                </div>
            `;
            return;
        }

        // Render results list
        lookupResultsContainer.innerHTML = "";
        
        matches.forEach((bk) => {
            const card = document.createElement('div');
            card.className = "glass-box";
            card.style.padding = "20px";
            card.style.marginBottom = "15px";
            card.style.border = "1px solid rgba(255, 255, 255, 0.05)";
            
            const isUnpaid = bk.status === "unpaid";
            const badgeClass = isUnpaid ? "status-unpaid" : "status-paid";
            const badgeText = isUnpaid ? "Chờ Chuyển Khoản" : "Đã Thanh Toán";
            const addonsText = bk.addons && bk.addons.length > 0 ? bk.addons.join(", ") : "Không dịch vụ đính kèm";

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; margin-bottom: 12px;">
                    <div>
                        <span class="invoice-id" style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-cyan); font-size: 0.95rem;">#${bk.invoiceId}</span>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Ngày chơi: <strong>${bk.date}</strong></div>
                    </div>
                    <span class="status-badge ${badgeClass}">${badgeText}</span>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted);">Sân thi đấu:</span>
                        <strong style="color: var(--text-primary);">Sân ${bk.courtId} (${bk.courtType})</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted);">Khung giờ đặt:</span>
                        <strong style="font-family: var(--font-mono); color: var(--text-primary);">${bk.hours.join(', ')} (${bk.hours.length} tiếng)</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted);">Dịch vụ phụ trợ:</span>
                        <span style="color: var(--text-muted); text-align: right; max-width: 250px;">${addonsText}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 8px; margin-top: 4px;">
                        <span style="color: var(--text-primary); font-weight: 700;">Tổng thanh toán:</span>
                        <strong style="font-family: var(--font-mono); color: var(--accent-green); font-size: 1.1rem; text-shadow: 0 0 10px rgba(57, 255, 20, 0.2);">${bk.total.toLocaleString('vi-VN')}đ</strong>
                    </div>
                </div>
                
                ${isUnpaid ? `
                    <button class="cyber-btn btn-primary w-100 btn-pay-now" data-invoice="${bk.invoiceId}" style="height: 38px; font-size: 0.8rem; background: var(--accent-cyan); color: #03040b;">
                        <span>THANH TOÁN NGAY VIA VIETQR</span>
                        <i data-lucide="qr-code"></i>
                    </button>
                ` : ''}
            `;

            // Action Pay Now
            if (isUnpaid) {
                card.querySelector('.btn-pay-now').addEventListener('click', () => {
                    // Close lookup modal
                    if (bookingLookupModal) bookingLookupModal.classList.remove('active');
                    
                    // Trigger QR payment checkout modal
                    openQrCheckoutModalForBooking(bk);
                });
            }

            lookupResultsContainer.appendChild(card);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (btnSearchLookup) btnSearchLookup.addEventListener('click', executeLookup);
    if (lookupPhoneInput) {
        lookupPhoneInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeLookup();
            }
        });
    }


    // ==========================================================================
    // 7. RESPONSIVE MOBILE DRAWER MENU
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('active');
            if (mobileDrawer.classList.contains('active')) {
                mobileDrawer.style.display = 'block';
                mobileMenuBtn.innerHTML = `<i data-lucide="x"></i>`;
            } else {
                mobileDrawer.style.display = 'none';
                mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        // Close drawer on clicking link items
        document.querySelectorAll('.drawer-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('active');
                mobileDrawer.style.display = 'none';
                mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });
    }


    // ==========================================================================
    // INITIAL APP LAUNCH SEQUENCE
    // ==========================================================================
    initDatePicker();
    
    // Auto select first standard court (Court 3) to start with details loaded
    const court3El = document.getElementById('court-3');
    if (court3El) {
        selectCourt(court3El);
    }
    
    syncCourtStatuses();
});

// ===== SubTracker — Hauptlogik =====

(function () {
    "use strict";

    // ----- State -----
    let subscriptions = [];
    let editingId = null;
    let settings = {
        theme: "light",
        currency: "EUR",
        reminderDays: 3,
        notificationsEnabled: false,
        onboardingDone: false,
        lang: "de",
    };

    // ----- DOM Elements -----
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const elApp = $("#app");
    const elOnboarding = $("#onboarding");
    const elOnboardingStart = $("#onboarding-start");
    const elMonthlyCost = $("#monthly-cost");
    const elYearlyCost = $("#yearly-cost");
    const elSubCount = $("#sub-count");
    const elNextRenewal = $("#next-renewal");
    const elNextRenewalText = $("#next-renewal-text");
    const elSubscriptions = $("#subscriptions");
    const elEmptyState = $("#empty-state");
    const elAddSubBtn = $("#add-sub-btn");
    const elModal = $("#modal");
    const elModalTitle = $("#modal-title");
    const elModalClose = $("#modal-close");
    const elModalCancel = $("#modal-cancel");
    const elSubForm = $("#sub-form");
    const elTemplates = $("#templates");
    const elTemplatesSection = $("#templates-section");
    const elThemeToggle = $("#theme-toggle");
    const elLangToggle = $("#lang-toggle");
    const elSettingsToggle = $("#settings-toggle");
    const elSettingsModal = $("#settings-modal");
    const elSettingsClose = $("#settings-close");
    const elExportBtn = $("#export-btn");
    const elImportBtn = $("#import-btn");
    const elNotificationToggle = $("#notification-toggle");
    const elReminderDays = $("#reminder-days");

    // Form fields
    const elSubName = $("#sub-name");
    const elSubPrice = $("#sub-price");
    const elSubCycle = $("#sub-cycle");
    const elSubCurrency = $("#sub-currency");
    const elSubDate = $("#sub-date");
    const elSubCategory = $("#sub-category");
    const elSubNotes = $("#sub-notes");

    // ----- LocalStorage -----
    function loadData() {
        try {
            const data = localStorage.getItem("subtracker_subs");
            if (data) subscriptions = JSON.parse(data);
            const s = localStorage.getItem("subtracker_settings");
            if (s) settings = { ...settings, ...JSON.parse(s) };
        } catch (e) {
            console.warn("Fehler beim Laden der Daten:", e);
        }
    }

    function saveData() {
        localStorage.setItem("subtracker_subs", JSON.stringify(subscriptions));
        localStorage.setItem("subtracker_settings", JSON.stringify(settings));
    }

    // ----- ID Generator -----
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    // ----- Currency Formatting -----
    function formatPrice(amount, currency) {
        const sym = CURRENCY_SYMBOLS[currency] || currency;
        return amount.toFixed(2) + " " + sym;
    }

    // ----- Monthly Cost Calculation -----
    function toMonthlyCost(price, cycle) {
        switch (cycle) {
            case "weekly": return price * 4.33;
            case "monthly": return price;
            case "quarterly": return price / 3;
            case "yearly": return price / 12;
            default: return price;
        }
    }

    // ----- Date Formatting -----
    function formatDate(dateStr) {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    function daysUntil(dateStr) {
        if (!dateStr) return Infinity;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);
        return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    }

    // ----- Render Dashboard -----
    function render() {
        renderSummary();
        renderNextRenewal();
        renderSubscriptions();
    }

    function renderSummary() {
        let totalMonthly = 0;
        subscriptions.forEach((sub) => {
            totalMonthly += toMonthlyCost(sub.price, sub.cycle);
        });
        const currency = subscriptions.length > 0 ? subscriptions[0].currency : settings.currency;
        elMonthlyCost.textContent = formatPrice(totalMonthly, currency);
        elYearlyCost.textContent = formatPrice(totalMonthly * 12, currency);
        elSubCount.textContent = subscriptions.length;
    }

    function renderNextRenewal() {
        const upcoming = subscriptions
            .filter((s) => s.nextDate)
            .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));

        if (upcoming.length > 0) {
            const next = upcoming[0];
            const days = daysUntil(next.nextDate);
            let text = `${next.name} — ${formatDate(next.nextDate)}`;
            if (days === 0) text += " (Heute!)";
            else if (days === 1) text += " (Morgen)";
            else if (days > 0) text += ` (in ${days} Tagen)`;
            else text += " (Überfällig)";
            elNextRenewalText.textContent = text;
            elNextRenewal.classList.remove("hidden");
        } else {
            elNextRenewal.classList.add("hidden");
        }
    }

    function renderSubscriptions() {
        // Remove old sub items (keep empty state)
        elSubscriptions.querySelectorAll(".sub-item").forEach((el) => el.remove());

        if (subscriptions.length === 0) {
            elEmptyState.classList.remove("hidden");
            return;
        }

        elEmptyState.classList.add("hidden");

        // Sort: soonest renewal first
        const sorted = [...subscriptions].sort((a, b) => {
            if (!a.nextDate) return 1;
            if (!b.nextDate) return -1;
            return new Date(a.nextDate) - new Date(b.nextDate);
        });

        sorted.forEach((sub) => {
            const el = createSubElement(sub);
            elSubscriptions.appendChild(el);
        });
    }

    function createSubElement(sub) {
        const div = document.createElement("div");
        div.className = "sub-item";
        div.dataset.id = sub.id;

        const icon = sub.icon || CATEGORY_ICONS[sub.category] || "📌";
        const catClass = "cat-" + sub.category;
        const cycleLbl = CYCLE_LABELS[sub.cycle] || sub.cycle;
        const renewalInfo = sub.nextDate ? formatDate(sub.nextDate) : "";

        div.innerHTML = `
            <div class="sub-icon ${catClass}">${icon}</div>
            <div class="sub-info">
                <div class="sub-name">${escapeHtml(sub.name)}</div>
                <div class="sub-meta">${cycleLbl}${renewalInfo ? " · " + renewalInfo : ""}</div>
            </div>
            <div>
                <span class="sub-price">${formatPrice(sub.price, sub.currency)}</span>
                <span class="sub-cycle-label">/ ${cycleLbl}</span>
            </div>
            <div class="sub-actions">
                <button class="edit-btn" title="Bearbeiten">✏️</button>
                <button class="delete-btn" title="Löschen">🗑️</button>
            </div>
        `;

        div.querySelector(".edit-btn").addEventListener("click", () => openEditModal(sub.id));
        div.querySelector(".delete-btn").addEventListener("click", () => deleteSub(sub.id));

        return div;
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    // ----- Modal -----
    function openAddModal() {
        editingId = null;
        elModalTitle.textContent = "Abo hinzufügen";
        elTemplatesSection.classList.remove("hidden");
        elSubForm.reset();
        elSubCurrency.value = settings.currency;
        elSubDate.value = "";
        elModal.classList.remove("hidden");
    }

    function openEditModal(id) {
        const sub = subscriptions.find((s) => s.id === id);
        if (!sub) return;

        editingId = id;
        elModalTitle.textContent = "Abo bearbeiten";
        elTemplatesSection.classList.add("hidden");

        elSubName.value = sub.name;
        elSubPrice.value = sub.price;
        elSubCycle.value = sub.cycle;
        elSubCurrency.value = sub.currency;
        elSubDate.value = sub.nextDate || "";
        elSubCategory.value = sub.category;
        elSubNotes.value = sub.notes || "";

        elModal.classList.remove("hidden");
    }

    function closeModal() {
        elModal.classList.add("hidden");
        editingId = null;
    }

    // ----- CRUD -----
    function saveSub(e) {
        e.preventDefault();

        const sub = {
            id: editingId || generateId(),
            name: elSubName.value.trim(),
            price: parseFloat(elSubPrice.value),
            cycle: elSubCycle.value,
            currency: elSubCurrency.value,
            nextDate: elSubDate.value || null,
            category: elSubCategory.value,
            notes: elSubNotes.value.trim(),
            icon: null,
        };

        // Check if template has icon
        const template = SUB_TEMPLATES.find(
            (t) => t.name.toLowerCase() === sub.name.toLowerCase()
        );
        if (template) sub.icon = template.icon;

        if (editingId) {
            const idx = subscriptions.findIndex((s) => s.id === editingId);
            if (idx !== -1) subscriptions[idx] = sub;
        } else {
            subscriptions.push(sub);
        }

        saveData();
        closeModal();
        render();
        checkReminders();
    }

    function deleteSub(id) {
        if (!confirm("Abo wirklich löschen?")) return;
        subscriptions = subscriptions.filter((s) => s.id !== id);
        saveData();
        render();
    }

    // ----- Templates -----
    function renderTemplates() {
        elTemplates.innerHTML = "";
        SUB_TEMPLATES.forEach((t) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "template-btn";
            btn.innerHTML = `<span>${t.icon}</span> ${t.name}`;
            btn.addEventListener("click", () => {
                elSubName.value = t.name;
                elSubPrice.value = t.price;
                elSubCycle.value = t.cycle;
                elSubCategory.value = t.category;
                elSubName.focus();
            });
            elTemplates.appendChild(btn);
        });
    }

    // ----- Theme -----
    function applyTheme() {
        document.documentElement.setAttribute("data-theme", settings.theme);
        elThemeToggle.textContent = settings.theme === "dark" ? "☀️" : "🌙";
    }

    function toggleTheme() {
        settings.theme = settings.theme === "dark" ? "light" : "dark";
        applyTheme();
        saveData();
    }

    // ----- Notifications / Reminders -----
    function checkReminders() {
        if (!settings.notificationsEnabled) return;
        if (!("Notification" in window)) return;

        subscriptions.forEach((sub) => {
            if (!sub.nextDate) return;
            const days = daysUntil(sub.nextDate);
            if (days >= 0 && days <= settings.reminderDays) {
                new Notification("SubTracker Erinnerung", {
                    body: `${sub.name} verlängert sich in ${days} Tag(en) für ${formatPrice(sub.price, sub.currency)}`,
                    icon: "img/favicon.svg",
                });
            }
        });
    }

    async function toggleNotifications() {
        if (!("Notification" in window)) {
            alert("Dein Browser unterstützt keine Benachrichtigungen.");
            return;
        }

        if (Notification.permission === "granted") {
            settings.notificationsEnabled = !settings.notificationsEnabled;
        } else if (Notification.permission !== "denied") {
            const perm = await Notification.requestPermission();
            settings.notificationsEnabled = perm === "granted";
        } else {
            alert("Benachrichtigungen wurden blockiert. Bitte in den Browser-Einstellungen aktivieren.");
            return;
        }

        updateNotificationButton();
        saveData();
    }

    function updateNotificationButton() {
        elNotificationToggle.textContent = settings.notificationsEnabled
            ? "Deaktivieren"
            : "Aktivieren";
    }

    // ----- Export / Import -----
    function exportData() {
        const data = {
            subscriptions,
            settings,
            exportDate: new Date().toISOString(),
            version: 1,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subtracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (ev) {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.subscriptions && Array.isArray(data.subscriptions)) {
                    if (confirm(`${data.subscriptions.length} Abos importieren? Aktuelle Daten werden ersetzt.`)) {
                        subscriptions = data.subscriptions;
                        if (data.settings) settings = { ...settings, ...data.settings };
                        saveData();
                        render();
                        applyTheme();
                        alert("Import erfolgreich!");
                    }
                } else {
                    alert("Ungültige Datei.");
                }
            } catch {
                alert("Fehler beim Lesen der Datei.");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    }

    // ----- Settings Modal -----
    function openSettings() {
        elSettingsModal.classList.remove("hidden");
        updateNotificationButton();
        elReminderDays.value = settings.reminderDays;
    }

    function closeSettings() {
        elSettingsModal.classList.add("hidden");
    }

    // ----- Onboarding -----
    function checkOnboarding() {
        if (!settings.onboardingDone) {
            elOnboarding.classList.remove("hidden");
        }
    }

    function finishOnboarding() {
        settings.onboardingDone = true;
        elOnboarding.classList.add("hidden");
        saveData();
    }

    // ----- Event Listeners -----
    function bindEvents() {
        elAddSubBtn.addEventListener("click", openAddModal);
        elModalClose.addEventListener("click", closeModal);
        elModalCancel.addEventListener("click", closeModal);
        elSubForm.addEventListener("submit", saveSub);
        elThemeToggle.addEventListener("click", toggleTheme);
        elSettingsToggle.addEventListener("click", openSettings);
        elSettingsClose.addEventListener("click", closeSettings);
        elExportBtn.addEventListener("click", exportData);
        elImportBtn.addEventListener("click", importData);
        elNotificationToggle.addEventListener("click", toggleNotifications);
        elOnboardingStart.addEventListener("click", finishOnboarding);

        elReminderDays.addEventListener("change", () => {
            settings.reminderDays = parseInt(elReminderDays.value);
            saveData();
        });

        // Close modals on overlay click
        $$(".modal-overlay").forEach((overlay) => {
            overlay.addEventListener("click", () => {
                closeModal();
                closeSettings();
            });
        });

        // Keyboard: Escape closes modals
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeModal();
                closeSettings();
            }
        });
    }

    // ----- Auto-detect theme -----
    function detectTheme() {
        if (localStorage.getItem("subtracker_settings")) return;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            settings.theme = "dark";
        }
    }

    // ----- Init -----
    function init() {
        detectTheme();
        loadData();
        applyTheme();
        renderTemplates();
        render();
        checkOnboarding();
        bindEvents();
        checkReminders();
    }

    init();
})();

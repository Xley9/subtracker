// ===== SubTracker — Hauptlogik =====

(function () {
    "use strict";

    // ----- State -----
    let subscriptions = [];
    let editingId = null;
    let searchQuery = "";
    let settings = {
        theme: "auto",
        currency: "EUR",
        reminderDays: 3,
        notificationsEnabled: false,
        onboardingDone: false,
        lang: "de",
    };

    // ----- DOM Elements -----
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

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
    const elTemplateSearch = $("#template-search");
    const elThemeToggle = $("#theme-toggle");
    const elLangToggle = $("#lang-toggle");
    const elSettingsToggle = $("#settings-toggle");
    const elSettingsModal = $("#settings-modal");
    const elSettingsClose = $("#settings-close");
    const elExportBtn = $("#export-btn");
    const elImportBtn = $("#import-btn");
    const elNotificationToggle = $("#notification-toggle");
    const elReminderDays = $("#reminder-days");
    const elSearchInput = $("#search-input");
    const elLangPicker = $("#lang-picker");

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
            console.warn("Error loading data:", e);
        }
    }

    function saveData() {
        localStorage.setItem("subtracker_subs", JSON.stringify(subscriptions));
        localStorage.setItem("subtracker_settings", JSON.stringify(settings));
    }

    // ----- i18n -----
    function setLanguage(lang) {
        settings.lang = lang;
        window._currentLang = lang;
        document.documentElement.lang = lang;
        applyTranslations();
        render();
        saveData();
        renderLangPicker();
    }

    function applyTranslations() {
        // Text content
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            const val = t(key);
            if (val) el.textContent = val;
        });

        // HTML content
        document.querySelectorAll("[data-i18n-html]").forEach((el) => {
            const key = el.getAttribute("data-i18n-html");
            const val = t(key);
            if (val) el.innerHTML = val;
        });

        // Placeholders
        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            const val = t(key);
            if (val) el.placeholder = val;
        });
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

    // ----- Cycle Label -----
    function getCycleLabel(cycle) {
        const key = cycle === "monthly" ? "monthly_cycle" : cycle === "yearly" ? "yearly_cycle" : cycle;
        return t(key) || cycle;
    }

    // ----- Date Formatting -----
    function formatDate(dateStr) {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const locale = settings.lang === "en" ? "en-US" : settings.lang === "tr" ? "tr-TR" : settings.lang === "es" ? "es-ES" : settings.lang === "fr" ? "fr-FR" : "de-DE";
        return d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
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
            if (days === 0) text += ` (${t("today")})`;
            else if (days === 1) text += ` (${t("tomorrow")})`;
            else if (days > 0) text += ` (${t("inDays").replace("{n}", days)})`;
            else text += ` (${t("overdue")})`;
            elNextRenewalText.textContent = text;
            elNextRenewal.classList.remove("hidden");
        } else {
            elNextRenewal.classList.add("hidden");
        }
    }

    function renderSubscriptions() {
        elSubscriptions.querySelectorAll(".sub-item").forEach((el) => el.remove());

        const filtered = subscriptions.filter((sub) => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return sub.name.toLowerCase().includes(q) ||
                   (sub.notes && sub.notes.toLowerCase().includes(q)) ||
                   sub.category.toLowerCase().includes(q);
        });

        if (subscriptions.length === 0) {
            elEmptyState.classList.remove("hidden");
            return;
        }

        elEmptyState.classList.add("hidden");

        if (filtered.length === 0) {
            const noResults = document.createElement("div");
            noResults.className = "empty-state sub-item-no-results";
            noResults.innerHTML = `<p style="color: var(--text-secondary); text-align: center; width: 100%; padding: 24px;">🔍 ${searchQuery}...</p>`;
            elSubscriptions.appendChild(noResults);
            return;
        }

        const sorted = [...filtered].sort((a, b) => {
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
        const cycleLbl = getCycleLabel(sub.cycle);
        const renewalInfo = sub.nextDate ? formatDate(sub.nextDate) : "";

        div.innerHTML = `
            <div class="sub-icon ${catClass}">${icon}</div>
            <div class="sub-info">
                <div class="sub-name">${escapeHtml(sub.name)}</div>
                <div class="sub-meta">${cycleLbl}${renewalInfo ? " · " + renewalInfo : ""}</div>
            </div>
            <div class="sub-price-wrapper">
                <span class="sub-price">${formatPrice(sub.price, sub.currency)}</span>
                <span class="sub-cycle-label">/ ${cycleLbl}</span>
            </div>
            <div class="sub-actions">
                <button class="edit-btn" title="${t("edit")}">✏️</button>
                <button class="delete-btn" title="${t("delete")}">🗑️</button>
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
        elModalTitle.textContent = t("addSubTitle");
        elTemplatesSection.classList.remove("hidden");
        elSubForm.reset();
        elSubCurrency.value = settings.currency;
        elSubDate.value = "";
        elTemplateSearch.value = "";
        renderTemplates();
        elModal.classList.remove("hidden");
    }

    function openEditModal(id) {
        const sub = subscriptions.find((s) => s.id === id);
        if (!sub) return;

        editingId = id;
        elModalTitle.textContent = t("editSubTitle");
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

        const template = SUB_TEMPLATES.find(
            (tmpl) => tmpl.name.toLowerCase() === sub.name.toLowerCase()
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
        if (!confirm(t("confirmDelete"))) return;
        subscriptions = subscriptions.filter((s) => s.id !== id);
        saveData();
        render();
    }

    // ----- Templates -----
    function renderTemplates(filter) {
        elTemplates.innerHTML = "";
        const q = (filter || "").toLowerCase();
        const filtered = q
            ? SUB_TEMPLATES.filter((tmpl) => tmpl.name.toLowerCase().includes(q))
            : SUB_TEMPLATES;

        filtered.forEach((tmpl) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "template-btn";
            btn.innerHTML = `<span>${tmpl.icon}</span> ${tmpl.name}`;
            btn.addEventListener("click", () => {
                elSubName.value = tmpl.name;
                elSubPrice.value = tmpl.price;
                elSubCycle.value = tmpl.cycle;
                elSubCategory.value = tmpl.category;
                elSubPrice.focus();
            });
            elTemplates.appendChild(btn);
        });
    }

    // ----- Theme -----
    function getEffectiveTheme() {
        if (settings.theme === "auto") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return settings.theme;
    }

    function applyTheme() {
        const effective = getEffectiveTheme();
        document.documentElement.setAttribute("data-theme", effective);
        elThemeToggle.textContent = effective === "dark" ? "☀️" : "🌙";
    }

    function toggleTheme() {
        const current = getEffectiveTheme();
        settings.theme = current === "dark" ? "light" : "dark";
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
                new Notification("SubTracker", {
                    body: t("reminderBody")
                        .replace("{name}", sub.name)
                        .replace("{days}", days)
                        .replace("{price}", formatPrice(sub.price, sub.currency)),
                    icon: "img/favicon.svg",
                });
            }
        });
    }

    async function toggleNotifications() {
        if (!("Notification" in window)) {
            alert(t("noNotifications"));
            return;
        }

        if (Notification.permission === "granted") {
            settings.notificationsEnabled = !settings.notificationsEnabled;
        } else if (Notification.permission !== "denied") {
            const perm = await Notification.requestPermission();
            settings.notificationsEnabled = perm === "granted";
        } else {
            alert(t("notificationsBlocked"));
            return;
        }

        updateNotificationButton();
        saveData();
    }

    function updateNotificationButton() {
        elNotificationToggle.textContent = settings.notificationsEnabled
            ? t("disable")
            : t("enable");
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
                    if (confirm(t("confirmImport").replace("{n}", data.subscriptions.length))) {
                        subscriptions = data.subscriptions;
                        if (data.settings) settings = { ...settings, ...data.settings };
                        saveData();
                        setLanguage(settings.lang);
                        render();
                        applyTheme();
                        alert(t("importSuccess"));
                    }
                } else {
                    alert(t("invalidFile"));
                }
            } catch {
                alert(t("fileError"));
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
        renderLangPicker();
    }

    function closeSettings() {
        elSettingsModal.classList.add("hidden");
    }

    // ----- Language Picker -----
    function renderLangPicker() {
        elLangPicker.innerHTML = "";
        getAvailableLanguages().forEach((lang) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "lang-btn" + (settings.lang === lang.code ? " active" : "");
            btn.innerHTML = `<span>${lang.flag}</span> ${lang.name}`;
            btn.addEventListener("click", () => setLanguage(lang.code));
            elLangPicker.appendChild(btn);
        });
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

    // ----- Search -----
    function handleSearch() {
        searchQuery = elSearchInput.value.trim();
        renderSubscriptions();
    }

    // ----- Event Listeners -----
    function bindEvents() {
        elAddSubBtn.addEventListener("click", openAddModal);
        elModalClose.addEventListener("click", closeModal);
        elModalCancel.addEventListener("click", closeModal);
        elSubForm.addEventListener("submit", saveSub);
        elThemeToggle.addEventListener("click", toggleTheme);
        elLangToggle.addEventListener("click", openSettings);
        elSettingsToggle.addEventListener("click", openSettings);
        elSettingsClose.addEventListener("click", closeSettings);
        elExportBtn.addEventListener("click", exportData);
        elImportBtn.addEventListener("click", importData);
        elNotificationToggle.addEventListener("click", toggleNotifications);
        elOnboardingStart.addEventListener("click", finishOnboarding);
        elSearchInput.addEventListener("input", handleSearch);

        elTemplateSearch.addEventListener("input", () => {
            renderTemplates(elTemplateSearch.value);
        });

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

        // Listen for system theme changes
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
            if (settings.theme === "auto") applyTheme();
        });
    }

    // ----- Init -----
    function init() {
        loadData();
        window._currentLang = settings.lang;
        applyTheme();
        applyTranslations();
        renderTemplates();
        render();
        checkOnboarding();
        bindEvents();
        checkReminders();
    }

    init();
})();

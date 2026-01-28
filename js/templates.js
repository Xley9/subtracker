// Vorgefertigte Abo-Vorlagen mit Name, Standardpreis, Kategorie und Icon
const SUB_TEMPLATES = [
    { name: "Netflix", price: 12.99, cycle: "monthly", category: "streaming", icon: "🎬" },
    { name: "Spotify", price: 9.99, cycle: "monthly", category: "music", icon: "🎵" },
    { name: "Amazon Prime", price: 8.99, cycle: "monthly", category: "streaming", icon: "📦" },
    { name: "Disney+", price: 8.99, cycle: "monthly", category: "streaming", icon: "🏰" },
    { name: "YouTube Premium", price: 11.99, cycle: "monthly", category: "streaming", icon: "▶️" },
    { name: "Apple Music", price: 10.99, cycle: "monthly", category: "music", icon: "🍎" },
    { name: "Adobe Creative Cloud", price: 61.95, cycle: "monthly", category: "software", icon: "🎨" },
    { name: "Microsoft 365", price: 69.00, cycle: "yearly", category: "software", icon: "💼" },
    { name: "ChatGPT Plus", price: 20.00, cycle: "monthly", category: "software", icon: "🤖" },
    { name: "iCloud+", price: 2.99, cycle: "monthly", category: "cloud", icon: "☁️" },
    { name: "Google One", price: 1.99, cycle: "monthly", category: "cloud", icon: "🔵" },
    { name: "Dropbox", price: 11.99, cycle: "monthly", category: "cloud", icon: "📁" },
    { name: "Xbox Game Pass", price: 14.99, cycle: "monthly", category: "gaming", icon: "🎮" },
    { name: "PlayStation Plus", price: 8.99, cycle: "monthly", category: "gaming", icon: "🕹️" },
    { name: "Nintendo Online", price: 19.99, cycle: "yearly", category: "gaming", icon: "🍄" },
    { name: "Fitnessstudio", price: 29.99, cycle: "monthly", category: "fitness", icon: "💪" },
    { name: "Zeitung/Magazin", price: 9.99, cycle: "monthly", category: "news", icon: "📰" },
    { name: "Crunchyroll", price: 6.99, cycle: "monthly", category: "streaming", icon: "🎌" },
    { name: "DAZN", price: 34.99, cycle: "monthly", category: "streaming", icon: "⚽" },
    { name: "Audible", price: 9.95, cycle: "monthly", category: "streaming", icon: "📚" },
];

// Kategorie-Icons für die Abo-Liste
const CATEGORY_ICONS = {
    streaming: "🎬",
    music: "🎵",
    software: "💻",
    gaming: "🎮",
    fitness: "💪",
    news: "📰",
    cloud: "☁️",
    other: "📌",
};

// Zyklus-Labels
const CYCLE_LABELS = {
    weekly: "Wöchentlich",
    monthly: "Monatlich",
    quarterly: "Vierteljährlich",
    yearly: "Jährlich",
};

// Währungssymbole
const CURRENCY_SYMBOLS = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    TRY: "₺",
    CHF: "CHF",
};

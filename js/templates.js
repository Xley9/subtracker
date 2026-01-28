// ===== SubTracker — Abo-Vorlagen & Konstanten =====

const SUB_TEMPLATES = [
    // Streaming
    { name: "Netflix", price: 12.99, cycle: "monthly", category: "streaming", icon: "🎬" },
    { name: "Disney+", price: 8.99, cycle: "monthly", category: "streaming", icon: "🏰" },
    { name: "Amazon Prime", price: 8.99, cycle: "monthly", category: "streaming", icon: "📦" },
    { name: "YouTube Premium", price: 11.99, cycle: "monthly", category: "streaming", icon: "▶️" },
    { name: "HBO Max", price: 9.99, cycle: "monthly", category: "streaming", icon: "🎭" },
    { name: "Apple TV+", price: 6.99, cycle: "monthly", category: "streaming", icon: "📺" },
    { name: "Paramount+", price: 7.99, cycle: "monthly", category: "streaming", icon: "⭐" },
    { name: "Crunchyroll", price: 6.99, cycle: "monthly", category: "streaming", icon: "🎌" },
    { name: "DAZN", price: 34.99, cycle: "monthly", category: "streaming", icon: "⚽" },
    { name: "Audible", price: 9.95, cycle: "monthly", category: "streaming", icon: "📚" },
    { name: "Hulu", price: 7.99, cycle: "monthly", category: "streaming", icon: "🟢" },
    { name: "Peacock", price: 5.99, cycle: "monthly", category: "streaming", icon: "🦚" },
    { name: "RTL+", price: 6.99, cycle: "monthly", category: "streaming", icon: "📡" },
    { name: "WOW (Sky)", price: 9.99, cycle: "monthly", category: "streaming", icon: "🌤️" },

    // Musik
    { name: "Spotify", price: 9.99, cycle: "monthly", category: "music", icon: "🎵" },
    { name: "Apple Music", price: 10.99, cycle: "monthly", category: "music", icon: "🍎" },
    { name: "Amazon Music", price: 8.99, cycle: "monthly", category: "music", icon: "🎧" },
    { name: "Tidal", price: 10.99, cycle: "monthly", category: "music", icon: "🌊" },
    { name: "Deezer", price: 9.99, cycle: "monthly", category: "music", icon: "🎶" },
    { name: "SoundCloud Go", price: 5.99, cycle: "monthly", category: "music", icon: "🔊" },

    // Software
    { name: "Adobe Creative Cloud", price: 61.95, cycle: "monthly", category: "software", icon: "🎨" },
    { name: "Microsoft 365", price: 69.00, cycle: "yearly", category: "software", icon: "💼" },
    { name: "ChatGPT Plus", price: 20.00, cycle: "monthly", category: "software", icon: "🤖" },
    { name: "Claude Pro", price: 20.00, cycle: "monthly", category: "software", icon: "🧠" },
    { name: "Notion", price: 8.00, cycle: "monthly", category: "software", icon: "📝" },
    { name: "Canva Pro", price: 11.99, cycle: "monthly", category: "software", icon: "🖌️" },
    { name: "1Password", price: 2.99, cycle: "monthly", category: "software", icon: "🔐" },
    { name: "NordVPN", price: 3.99, cycle: "monthly", category: "software", icon: "🛡️" },
    { name: "ExpressVPN", price: 8.32, cycle: "monthly", category: "software", icon: "🔒" },
    { name: "Grammarly", price: 12.00, cycle: "monthly", category: "software", icon: "✍️" },
    { name: "GitHub Pro", price: 4.00, cycle: "monthly", category: "software", icon: "💻" },
    { name: "JetBrains", price: 24.90, cycle: "monthly", category: "software", icon: "⚙️" },

    // Cloud & Speicher
    { name: "iCloud+", price: 2.99, cycle: "monthly", category: "cloud", icon: "☁️" },
    { name: "Google One", price: 1.99, cycle: "monthly", category: "cloud", icon: "🔵" },
    { name: "Dropbox Plus", price: 11.99, cycle: "monthly", category: "cloud", icon: "📁" },
    { name: "OneDrive", price: 2.00, cycle: "monthly", category: "cloud", icon: "🌐" },

    // Gaming
    { name: "Xbox Game Pass", price: 14.99, cycle: "monthly", category: "gaming", icon: "🎮" },
    { name: "PlayStation Plus", price: 8.99, cycle: "monthly", category: "gaming", icon: "🕹️" },
    { name: "Nintendo Online", price: 19.99, cycle: "yearly", category: "gaming", icon: "🍄" },
    { name: "EA Play", price: 3.99, cycle: "monthly", category: "gaming", icon: "🏈" },
    { name: "GeForce NOW", price: 9.99, cycle: "monthly", category: "gaming", icon: "🖥️" },

    // Fitness
    { name: "Fitnessstudio", price: 29.99, cycle: "monthly", category: "fitness", icon: "💪" },
    { name: "Peloton", price: 12.99, cycle: "monthly", category: "fitness", icon: "🚴" },
    { name: "Strava", price: 5.00, cycle: "monthly", category: "fitness", icon: "🏃" },
    { name: "Freeletics", price: 7.49, cycle: "monthly", category: "fitness", icon: "🏋️" },

    // Nachrichten & Bildung
    { name: "Zeitung/Magazin", price: 9.99, cycle: "monthly", category: "news", icon: "📰" },
    { name: "The New York Times", price: 4.25, cycle: "monthly", category: "news", icon: "🗞️" },
    { name: "Bild+", price: 7.99, cycle: "monthly", category: "news", icon: "📱" },
    { name: "Spiegel+", price: 4.99, cycle: "monthly", category: "news", icon: "🔍" },
    { name: "Duolingo Plus", price: 6.99, cycle: "monthly", category: "education", icon: "🦉" },
    { name: "Skillshare", price: 13.99, cycle: "monthly", category: "education", icon: "🎓" },
    { name: "Coursera Plus", price: 49.00, cycle: "monthly", category: "education", icon: "📖" },
    { name: "LinkedIn Premium", price: 29.99, cycle: "monthly", category: "education", icon: "💼" },

    // Essen & Lieferung
    { name: "Lieferando Plus", price: 4.99, cycle: "monthly", category: "food", icon: "🍕" },
    { name: "Uber One", price: 9.99, cycle: "monthly", category: "food", icon: "🚗" },
    { name: "HelloFresh", price: 49.99, cycle: "monthly", category: "food", icon: "🥗" },
    { name: "Too Good To Go", price: 0, cycle: "monthly", category: "food", icon: "🌱" },
];

// Kategorie-Icons
const CATEGORY_ICONS = {
    streaming: "🎬",
    music: "🎵",
    software: "💻",
    gaming: "🎮",
    fitness: "💪",
    news: "📰",
    cloud: "☁️",
    education: "🎓",
    food: "🍕",
    other: "📌",
};

// Währungssymbole
const CURRENCY_SYMBOLS = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    TRY: "₺",
    CHF: "CHF",
    JPY: "¥",
    PLN: "zł",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    CAD: "C$",
    AUD: "A$",
};

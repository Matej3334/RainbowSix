// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const btns = document.getElementsByClassName("language-btn");
    for (const btn of btns){
        btn.addEventListener("click", switchLanguage);
    }
});

const translations = {
    "en": {
        "map-title": "MAP:",
        "reports-title": "REPORTS PANEL:",
        "send-report-btn": "SEND REPORT",
        "send-report-title": "SEND REPORT:",
        "trafficjam-btn": "Traffic Jam",
        "roadwork-btn": "Road Work Ahead",
        "obstacle-btn": "Obstacle On The Road",
        "roadclosed-btn": "Road Closed",
        "police-btn": "Police Control",
        "success-alert": "[+] SIGNAL HAS BEEN SENT SUCCESSFULLY!",
        "info-alert": "[...] Sending Signal...",
        "fail-alert": "[-] ERROR",
        "main-err-alert": "[-] Please Allow Geolocation Access!",
        "proximity-error": "[-] A Signal Of The Specified Type Already Exists In Your Proximity",
        "geolocation-error": "[-] Please Allow Geolocation Access!",
        "location-error": "[-] Cannot Get Current Location!"
    },
    "de": {
        "map-title": "KARTE:",
        "reports-title": "BERICHTE-PANEL:",
        "send-report-btn": "BERICHT SENDEN",
        "send-report-title": "BERICHT SENDEN:",
        "trafficjam-btn": "Stau",
        "roadwork-btn": "Baustelle Voraus",
        "obstacle-btn": "Hindernis Auf Der Straße",
        "roadclosed-btn": "Straße Gesperrt",
        "police-btn": "Polizeikontrolle",
        "success-alert": "[+] SIGNAL ERFOLGREICH GESENDET!",
        "info-alert": "[...] Signal wird gesendet...",
        "fail-alert": "[-] FEHLER",
        "main-err-alert": "[-] Bitte Erlauben Sie Den Standortzugriff!",
        "proximity-error": "[-] Ein Signal Dieses Typs Existiert Bereits In Ihrer Nähe",
        "geolocation-error": "[-] Bitte Erlauben Sie Den Standortzugriff!",
        "location-error": "[-] Aktueller Standort Kann Nicht Abgerufen Werden!"
    },
    "sl": {
        "map-title": "ZEMLJEVID:",
        "reports-title": "PRIKAZ POROČILL:",
        "send-report-btn": "POŠLJI POROČILO",
        "send-report-title": "POŠLJI POROČILO:",
        "trafficjam-btn": "Prometni Zamašek",
        "roadwork-btn": "Cestna Dela Naprej",
        "obstacle-btn": "Ovira Na Cesti",
        "roadclosed-btn": "Cesta Zaprta",
        "police-btn": "Policijski Nadzor",
        "success-alert": "[+] SIGNAL JE BIL USPEŠNO POSLAN!",
        "info-alert": "[...] Pošiljanje signala...",
        "fail-alert": "[-] NAPAKA",
        "main-err-alert": "[-] Prosimo, Dovolite Dostop Do Lokacije!",
        "proximity-error": "[-] Signal Te Vrste Že Obstaja V Vaši Bližini",
        "geolocation-error": "[-] Prosimo, Dovolite Dostop Do Lokacije!",
        "location-error": "[-] Trenutne Lokacije Ni Mogoče Pridobiti!"
    },
    "zh-CN": {
        "map-title": "地图:",
        "reports-title": "报告面板:",
        "send-report-btn": "发送报告",
        "send-report-title": "发送报告:",
        "trafficjam-btn": "交通堵塞",
        "roadwork-btn": "前方道路施工",
        "obstacle-btn": "道路上有障碍物",
        "roadclosed-btn": "道路封闭",
        "police-btn": "警察检查",
        "success-alert": "[+] 信号发送成功!",
        "info-alert": "[...] 正在发送信号...",
        "fail-alert": "[-] 错误",
        "main-err-alert": "[-] 请允许地理位置访问!",
        "proximity-error": "[-] 附近已存在指定类型的信号",
        "geolocation-error": "[-] 请允许地理位置访问!",
        "location-error": "[-] 无法获取当前位置!"
    }
};

// Function to switch language
function switchLanguage(event) {
    // Determine which language was selected
    let lang = "en"; // default to English
    const btnText = event.currentTarget.textContent.trim();
    
    if (btnText.startsWith("DE")) lang = "de";
    else if (btnText.startsWith("SI")) lang = "sl";
    else if (btnText.includes("中文")) lang = "zh-CN";
    
    // Apply translations
    applyTranslations(lang);
    
    // Store preference
    localStorage.setItem('selectedLanguage', lang);
}

// Function to apply translations to the page
function applyTranslations(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}
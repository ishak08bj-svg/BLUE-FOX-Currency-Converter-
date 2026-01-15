const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const amount = document.getElementById('amount');
const result = document.getElementById('result');
// رموز العملات
const currencySymbols = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "JPY": "¥",
    "AED": "د.إ",
    "SAR": "ر.س",
    "EGP": "ج.م",
    "KWD": "د.ك",
    "CAD": "$",
    "AUD": "$",
    "CHF": "CHF",
    "CNY": "¥",
    "INR": "₹",
    "TRY": "₺",
    "RUB": "₽",
    "BRL": "R$",
    "NZD": "$",
    "ZAR": "R",
    "MXN": "$",
    "SGD": "$"
};


let rates = {}; // لتخزين أسعار العملات

// جلب أسعار العملات مرة واحدة عند تحميل الصفحة
async function fetchRates() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        rates = data.rates; // كل العملات مقابل الدولار
        populateCurrencies();
    } catch (err) {
        console.error(err);
        result.innerText = "حدث خطأ في جلب أسعار العملات.";
    }
}

// ملء القوائم بعد جلب الأسعار
function populateCurrencies() {
    Object.keys(rates).forEach(curr => {
        fromCurrency.innerHTML += `<option value="${curr}">${curr}</option>`;
        toCurrency.innerHTML += `<option value="${curr}" ${curr === "USD" ? "selected" : ""}>${curr}</option>`;
    });
}

// تحويل العملات
function convertCurrency() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amt = parseFloat(amount.value);

    if (!amt || amt <= 0) {
        result.innerText = "الرجاء إدخال مبلغ صحيح";
        return;
    }

    // التحويل عبر الدولار كمرجع
    const usdAmount = amt / rates[from]; 
    const converted = usdAmount * rates[to];

    result.innerText = `${amt} ${from} = ${converted.toFixed(2)} ${to}`;
}

// تحميل الأسعار عند فتح الصفحة
fetchRates();

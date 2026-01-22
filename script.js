const apiBase = "https://api.exchangerate-api.com/v4/latest/USD";
const from = document.getElementById("from");
const to = document.getElementById("to");
const result = document.getElementById("result");
const amountInput = document.getElementById("amount");
const title = document.getElementById("title");
const convertBtn = document.getElementById("convert-btn");
let chart;
let lang = 'ar'; // الوضع الافتراضي عربي

// نصوص ثنائية اللغة
const texts = {
  ar: {
    title: "🌍 محول العملات",
    amount: "أدخل المبلغ",
    convert: "تحويل",
    empty: "❌ أدخل المبلغ",
    chartLabel: "سعر الصرف"
  },
  en: {
    title: "🌍 Currency Converter",
    amount: "Enter Amount",
    convert: "Convert",
    empty: "❌ Enter the amount",
    chartLabel: "Exchange Rate"
  }
};

// تحميل العملات
function loadCurrencies() {
  fetch(apiBase)
  .then(res => res.json())
  .then(data => {
    from.innerHTML = '';
    to.innerHTML = '';
    for (let code in data.rates) {
      from.innerHTML += `<option value="${code}">${code}</option>`;
      to.innerHTML += `<option value="${code}">${code}</option>`;
    }
  });
}
loadCurrencies();
setInterval(loadCurrencies, 60000); // تحديث كل دقيقة

// تحويل العملات
function convert() {
  const amount = amountInput.value;
  if(amount === "") {
    result.innerHTML = texts[lang].empty;
    return;
  }
  fetch(apiBase)
  .then(res => res.json())
  .then(data => {
    const rate = data.rates[to.value] / data.rates[from.value];
    const final = (amount * rate).toFixed(2);
    result.innerHTML = `${amount} ${from.value} = ${final} ${to.value}`;
    historyChart();
  });
}

// رسم تاريخ أسعار العملات
function historyChart() {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 7);

  const start = past.toISOString().split('T')[0];
  const end = today.toISOString().split('T')[0];

  fetch(`https://api.exchangerate.host/timeseries?start_date=${start}&end_date=${end}&base=${from.value}&symbols=${to.value}`)
  .then(res => res.json())
  .then(data => {
    const labels = Object.keys(data.rates);
    const values = labels.map(d => data.rates[d][to.value]);

    if(chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: texts[lang].chartLabel,
          data: values,
          borderWidth: 2
        }]
      }
    });
  });
}

// الوضع الليلي / النهاري
function toggleMode() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}

// تغيير اللغة
function toggleLang() {
  lang = lang === 'ar' ? 'en' : 'ar';
  title.innerHTML = texts[lang].title;
  amountInput.placeholder = texts[lang].amount;
  convertBtn.innerHTML = texts[lang].convert;
  if(result.innerHTML) convert(); // إعادة التحويل لتحديث النصوص
}

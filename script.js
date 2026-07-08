/* ==========================
   FAQ TOGGLE
========================== */

const faqs = document.querySelectorAll(".faq-question");

faqs.forEach(button => {
    button.addEventListener("click", () => {

        const answer = button.nextElementSibling;

        if (answer.style.display === "block") {
            answer.style.display = "none";
        } else {
            answer.style.display = "block";
        }

    });
});


/* ==========================
   ANIMATED COUNTERS
========================== */

const counters = document.querySelectorAll(".counter");

const startCounters = () => {

    counters.forEach(counter => {

        const target = parseFloat(counter.dataset.target);

        let count = 0;

        const speed = target / 100;

        function updateCounter() {

            count += speed;

            if (count < target) {

                if (Number.isInteger(target)) {
                    counter.innerText = Math.floor(count);
                } else {
                    counter.innerText = count.toFixed(1);
                }

                requestAnimationFrame(updateCounter);

            } else {

                if (Number.isInteger(target)) {
                    counter.innerText = target;
                } else {
                    counter.innerText = target.toFixed(1);
                }

            }

        }

        updateCounter();

    });

};

window.addEventListener("load", startCounters);


/* ==========================
   EXCHANGE CALCULATOR
========================== */

function calculateExchange() {

    const amount = Number(document.getElementById("amount").value);

    const rate = Number(document.getElementById("currency").value);

    if (!amount || amount <= 0) {

        document.getElementById("result").innerHTML =
        "Please enter a valid amount.";

        return;

    }

    const result = amount * rate;

    document.getElementById("result").innerHTML =
    "Estimated NGN: ₦" + result.toLocaleString();

}async function loadRates(){

    document.getElementById("btc-price").innerHTML="Loading...";
    document.getElementById("eth-price").innerHTML="Loading...";
    document.getElementById("usdt-price").innerHTML="Loading...";
    document.getElementById("bnb-price").innerHTML="Loading...";

  const now = new Date();

document.getElementById("last-updated").innerHTML =
now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});

    try{

        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin&vs_currencies=ngn");

        const data = await response.json();

        document.getElementById("btc-price").innerHTML="₦"+data.bitcoin.ngn.toLocaleString();

        document.getElementById("eth-price").innerHTML="₦"+data.ethereum.ngn.toLocaleString();

        document.getElementById("usdt-price").innerHTML="₦"+data.tether.ngn.toLocaleString();

        document.getElementById("bnb-price").innerHTML="₦"+data.binancecoin.ngn.toLocaleString();

    }catch(error){

        console.log(error);

    }

}

loadRates();async function trackOrder() {

    const reference = document
        .getElementById("trackingNumber")
        .value
        .trim()
        .toUpperCase();

    const result = document.getElementById("trackingResult");

    if (reference === "") {

        result.innerHTML = "❌ Please enter your transaction reference.";
        result.style.color = "#ff5555";
        return;

    }

    try {

        const snapshot = await db.collection("transactions")
            .where("reference", "==", reference)
            .get();

        if (snapshot.empty) {

            result.innerHTML =
                "⚠️ Transaction reference not found.";

            result.style.color = "#ffc107";
            return;

        }

        snapshot.forEach(doc => {

            const data = doc.data();

            result.innerHTML = `
<b>Reference:</b> ${data.reference}<br>
<b>Customer:</b> ${data.customer}<br>
<b>Service:</b> ${data.service}<br>
<b>Amount:</b> ₦${Number(data.amount).toLocaleString()}<br>
<b>Status:</b> ${data.status}
            `;

            result.style.color = "#00e69a";

        });

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "❌ Unable to load transaction.";

        result.style.color = "#ff5555";

    }

}

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (loader) {

        setTimeout(() => {

            loader.style.opacity = "0";
            loader.style.visibility = "hidden";

        }, 1500);

    }

    // Load rates immediately
    loadRates();

    // Refresh every 10 seconds
    setInterval(loadRates, 10000);

});
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

}
const faqs = document.querySelectorAll(".faq-question");

faqs.forEach(button => {

button.addEventListener("click", () => {

const answer = button.nextElementSibling;

answer.style.display =
answer.style.display === "block"
? "none"
: "block";

});

});window.addEventListener("load", function(){

setTimeout(function(){

document.getElementById("loader").style.opacity="0";

document.getElementById("loader").style.visibility="hidden";

},1000);

});// Animated Counter

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

const updateCounter = () => {

const target = Number(counter.getAttribute("data-target"));
const current = Number(counter.innerText);

const increment = target / 150;

if(current < target){

counter.innerText = (current + increment).toFixed(target % 1 !== 0 ? 1 : 0);

setTimeout(updateCounter,10);

}else{

counter.innerText = target;

}

};

updateCounter();

});function calculateExchange(){

const amount = Number(document.getElementById("amount").value);

const rate = Number(document.getElementById("currency").value);

const result = amount * rate;

document.getElementById("result").innerHTML =
"Estimated NGN: ₦" + result.toLocaleString();

}const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    const icon = themeToggle.querySelector("i");

    if(document.body.classList.contains("light-mode")){
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        localStorage.setItem("theme","light");
    }else{
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        localStorage.setItem("theme","dark");
    }

});
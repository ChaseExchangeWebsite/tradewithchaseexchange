const faqs = document.querySelectorAll(".faq-question");

faqs.forEach(button => {

button.addEventListener("click", () => {

const answer = button.nextElementSibling;

answer.style.display =
answer.style.display === "block"
? "none"
: "block";

});

});
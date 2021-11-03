const openBtn = document.querySelector(".modal-btn");
// console.log(modalopen)
const closeBtn = document.querySelector(".close-btn");
const modal = document.querySelector(".modal-overlay");

openBtn.addEventListener("click",function() {
    modal.classList.add("open-modal");
})
closeBtn.addEventListener("click",function() {
    modal.classList.remove("open-modal")
})
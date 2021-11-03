const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const colseBtn =document.querySelector('.close-btn');

sidebarToggle.addEventListener('click', function() {
    // console.log(links.classList);
    // if(sidebar.classList.contains('show-sidebar')){
    //     sidebar.classList.remove("show-sidebar");
    // }
    // else{
    //     sidebar.classList.add("show-sidebar");
    // }
    sidebar.classList.toggle('show-sidebar');
})
colseBtn.addEventListener("click", function(){
    sidebar.classList.remove("show-sidebar");
})
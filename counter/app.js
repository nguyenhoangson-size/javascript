let count = 0;
var value= document.querySelector('#value');
var btn= document.querySelectorAll(".btn");
btn.forEach(function(btn) {
    btn.addEventListener("click",function(e){
        let styles = e.currentTarget.classList;
        if(styles.contains("decrease")){
            count--;
        }
        if(styles.contains("reset")){
            count=0;
        }
        if(styles.contains("increase")){
            count++;
        }
        if(count>0){
            value.style.color = 'green';
        }
        if(count<0){
            value.style.color = 'red';
        }
        if(count ===0){
            value.style.color = 'black';
        }
        value.textContent =count;
    })
})
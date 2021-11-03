const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const giveaway =document.querySelector('.giveaway');
const dealine = document.querySelector('.dealine');
const  items =document.querySelectorAll('.deadline-format h4')

let futureDate = new Date(2021, 9 ,30, 11 ,30 ,0);
console.log(futureDate);

const year = futureDate.getFullYear();
const hours = futureDate.getHours();
const minute = futureDate.getMinutes();

let month = futureDate.getMonth();
month = months[month];
const date = futureDate.getDate();
const weekday = weekdays[futureDate.getDay()]; 
console.log(weekday)
giveaway.textContent = `giveway ends on ${weekday}, ${date} ${month} ${year} ${hours}:${minute} am`;

// future time in ms
const futureTime = futureDate.getTime();

function getRemainingTime() {
    const today =new Date().getTime();
    const t  = futureTime - today;
    // 1s = 1000 ms 
    // 1m =60s
    //1hr =60mim
    //1d =24hr

    //values in ms
    const oneDay = 24*60*60*1000;
    const oneHours = 60*60*1000;
    const oneMinute = 60*1000;
    // calculate all value
    let days = t/oneDay;
    days = Math.floor(days)
    let hours = Math.floor((t%oneDay)/oneHours);
    let minutes = Math.floor((t%oneHours)/oneMinute);
    let seconds = Math.floor((t%oneMinute)/ 1000);

    // set values array
    const values = [days, hours, minutes,seconds];
    function format(item){
        if(item<10){
            return item = `0${time}`
        }
        return item;
    }
    items.forEach(function(item,index){
        item.innerHTML = values[index];
    })
    if(t<0){
        clearInterval(countdown);
        dealine.innerHTML=`<h4 class="expired>sorry, this giveaway has expired</h4>`
    }
}
let countdown =setInterval(getRemainingTime,1000)
getRemainingTime();
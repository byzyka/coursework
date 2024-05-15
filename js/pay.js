let paymentInfo = localStorage.getItem("seance-data");
let parsedselectedChairs = JSON.parse(paymentInfo);
//console.log(parsedselectedChairs.configHall);

let movieTitle = document.querySelector(".main-content-ticket-info-name span");


movieTitle.innerHTML = `${parsedselectedChairs.filmName}`;

let place = document.querySelector(".main-content-ticket-info-places");
//let placeSpan = document.querySelector(".main-content-ticket-info-place-span");


let selectedPlace = [];

place.innerHTML = " ";

parsedselectedChairs.selectedPlaces.forEach((item) => {
    selectedPlace.push('<span class="main-content-ticket-info-place-span">' + item.row + '/' + item.place + '</span>');
});

place.innerHTML += `<div class="main-content-ticket-info-place">Ряд/Место: ${selectedPlace.join(', ')}<div>`;


let hall = document.querySelector(".main-content-ticket-info-hall span");
hall.innerHTML = `${parsedselectedChairs.hallName}`;

let startMovie = document.querySelector(".main-content-ticket-info-time span");
startMovie.innerHTML = `${parsedselectedChairs.seanceTime}, ${parsedselectedChairs.takenDay}`;

let priceSeances = document.querySelector(".main-content-ticket-info-price");

let allPrice = parsedselectedChairs.selectedPlaces[0].type;
//console.log(priceSeances);
let standartPrice = [];
let vipPrice = [];
let priceSum = 0;

parsedselectedChairs.selectedPlaces.forEach((item) => {
    if (item.type == "standart") {
        standartPrice.push(+parsedselectedChairs.hallPriceStandart);
    }
    if (item.type == "vip") {
        vipPrice.push(+parsedselectedChairs.hallPriceVip);
    }

    let allSum = [];
    allSum.push(...standartPrice, ...vipPrice);

    priceSum = allSum.reduce((a, b) => a + b, 0);
    // console.log(priceSum);
    priceSeances.innerHTML = "";
    priceSeances.innerHTML += `<div class="main-content-ticket-info-price">Стоимость: <span class="main-content-ticket-info-price-span">${priceSum}</span> рублей </div>`;

});

let acceptinButton = document.querySelector('.main-content-ticket-btn-qr');

let ticket = parsedselectedChairs;

ticket.price = priceSum;


acceptinButton.addEventListener('click', event => {
    //event.preventDefault();
    localStorage.setItem('ticket-data', JSON.stringify(ticket));
    //console.log(ticket); 
    window.location.href = "ticket.html";
})
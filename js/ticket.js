let ticketInfo = localStorage.getItem('ticket-data');
let parsedTickets = JSON.parse(ticketInfo);
//console.log(parsedTickets);

let movieName = document.querySelector('.main-content-ticket-info-name span');
//console.log(movieName);
movieName.innerHTML = `${parsedTickets.filmName}`;

let movieHall = document.querySelector('.main-content-ticket-info-hall');
movieHall.innerHTML = `<div class="main-content-ticket-info-hall">В зале: <span>${parsedTickets.hallName}</span></div>`;

let movieTime = document.querySelector('.main-content-ticket-info-time');
movieTime.innerHTML = `<div class="main-content-ticket-info-time">Начало сеанса: <span>${parsedTickets.seanceTime}</span></div>`;

let movieChair = document.querySelector('.main-content-ticket-info-place');
//moviePrice.innerHTML = `${parsedTickets.price}`;
let arrChair = [];

parsedTickets.selectedPlaces.forEach((item) => {  
    arrChair.push('<span class="main-content-ticket-info-place-span">'+item.row+'/'+item.place+'</span>');
});
movieChair.innerHTML = "";
movieChair.innerHTML += `<div class="main-content-ticket-info-place">Ряд/Место: ${arrChair.join(', ')}<div>`;

//Дата, Время, Название фильма, Зал, Ряд, Место, Стоимость, Фраза "Билет действителен строго на свой сеанс".
//takenDay seanceTime filmName hallName selectedPlaces.row  selectedPlaces.place price;
let allRow = [];
let allPlaces = [];
parsedTickets.selectedPlaces.forEach( item => {
    allRow.push(item.row);
    allPlaces.push(item.place);

})
//console.log(typeof(parsedTickets.takenDay) )


let QR = [parsedTickets.takenDay, parsedTickets.seanceTime, parsedTickets.filmName, parsedTickets.hallName, 'Ряд: '+ allRow.join(', '),  'Место: '+ allPlaces.join(', '), 'Стоимость: '+parsedTickets.price + ' руб.', "Билет действителен строго на свой сеанс"].join(', ');

//let qrImg = QRCreator (arrQr)
document.querySelector('.main-content-ticket-qr').append(QRCreator(QR,  { image: "SVG" }).result);
//console.log(parsedTickets.tickets);

let ticketsArr = [];
parsedTickets.tickets.forEach(i => {
  //console.log(i);
  ticketsArr.push(i);
})

//console.log(ticketsArr);

const paramsTicket = new FormData();
paramsTicket.set('seanceId', parsedTickets.seanceId);
paramsTicket.set('ticketDate', parsedTickets.takenDay);
paramsTicket.set('tickets', JSON.stringify(ticketsArr));

/*paramsTicket.forEach((value, key) => {
        console.log(key, value);
    });
*/
        fetch('https://shfe-diplom.neto-server.ru/ticket', {
          method: 'POST',
         body: paramsTicket,
        })
          .then(response => response.json())
          .then(data => {
            //console.log(data);
          })
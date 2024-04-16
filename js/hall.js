let seanceData = localStorage.getItem("seance-data");
let parsedSeances = JSON.parse(seanceData);

console.log(parsedSeances);

let schemeHall = document.querySelector(
  ".main-content-buying-hall-scheme-items-rows"
);

let movieTitle = document.querySelector(".main-content-buying-info-title-name");
movieTitle.innerText = `${parsedSeances.filmName}`;

let movieSeanceStart = document.querySelector(
  ".main-content-buying-info-title-time span"
);
movieSeanceStart.innerText = `${parsedSeances.seanceTime}`;

let hallName = document.querySelector(
  ".main-content-buying-info-title-hall span"
);
hallName.innerText = `${parsedSeances.hallName}`;

let priceFree = document.querySelector(
  ".main-content-buying-hall-scheme-legend-place-free span"
);
priceFree.innerText = `${parsedSeances.hallPriceStandart}`;

let priceVip = document.querySelector(
  ".main-content-buying-hall-scheme-legend-place-vip span"
);
priceVip.innerText = `${parsedSeances.hallPriceVip}`;

let acceptinButton = document.querySelector('.main-content-buying-book');

function checkSelectedChairs(){
    let allSelectedChairs = document.querySelectorAll('.main-content-buying-hall-scheme-item.selected');
   
    //console.log(allSelectedChairs);

     if (allSelectedChairs.length > 0) {
        acceptinButton.removeAttribute('disabled');
    } else {
        acceptinButton.setAttribute('disabled', 'disabled');
    }

}



createRequest(
  "GET",
  "https://shfe-diplom.neto-server.ru/alldata",
  `event=get_hallConfig&timestamp=${parsedSeances.seanceTimeStamp}&hallId=${parsedSeances.hallId}&seanceId=${parsedSeances.seanceId}`,
  function (response) {
    console.log(response);

    if (response) {
      parsedSeances.hallConfig = response;
    } else {
      console.log("Нет купленных билетов");
    }

    schemeHall.innerHTML = "";

    let newHall = "";

    parsedSeances.configHall.forEach((row) => {
      //console.log(row);
      newHall += `<div class="main-content-buying-hall-scheme-items-row">`;
      row.forEach((item) => {
        if (item == "disabled") {
          newHall += `<div class="main-content-buying-hall-scheme-item free busy"></div>`;
        } else if (item == "vip") {
          newHall += `<div class="main-content-buying-hall-scheme-item free vip"></div>`;
        } else if (item == "standart") {
          newHall += `<div class="main-content-buying-hall-scheme-item free"></div>`;
        }
      });
      newHall += `</div>`;
    });

    schemeHall.innerHTML = newHall;

    let chairs = document.querySelectorAll(
      ".main-content-buying-hall-scheme-item"
    );

    for (let chair of chairs) {
      //console.log(chair)
      chair.addEventListener("click", (event) => {
        event.preventDefault();

        let selectedChair = event.target;
        if (!selectedChair.classList.contains("busy")) {
          if (selectedChair) {
            selectedChair.classList.toggle("selected");
          }

          checkSelectedChairs();
        }
      });
    }
    
    

   // console.log(allSelectedChairs);

    
    

    acceptinButton.addEventListener('click', event => {
       //event.preventDefault()
        
        let selectedChairs = [];
       let allSelectedChairs = document.querySelectorAll('.main-content-buying-hall-scheme-item.selected');

        allSelectedChairs.forEach((selectedChair) => {
            
            console.log(selectedChair)
            let rowElement = selectedChair.closest('.main-content-buying-hall-scheme-items-row');
            let rowIndex = Array.from(rowElement.parentNode.children).indexOf(rowElement) + 1;
            let placeIndex = Array.from(rowElement.children).indexOf(selectedChair) + 1;
            let typePlace;
            
            if (selectedChair.classList.contains('vip')) {

                typePlace = 'vip';
            } else if (selectedChair.classList.contains('free')) {
                typePlace = 'standart';
            }

            
            selectedChairs.push({ row: rowIndex, place: placeIndex, type: typePlace });
               
        });

   
        parsedSeances.selectedPlaces = selectedChairs;
       
        localStorage.setItem('seance-data', JSON.stringify(parsedSeances));
        console.log(parsedSeances)
      window.location.href = "../html/pay.html";
    });
  }
);

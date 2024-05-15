document.addEventListener("DOMContentLoaded", () => {
    //дивы с днями
    let dayWeekElements = document.querySelectorAll(".content-nav-week-day");
    //console.log(dayWeekElements);
    //дивы с числами
    let dayNumberElements = document.querySelectorAll(".content-nav-week-day-date.number");
    //console.log(dayNumberElements);
    //дни
    let pageNavDays = document.querySelectorAll(".content-nav-week-day-date.day");
    //console.log(pageNavDays);

    dayNumberElements.forEach((dayNumberElement, index) => {
        let day = new Date();

        day.setDate(day.getDate() + index);
        dayNumberElement.textContent = day.getDate();
        pageNavDays[index].textContent = weekDays(day);

        let navDay = dayNumberElement.parentNode;
        //названия дней недели
        //console.log(dayWeekElements[index].getElementsByClassName("day")[0].textContent);       
        if (
            dayWeekElements[index].getElementsByClassName("day")[0].textContent == "Сб" ||
            dayWeekElements[index].getElementsByClassName("day")[0].textContent == "Вс"
        ) {
            navDay.classList.add("weekend");
        } else {
            navDay.classList.remove("weekend");
        }
    });

    function weekDays(date) {
        let daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        return daysOfWeek[date.getDay()];
    }

    fetch("https://shfe-diplom.neto-server.ru/alldata", {})
        .then((response) => response.json())
        .then((data) => {

            let films = data.result.films;
            //console.log(data.result.seances);

            let arrSortSeances = Object.values(data.result.seances).sort((a, b) => a.seance_time.localeCompare(b.seance_time));
            //console.log(arrSortSeances);

            let takenDay;
            let halls = data.result.halls.filter(
                (openhalls) => openhalls.hall_open !== "0");

            let allSeances = arrSortSeances;

            let main = document.querySelector(".main");
            main.innerHTML = "";

            for (let film of films) {

                let hallSeances = "";
                halls.forEach((hall) => {
                    let seances = allSeances.filter(
                        (seance) =>
                            seance.seance_filmid == film.id && seance.seance_hallid == hall.id
                    );

                    if (seances.length > 0) {
                        hallSeances += `<div class="main-content-hall">
                        <div class="main-content-hall-header"> ${hall.hall_name} </div>
                            <div class="main-content-hall-seanses">`;
                        seances.forEach(seance => {
                            hallSeances += `<div>
                                <a class="main-content-hall-time" href="html/hall.html" data-film-name ="${film.film_name}" 
                                data-seance-time="${seance.seance_time}" 
                                data-hall-name="${hall.hall_name}" data-hall-id="${hall.id}" data-seance-id="${seance.id}" 
                                data-hall-price-standart="${hall.hall_price_standart}"
                                data-seance-duration="${film.film_duration}"
                                data-hall-price-vip="${hall.hall_price_vip}">${seance.seance_time}</a>
                                </div>`;
                        })
                        hallSeances += `    </div>          
                        </div>`;
                    }
                });

                if (hallSeances) {
                    main.innerHTML += `<div class="main-content">
          <div class="main-content-descript">
            <div class="main-content-descript-img">
              <div class="main-content-descript-img-item">
                <img src="${film.film_poster}" alt="${film.film_name}" />
              </div>
              <div class="main-content-descript-img-item-after">
                <img src="./img/after.png" alt="прямоугольник" />
              </div>
            </div>
  
            <div class="main-content-descript-movie">
              <div class="main-content-descript-movie-title">
              ${film.film_name}
              </div>
              <div class="main-content-descript-movie-text">
                <p>${film.film_description}</p>
              </div>
              <div class="main-content-descript-movie-show">
                <div class="main-content-descript-movie-time">${film.film_duration}</div>
                <div class="main-content-descript-movie-country">${film.film_origin}</div>
              </div>
            </div>
          </div>${hallSeances}`;
                }
            }

            let seancesTime = document.querySelectorAll(".main-content-hall-time");
            //console.log(seancesTime);
            let dateNumber = document.querySelector('.content-nav-week-day.active').getElementsByClassName("number")[0].textContent;


            updSeanses(seancesTime);

            for (let pageNavDay of dayWeekElements) {
                pageNavDay.addEventListener("click", (event) => {

                    let pageNavDayIndex = Array.from(dayWeekElements).indexOf(pageNavDay);
                    //console.log(seancesTime);
                    let selectedDay = document.querySelector(".active");
                    //console.log(selectedDay);
                    if (selectedDay) {
                        selectedDay.classList.remove("active");
                    }

                    pageNavDay.dataset.index = pageNavDayIndex;
                    pageNavDay.classList.add("active");

                    seancesTime.forEach((time) => {

                        let selectedDate = new Date();
                        selectedDate.setDate(selectedDate.getDate() + pageNavDayIndex);
                        selectedDate.getMonth();
                        takenDay = moment(selectedDate).format('YYYY-MM-DD');
                        //console.log(takenDay)
                    });

                    updSeanses(seancesTime);

                });
            }

            let current = new Date();

            seancesTime.forEach((time) => {
                time.addEventListener("click", (event) => {
                    //event.preventDefault();
                    if (!takenDay) {
                        //
                        //return false;
                        takenDay = current.toLocaleDateString();;
                        console.log(takenDay);
                    }

                    let hallId = event.target.dataset.hallId;
                    let selectedHall = halls.find((hall) => hall.id == hallId);

                    // console.log(selectedHall);
                    let selectedSeance = {
                        ...event.target.dataset,
                        configHall: selectedHall.hall_config,
                        takenDay: takenDay,
                    };
                    console.log(selectedSeance);
                    let jsonSeance = JSON.stringify(selectedSeance);

                    localStorage.setItem("seance-data", jsonSeance);
                    //console.log(jsonSeance);
                });
            });
        }
        );

    function updSeanses(seanses) {
        seanses.forEach(seance => {

            let arTime = seance.getAttribute('data-seance-time').split(':');
            let filmDuration = seance.getAttribute('data-seance-duration');

            let selectedDayIndex = document.querySelector('.content-nav-week-day.active').getAttribute('data-index');
            if (selectedDayIndex == null) {
                selectedDayIndex = 0;
            }

            let date = new Date();
            let seanceTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), arTime[0], arTime[1]);
            seanceTime.setDate(seanceTime.getDate() + parseInt(selectedDayIndex));
            seanceTime = Math.floor(seanceTime.getTime() / 1000);

            let selectedDate = new Date();
            selectedDate.setDate(selectedDate.getDate() + parseInt(selectedDayIndex));

            if (selectedDayIndex != 0) {
                selectedDate.setHours(0, 0, 0);
            }

            let currentDay = Math.floor(selectedDate.getTime() / 1000);

            if (currentDay > seanceTime) {
                seance.classList.add('disabled');
            } else {
                seance.classList.remove('disabled');
            }
        })
    }
});

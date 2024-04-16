updateHall();
updateaddHalls();
scalePaint();

//добавляем зал
let button = document.querySelector(".main-content-section-control-hall-btn-link");
let addHallButton = document.querySelector(".main-content-add-btn");


addHallButton.addEventListener("click", (e) => {
  e.preventDefault();

  let addHallinput = document.getElementById("hall");
  let hall = new FormData();

  hall.set("hallName", addHallinput.value);

  fetch("https://shfe-diplom.neto-server.ru/hall", {
    method: "POST",
    body: hall,
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log( data )
      if (data.error) {
        alert(data.error);
      } else {
        $.fancybox.close();
        updateHall();
        updateaddHalls();
        updatePriceHalls();
        scalePaint();
        openHall();
      }
      addHallinput.value = "";
    });
});

//получение всех залов и запись их в верстку

function updateHall() {
  fetch("https://shfe-diplom.neto-server.ru/alldata", {})
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.result.halls);
      let list = document.querySelector(".main-content-section-control-hall-list");
      list.innerHTML = "";

      list.innerHTML += `<div class="main-content-section-control-hall-list"> Доступные залы:`;
      data.result.halls.forEach((hall) => {
        //console.log(hall.hall_name);
        list.innerHTML += `<div class="main-content-section-control-hall-item"> ${hall.hall_name}
                <button class="main-content-section-control-hall-item-del" data-hall-id=${hall.id} >
                </button></div>`;
      });
      list.innerHTML += `</div>`;

      let delHall = document.querySelectorAll(".main-content-section-control-hall-item-del");
      //console.log(delHall);

      delHall.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();

          let targetDel = e.target;
          let hallId = targetDel.getAttribute("data-hall-id");
          //console.log(hallId);
          fetch("https://shfe-diplom.neto-server.ru/hall/" + hallId, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((data) => {
              //console.log(data);
              if (data.success) {
                targetDel.closest(".main-content-section-control-hall-item").remove();
                //updateHall();
                updateaddHalls();
                updatePriceHalls();
                scalePaint();
                openHall();
              }
            });
        });
      });
    });
}

// КОНФИГУРАЦИЯ ЗАЛОВ

//зал для конфигурации

let saveBtn = document.getElementById("saveHall");
saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //выбранный зал
  let activeHall = document.querySelector(".main-content-section-configuration-item.active");

  // console.log(activeHall);
  if (activeHall == null) {
    alert("Не выбран зал!");
    return false;
  }

  let activeHallId = activeHall.getAttribute("data-hall-id");
  //ряд - место
  let row = document.getElementById("row");
  let place = document.getElementById("place");

  if (
    row.value == 0 || place.value == 0 || row.valueow == "" || place.value == "") {
    alert("Заполните обязательные поля!");
    return false;
  }
  let configRow = document.querySelectorAll(".main-content-section-configuration-type-hall-items-row");

  let config = [];
  configRow.forEach((row) => {
    let configChairs = row.querySelectorAll(".main-content-section-configuration-type-item");

    let rowChair = [];
    configChairs.forEach((chair) => {
      rowChair.push(chair.getAttribute("data-type-title"));

    });

    config.push(rowChair);
  });
  alert("Успешно!");

  //массив со схемой кинозала
  let params = new FormData();

  params.set("rowCount", row.value);
  params.set("placeCount", place.value);
  params.set("config", JSON.stringify(config));
  fetch("https://shfe-diplom.neto-server.ru/hall/" + activeHallId, {
    method: "POST",
    body: params,
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
});

let resetBtn = document.getElementById("nosaveHall");
resetBtn.addEventListener("click", () => document.location.reload());

let configList = document.querySelector(".main-content-section-configuration-place-list");

configList.addEventListener("change", (e) => {
  let placeAmount = document.getElementById("place").value;
  let rowAmount = document.getElementById("row").value;
  //console.log(placeAmount)
  let schemeItems = document.querySelector(".main-content-section-configuration-type-hall-items");
  schemeItems.innerHTML = "";

  let newRow = "";
  for (let i = 0; i < rowAmount; i++) {
    // console.log(i);

    newRow +=
      '<div class="main-content-section-configuration-type-hall-items-row">';
    for (let j = 0; j < placeAmount; j++) {
      newRow +=
        '<div class="main-content-section-configuration-type-item standart" data-type-title="standart" data-type="0"></div>';
      //console.log(newPlaces);
    }

    newRow += "</div>";
  }

  schemeItems.innerHTML = newRow;

  /*обработчик клика по креслу*/
  let chairTypes = ["standart", "vip", "disabled"];
  let allChairs = document.querySelectorAll(".main-content-section-configuration-type-item");
  allChairs.forEach((chair) => {
    chair.addEventListener("click", (e) => {
      let selectedChair = e.target;
      let chairDataId = selectedChair.getAttribute("data-type");
      selectedChair.classList.remove(chairTypes[chairDataId]);
      chairDataId++;

      if (chairDataId >= chairTypes.length) {
        chairDataId = 0;
      }

      selectedChair.classList.add(chairTypes[chairDataId]);
      selectedChair.setAttribute("data-type", chairDataId);
      selectedChair.setAttribute("data-type-title", chairTypes[chairDataId]);
    });
  });
});
//записали имя и id в зал
function updateaddHalls() {
  fetch("https://shfe-diplom.neto-server.ru/alldata", {})
    .then((response) => response.json())
    .then((data) => {
      let configHall = document.querySelector(".main-content-section-configuration-list");

      configHall.innerHTML = "";

      data.result.halls.forEach((hall) => {
        configHall.innerHTML += `<button class="main-content-section-configuration-item" data-hall-id=${hall.id}>${hall.hall_name}</button>`;
      });

      // Выбрали зал
      let hallBtns = document.querySelectorAll(".main-content-section-configuration-item");
      //console.log(hallBtns);
      hallBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          let selectedHall = document.querySelector(".active");
          if (selectedHall) {
            selectedHall.classList.remove("active");
          }
          btn.classList.add("active");
        });
      });
    });
}

updatePriceHalls();

//изменение цен в залах

function updatePriceHalls() {
  fetch("https://shfe-diplom.neto-server.ru/alldata", {})
    .then((response) => response.json())
    .then((data) => {
      updateHall();

      //console.log(data);
      let configHall = document.querySelector(".main-content-section-price-hall-list");

      configHall.innerHTML = "";

      data.result.halls.forEach((hall) => {
        configHall.innerHTML += `<button class="main-content-section-price-hall-item" data-hall-id=${hall.id}>${hall.hall_name}</button>`;
      });

      // Выбрали зал
      let hallBtns = document.querySelectorAll(".main-content-section-price-hall-item");

      hallBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          let selectedHall = document.querySelector(".active");
          if (selectedHall) {
            selectedHall.classList.remove("active");
          }
          btn.classList.add("active");
        });
      });
    });
}

let savePriceBtn = document.getElementById("savePrice");

let resetPriceBtn = document.getElementById("noSavePrice");
resetPriceBtn.addEventListener("click", () => document.location.reload());

savePriceBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let activeHall = document.querySelector(".main-content-section-price-hall-item.active");
  //console.log(activeHall);
  if (activeHall == null) {
    alert("Не выбран зал!");
    return false;
  }

  let activeHallId = activeHall.getAttribute("data-hall-id");


  let standartPriceInput = document.getElementById("standartPrice");
  //console.log(standartPriceInput.value);

  let vipPriceInput = document.getElementById("vipPrice");
  // console.log(vipPriceInput.value);

  if (
    standartPriceInput.value == 0 || vipPriceInput.value == 0 || standartPriceInput.valueow == "" ||
    vipPriceInput.value == ""
  ) {
    alert("Заполните обязательные поля!");
    return false;
  }

  const priceParams = new FormData();
  priceParams.set("priceStandart", standartPriceInput.value);
  priceParams.set("priceVip", vipPriceInput.value);
  fetch("https://shfe-diplom.neto-server.ru/price/" + activeHallId, {
    method: "POST",
    body: priceParams,
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Успешно!");
      console.log(data)
    }
    );
});

//добавление фильма
let addMovieBtn = document.getElementById("addFilm");
//console.log(addMovieBtn)
let resetMovieBtn = document.getElementById("cancelAddedFilm");
resetMovieBtn.addEventListener("click", () => document.location.reload());

addMovieBtn.addEventListener("click", (e) => {

  let form = document.getElementById("form");

  const movieParams = new FormData(form);
  /*movieParams.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });*/

  fetch("https://shfe-diplom.neto-server.ru/film", {
    method: "POST",
    body: movieParams,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success == true) {
        addFilms();
      }
    });
});

addFilms();


function addFilms() {
  fetch("https://shfe-diplom.neto-server.ru/alldata", {})
    .then((response) => response.json())
    .then((data) => {


      // console.log(data.result.films)
      let allFilms = data.result.films;
      let previous = document.querySelector(".main-content-section-sessions-list");

      previous.innerHTML = "";
      let prevMovie = "";

      allFilms.forEach((film) => {
        // console.log(film);
        prevMovie += `
        <div class="main-content-section-sessions-item" draggable="true" >
            <div class="main-content-section-sessions-item-img">
                <img src="${film.film_poster}" alt="poster">
            </div>
            <div class="main-content-section-sessions-item-descr">
                <div class="main-content-section-sessions-item-title">${film.film_name}</div>
                <div class="main-content-section-sessions-item-time">${film.film_duration}</div>
            </div>
            <div class="main-content-section-sessions-item-del" data-film-id=${film.id}></div>
            </div>`;
      });

      previous.innerHTML += prevMovie;

      let delFilmBtn = document.querySelectorAll(".main-content-section-sessions-item-del");
      //console.log(delFilmBtn);

      delFilmBtn.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();

          let targetFilmDel = e.target;
          console.log(targetFilmDel);
          let filmId = targetFilmDel.getAttribute("data-film-id");

          console.log(filmId);
          fetch("https://shfe-diplom.neto-server.ru/film/" + filmId, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              if (data.success) {
                targetFilmDel.closest(".main-content-section-sessions-item").remove();
                updateHall()
                updateaddHalls();
                updatePriceHalls();
                scalePaint();
                seanceDel();
              }
            });
        });
      });
    });
}
scalePaint();

//рисуем сетку с фильмами
function scalePaint() {
  let hallSeance = document.querySelector(".main-content-section-sessions-halls");
  //console.log(hallSeance);

  fetch("https://shfe-diplom.neto-server.ru/alldata", {})
    .then((response) => response.json())
    .then((data) => {

      console.log()
      let scaleFilms = "";
      hallSeance.innerHTML = "";

      data.result.halls.forEach((hall) => {

        scaleFilms += `
      <div class="main-content-section-sessions-hall"><span>${hall.hall_name}</span>
      
          <div class="main-content-section-sessions-hall-net" data-hall-id="${hall.id}" data-hall-name="${hall.hall_name}">`;
        let allSeances = data.result.seances;

        let seances = allSeances.filter((seance) => seance.seance_hallid == hall.id);


        let arrSortSeances = Object.values(seances).sort((a, b) => a.seance_time.localeCompare(b.seance_time));
        //console.log(arrSortSeances); 
        arrSortSeances.forEach((seanceItem) => {

          let allFilms = data.result.films;
          let films = allFilms.filter(
            (film) => seanceItem.seance_filmid == film.id
          );

          scaleFilms += `<div class="main-content-section-sessions-item-prev" data-seance-id="${seanceItem.id}" draggable="true">
          <div class="main-content-section-sessions-hall-net-movie">${films[0].film_name}
            </div><div class="movie-time">${seanceItem.seance_time}</div></div>`

        });

        scaleFilms += `</div> <div class="basket-delete"></div></div>`;
      });
      hallSeance.innerHTML = scaleFilms;

      // console.log(hallSeance); 

      //перетаскивание
      //элементы, которые можем перетаскивать
      let movieList = document.querySelector(".main-content-section-sessions-list");

      movieList.addEventListener("dragstart", (evt) => {
        evt.target.classList.add("selected");
        let titleTarget = evt.target.querySelector(".main-content-section-sessions-item-title").textContent;
        console.log(titleTarget);
        let durationTarget = evt.target.querySelector(".main-content-section-sessions-item-time").textContent;
        let id = evt.target.querySelector(".main-content-section-sessions-item-del");
        let idTarget = id.getAttribute("data-film-id");
        // console.log(idTarget);
        evt.dataTransfer.clearData();
        evt.dataTransfer.setData("title", titleTarget);
        evt.dataTransfer.setData("duration", durationTarget);
        evt.dataTransfer.setData("id", idTarget);
      });

      movieList.addEventListener(`dragend`, (evt) => { evt.target.classList.remove(`selected`); });

      //все залы
      let hallsForFilms = document.querySelectorAll(".main-content-section-sessions-hall-net");

      hallsForFilms.forEach((hall) => {

        hall.addEventListener(`dragover`, (evt) => {
          // Разрешаем сбрасывать элементы в эту область
          evt.preventDefault();
          //console.log(evt);
          // Находим перемещаемый элемент
          const activeElement = movieList.querySelector(`.selected`);

          // Находим элемент, над которым в данный момент находится курсор
          const currentHall = evt.target;
          //console.log(currentHall);
          const isMoveable =
            activeElement !== currentHall &&
            currentHall.classList.contains("main-content-section-sessions-hall-net");

          // Если нет, прерываем выполнение функции
          if (!isMoveable) {
            return;
          }
        });



        hall.addEventListener("drop", (evt) => {
          if (evt.dataTransfer.getData("title") == '') {
            return false;
          }

          evt.preventDefault();
          $.fancybox.open({
            src: "#addSeance",
            type: "inline",
            smallBtn: false,
            toolbar: false,
          });


          let selectHall = document.getElementById("selectHall");
          let selectFilm = document.getElementById("selectFilm");

          selectHall.value = evt.target.getAttribute("data-hall-name");
          //let idHall = evt.target.getAttribute('data-hall-id')          
          selectFilm.value = evt.dataTransfer.getData("title");
          selectHall.setAttribute('data-id', evt.target.getAttribute('data-hall-id'));
          selectFilm.setAttribute('data-id', evt.dataTransfer.getData("id"));


        });
      });

      let resetBtn = document.getElementById("noSaveSeance");
      resetBtn.addEventListener("click", () => document.location.reload());
    });

}


let addSeance = document.getElementById("seanceAdded");
let recetSeance = document.getElementById('cancelSeanse');
recetSeance.addEventListener("click", () => document.location.reload());
let selectHall = document.getElementById("selectHall");
let selectFilm = document.getElementById("selectFilm");

addSeance.addEventListener("click", (e) => {
  //let filmID = selectFilm.getAttribute('data-film-id');

  let movieStart = document.getElementById("movieStart");



  //console.log(movieStart.value);
  const seancesParams = new FormData();

  seancesParams.set("seanceHallid", selectHall.getAttribute('data-id'));
  seancesParams.set("seanceFilmid", selectFilm.getAttribute('data-id'));
  seancesParams.set("seanceTime", movieStart.value);

  /* seancesParams.forEach((value, key) => {
     console.log(key, value);
     
   });*/




  fetch("https://shfe-diplom.neto-server.ru/seance", {
    method: "POST",
    body: seancesParams,
  })
    .then((response) => response.json())
    .then((data) => {



      if (data.success) {
        $.fancybox.close();
        //updateHall()
        //updateaddHalls();
        scalePaint();
        seanceDel();
        alert('Успешно');
      } else {
        alert(data.error);
        return false;
      }

    });
});

seanceDel();
function seanceDel() {
  fetch("https://shfe-diplom.neto-server.ru/alldata", {})
    .then((response) => response.json())
    .then((data) => {

      //console.log(data.result)

      //все залы

      let hallsForDelete = document.querySelectorAll('.main-content-section-sessions-hall');
      //console.log(hallsForDelete);
      //перетаскивание сеансов в корзину delete
      let dragged = null; // перемещенные данные
      //перебрать каждый зал
      hallsForDelete.forEach(hallDeleteFilm => {

        hallDeleteFilm.addEventListener("dragstart", (evt) => {
          dragged = evt.target;

          dragged.classList.add("selected");
        })

        //end
        hallDeleteFilm.addEventListener(`dragend`, (evt) => { evt.target.classList.remove(`selected`); });

        //все корзины
        let basketsDelete = document.querySelectorAll(".basket-delete");

        basketsDelete.forEach((basket) => {
          // console.log(basket);
          basket.addEventListener(`dragleave`, (evt) => {
            evt.target.classList.remove('hover');
          });
          basket.addEventListener(`dragover`, (evt) => {

            evt.preventDefault();
            evt.target.classList.add('hover');

            // Находим перемещаемый элемент
            const activeElement = hallDeleteFilm.querySelector(`.selected`);

            // Находим элемент, над которым в данный момент находится курсор
            const currentHall = evt.target;

            const isMoveable = activeElement !== currentHall && currentHall.classList.contains("main-content-section-sessions-hall-net");

            // Если нет, прерываем выполнение функции
            if (!isMoveable) {
              return;
            }
          });

          //console.log(basket);
          basket.addEventListener("drop", (evt) => {

            evt.target.classList.remove('hover');
            if (evt.dataTransfer.getData("title") != '') {
              return false;
            }
            evt.preventDefault();
            $.fancybox.open({
              src: "#specifyMovie",
              type: "inline",
              smallBtn: false,
              toolbar: false,
            });

            let seanceId = dragged.getAttribute("data-seance-id");

            let draggedTitle = dragged.querySelector('.main-content-section-sessions-hall-net-movie');

            let question = document.getElementById('cancelFilm');

            question.innerHTML = "";

            let draggedName = "";
            draggedName += ` <div class="main-content-add-item-hall">
              Вы действительно хотите снять с сеанса фильм "${draggedTitle.textContent}"?
            </div>`
            question.innerHTML = draggedName;

            //console.log(seance.id)
            let delMovie = document.getElementById('MovieDel');
            delMovie.addEventListener('click', e => {
              e.preventDefault();

              fetch("https://shfe-diplom.neto-server.ru/seance/" + seanceId, {
                method: "DELETE",
              })
                .then((response) => response.json())
                .then((data) => {
                  //console.log(data);
                  if (data.success) {
                    dragged.closest(".main-content-section-sessions-item-prev").remove();

                  }
                });
              $.fancybox.close();
            })

            let cancelRemove = document.getElementById('cancelRemove');
            cancelRemove.addEventListener("click", () => document.location.reload());

          });

        })
      })

    })
}
openHall();

function openHall() {
  fetch("https://shfe-diplom.neto-server.ru/alldata", {})
    .then((response) => response.json())
    .then((data) => {
      updateHall();
      updateaddHalls();

      let list = document.querySelector(".open-hall-list");
      // console.log(list)
      list.innerHTML = "";

      data.result.halls.forEach((hall) => {
        list.innerHTML += `<button class="main-content-section-price-hall-item open-hall-item" data-hall-id=${hall.id}>${hall.hall_name}</button>`;
      });

      // Выбрали зал
      let hallBtns = document.querySelectorAll(".open-hall-item");
      //console.log(hallBtns);
      hallBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          let selectedHall = document.querySelector(".active");
          if (selectedHall) {
            selectedHall.classList.remove("active");
          }
          btn.classList.add("active");
        });

      });

      let openHall = document.getElementById('openHall');
      openHall.addEventListener('click', e => {
        e.preventDefault();
        let activeHall = document.querySelector(".main-content-section-price-hall-item.open-hall-item.active");

        // console.log(activeHall);
        if (activeHall == null) {
          alert("Не выбран зал!");
          return false;
        }

        let idActiveHall = activeHall.getAttribute('data-hall-id');

        let paramsOpen = new FormData()
        paramsOpen.set('hallOpen', '1')
        fetch('https://shfe-diplom.neto-server.ru/open/' + idActiveHall, {
          method: 'POST',
          body: paramsOpen
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Зал открыт!')
            }

          });
      })

    });
}
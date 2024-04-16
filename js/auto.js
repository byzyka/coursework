const form = document.querySelector(".main-content-form");
const mailInput = document.querySelector('.main-content-form-group-mail-input');
const passInput = document.querySelector('.main-content-form-group-password-input');



form.addEventListener("submit", (e) => {
  e.preventDefault();
 let login = new FormData;
 login.set('login', mailInput.value);
 login.set('password', passInput.value);
  

  
  fetch("https://shfe-diplom.neto-server.ru/login", {
    method: "POST",
    body: login, 
  })
    .then((response) => response.json())
    .then((response) => {
    //console.log(response);
     
    if(response.success == true) {
     //alert('Авторизация пройдена успешно!');
      localStorage.setItem('admin', true);
      window.location.href = "../admin/index.html";
      
    } else {
      alert(response.error);
      
    }
   
    })
  })
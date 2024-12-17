$(document).ready(function () {
    if (localStorage.getItem("token")!=null) {
        document.getElementById("login").setAttribute("hidden", "hidden")//remove login feature to prevent user logging in when already logged in
        document.getElementById("Account").removeAttribute("hidden") // add account tab for user to change account details now that they are logged in
      }
    }); //when HTML is ready...carry out function 
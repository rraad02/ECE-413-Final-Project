$(document).ready(function () {
if (localStorage.getItem("token")!=null) {
    document.getElementById("login").setAttribute("hidden", "hidden")//remove login feature to prevent user logging in when already logged in
    document.getElementById("Account").removeAttribute("hidden") // add account tab for user to change account details now that they are logged in
  }
}); //when HTML is ready...carry out function 

$(document).ready(function () {
    $('#btnLogOut').on('click', function() {
        logout();
    });
}); //when HTML is ready...carry out function 

function logout() {
    localStorage.removeItem("token"); //remove token AUTH
    localStorage.removeItem("currentuser")
    document.getElementById("Account").setAttribute("hidden", "hidden") //remove account info HTML
    document.getElementById("login").removeAttribute("hidden") //add back login function now that user is logged out
    window.location.replace("index.html"); //return user to home page
    window.alert("logout successful"); //alert user logout was successful 
}

$(document).ready(function () {
    $('#changePassword').on('click', function() {
        changepassword();
    });
});// when HTML is ready... carry out function 

function changepassword() {
    window.location.replace("changepassword.html");//switch to change password page
}


$(document).ready(function () {
    $('#addDevice').on('click', function() {
        adddevice();
    });
});// when HTML is ready... carry out function 

function adddevice() {
    window.location.replace("adddevice.html");//switch to add device page
}

$(document).ready(function () {
    $('#removeDevice').on('click', function() {
        removedevice();
    });
});// when HTML is ready... carry out function 

function removedevice() {
    window.location.replace("removedevice.html");//switch to add device page
}
$(document).ready(function () {
    if (localStorage.getItem("token")!=null) {
        document.getElementById("login").setAttribute("hidden", "hidden")//remove login feature to prevent user logging in when already logged in
        document.getElementById("Account").removeAttribute("hidden") // add account tab for user to change account details now that they are logged in
      }
    }); //when HTML is ready...carry out function 




$(document).ready(function () {
    $('#btnSignUp').on('click', function() {
        signup();
    });
});//when HTML is ready... carry out function 


function signup() {
   
    //temp variables for ensuring Strong password 
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;


    if ($('#username').val() === "") {
        window.alert("invalid username!");
        return;
    }//empty username field 
    if ($('#password').val() === "") {
        window.alert("invalid password");
        return;
    }//empty password field 

    if ($('#password').val().match(lowerCaseLetters) == null) {
        window.alert("need at least one lowercase letter")
        return;
    }//lack of lowercase letter

    if ($('#password').val().match(upperCaseLetters) == null) {
        window.alert("need at least one uppercase(capital) letter")
        return;
    }//lack of uppercase letter

    if ($('#password').val().match(numbers) == null) {
        window.alert("need at least one number")
        return;
    }//lack of number 

    if ($('#password').val().length <8) {
        window.alert("must contain at least 8 characters")
        return;
    }//not long enough password 

    let txdata = {
        username: $('#username').val(),
        password: $('#password').val()
    };//pass entered username and password for account creation 
    $.ajax({
        url: '/accounts/create', //route for account creation 
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data) {
        $('#signupmessage').html(data.message)  
    })//successful creation, alert user 

    .fail(function () {
        $('#signupmessage').html("account creation failed")  
    });//failed creation, alert user 
}


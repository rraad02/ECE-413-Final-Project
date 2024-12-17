




$(document).ready(function () {
    $('#btnLogIn').on('click', function() {
        login();
    });
});//when HTML is ready... carry out function 


function login() {
   
    
    let txdata = {
        username: $('#username').val(),
        password: $('#password').val()
    };//data to pass to mongo route 
    $.ajax({
        url: '/accounts/logIn', //login route
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data) {//successful login 
        document.getElementById("login").setAttribute("hidden", "hidden")//remove login feature to prevent user logging in when already logged in
        document.getElementById("Account").removeAttribute("hidden") // add account tab for user to change account details now that they are logged in
        localStorage.setItem("currentuser", data.username) // set current username to currently logged in user for account change operations 
        localStorage.setItem("token", data.token);//set token for AUTH now that successfully logged in
        $('#loginmessage').html(data.message) //alert user of success 
        
    })

    .fail(function () {
        $('#loginmessage').html("login failed, please try again")  
    });//login failed, alert user 
}



$(document).ready(function () {
    $('#changepassword').on('click', function() {
        changepassword();
    });
}); //when HTML is ready carry out change password function


function changepassword() {
   
    //temp variables for ensuring Strong password
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;


    
    if ($('#newpassword').val() === "") {
        window.alert("invalid password");
        return;
    } //if empty password return error 

    if ($('#newpassword').val().match(lowerCaseLetters) == null) {
        window.alert("need at least one lowercase letter")
        return;
    }// if no lower case return error 

    if ($('#newpassword').val().match(upperCaseLetters) == null) {
        window.alert("need at least one uppercase(capital) letter")
        return;
    }//if no capital return error 

    if ($('#newpassword').val().match(numbers) == null) {
        window.alert("need at least one number")
        return;
    }//if no number return error 

    if ($('#newpassword').val().length <8) {
        window.alert("must contain at least 8 characters")
        return;
    }//if not long enough return error 

    let txdata = { //carry out if no errors with password
        password: $('#newpassword').val(),
        currentuser: localStorage.getItem("currentuser")
    }; //data to POST: send new password 
    $.ajax({
        url: '/accounts/changepassword', //route for updating password
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data) { //if succesfully changed, alert user and return to account page 
        window.location.replace("account.html");
        window.alert("password changed successfully")
    })

    .fail(function () { // if error changing, alert user 
        $('#passwordmessage').html("password change failed")  
    });
}


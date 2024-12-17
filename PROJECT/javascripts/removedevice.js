$(document).ready(function () {
    $('#remove').on('click', function() {
       removing();
    });
}); //when HTML is ready carry out change password function

function removing() {

    if ($('#removename').val() === "") {
        window.alert("invalid device name");
        return;
    } //if empty  
   

    let txdata = { //carry out if no errors with device
        removename: $('#removename').val(),
        currentuser: localStorage.getItem("currentuser")
    }; //data to POST: send new device

    $.ajax({
        url: '/accounts/removedevice', //route for adding device
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data) { //if succesfully changed, alert user and return to account page 
        window.location.replace("account.html");
        window.alert("device removed successfully")
    })

    .fail(function () { // if error changing, alert user 
        $('#removedevicemessage').html("remove device failed")  
    });

}
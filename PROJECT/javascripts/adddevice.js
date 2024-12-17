$(document).ready(function () {
    $('#add').on('click', function() {
        adding();
    });
}); //when HTML is ready carry out change password function

function adding() {

    if ($('#devicename').val() === "") {
        window.alert("invalid device name");
        return;
    } //if empty  

    if ($('#deviceid').val() === "") {
        window.alert("invalid device id");
        return;
    } //if empty 

    let txdata = { //carry out if no errors with device
        devicename: $('#devicename').val(),
        deviceid: $('#deviceid').val(),
        currentuser: localStorage.getItem("currentuser")
    }; //data to POST: send new device

    $.ajax({
        url: '/accounts/adddevice', //route for adding device
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data) { //if succesfully changed, alert user and return to account page 
        window.location.replace("account.html");
        window.alert("device added successfully")
    })

    .fail(function () { // if error changing, alert user 
        $('#adddevicemessage').html("add device failed")  
    });

}
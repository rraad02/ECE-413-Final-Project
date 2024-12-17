
//insert change of frequency of data readings and define time of day ranges (functionally)
// Function to display the fetched data
// function displayData(feeds) {
//   console.log(feeds)
//   feeds.feeds.forEach(feed => {
//     console.log("time:"+ feed.created_at + "data:" + feed.field1 + "and" + feed.field2)
//   })
// }


const url = "https://api.thingspeak.com/channels/2785234/feeds.json?api_key=Q2EY9424X2IYPHI1&results=25"
let hrChart = null
let boChart = null

$(document).ready(function() {

if (localStorage.getItem("token")!=null) {
  document.getElementById("login").setAttribute("hidden", "hidden")//remove login feature to prevent user logging in when already logged in
  document.getElementById("Account").removeAttribute("hidden") // add account tab for user to change account details now that they are logged in
}


if (localStorage.getItem("token") == null) {
  window.alert("You must login to view this page");
  window.location.replace("login.html")
}

else {
  fetchData();
  async function fetchData() {
        const response = await fetch(url);
        if (!response.ok) {
            window.alert('Network response was not ok');
        }
        let data = await response.json(); //100 recent readings
        submitData(data.feeds)
        
  }
}
})



function submitData(data) {
  let txtdata = {
    data: data,
    currentuser: localStorage.getItem("currentuser")
  }
  $.ajax({
    url: '/accounts/data', //login route
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(txtdata),
    dataType: 'json'
    })
.done(function (data) {//successful login 
    console.log("data submitted for account")
    displayWeekly()
    })

.fail(function () {
    $('#fetchdatamessage').html("error retrieving sensor data")  
    });//data fetch failed, alert user
}

function displayWeekly() { //average, minimum, and maximum heart rate in past 7 days.

  let data = {currentuser: localStorage.getItem("currentuser")}

  $.ajax({
    url: '/accounts/weekly', //login route
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    dataType: 'json'
})
  .done(function (data, textStatus, jqXHR) {//successful login 
    $("#average").html("Average Heart Rate: " + data.avgHeartRate );
    $("#minimum").html("Minimum Heart Rate: " + data.minHeart );
    $("#maximum").html("Maximum Heart Rate: " + data.maxHeart );
})
  .fail(function (data, textStatus, errorThrown) {
    $('#fetchdatamessage').html("error displaying weekly data")  
});//data fetch failed, alert user

}


$(document).ready(function () {
  $('#getdaily').on('click', function() {
      displayDaily();
  });
});//when HTML is ready... carry out function 



function displayDaily() { //horizontal axis- time of day | vertical axis- measurement (heartrate or blood oxygen saturation) | max min value displayed | time of day and frequency fields 
  let data = {currentuser: localStorage.getItem("currentuser"),
    date: $('#date').val() //in format 2024-12-03
  }

  $.ajax({
    url: '/accounts/daily', //login route
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    dataType: 'json'
})
  .done(function (data, textStatus, jqXHR) {//successful login 
    //returning arrays of -> data.times data.hrvalues data.bovalues
    

    displayHeartRate(data.times, data.hrvalues)
    displayBloodOxygen(data.times, data.bovalues)
})
  .fail(function (data, textStatus, errorThrown) {
    $('#fetchdatamessage').html("error displaying daily data")  
});//data fetch failed, alert user

}

function displayHeartRate(time, values) {
  const ctx = document.getElementById('hrChart').getContext('2d');
  if (hrChart) {
    // If the chart exists, update its data and re-render it
    hrChart.data.labels = time;
    hrChart.data.datasets[0].data = values;
    hrChart.update(); // Re-render the chart
  } else {
    // If the chart doesn't exist, create a new one
    hrChart = new Chart(ctx, {
      type: 'line', // Line chart
      data: {
        labels: time, // X-axis labels
        datasets: [{
          label: 'Heart Rate Graph', // Chart label
          data: values, // Y-axis data
          borderColor: 'rgba(75, 192, 192, 1)', // Line color
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill under the line
          borderWidth: 2, // Line thickness
          tension: 0.4, // Smooth line curve
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Heart Rate'
            }
          }
        }
      }
    });
  }
}

function displayBloodOxygen(time, values) {
  const ctx = document.getElementById('boChart').getContext('2d');
  if (boChart) {
    // If the chart exists, update its data and re-render it
    boChart.data.labels = time;
    boChart.data.datasets[0].data = values;
    boChart.update(); // Re-render the chart
  } else {
    // If the chart doesn't exist, create a new one
    boChart = new Chart(ctx, {
      type: 'line', // Line chart
      data: {
        labels: time, // X-axis labels
        datasets: [{
          label: 'Blood Oxygen Graph', // Chart label
          data: values, // Y-axis data
          borderColor: 'rgba(75, 192, 192, 1)', // Line color
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill under the line
          borderWidth: 2, // Line thickness
          tension: 0.4, // Smooth line curve
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Blood Oxygen'
            }
          }
        }
      }
    });
  }
}






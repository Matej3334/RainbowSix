
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.getElementsByClassName("widget-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", sendReport);
    }

    function sendReport(event) {
        switchBtns(false);
        const reportType = event.currentTarget.innerText;
        const trafficBtn = ["Traffic Jam", "Stau", "Prometni Zamašek", "交通堵塞"];
        const roadworkBtn = ["Road Work Ahead", "Baustelle Voraus", "Cestna Dela Naprej", "前方道路施工"];
        const obstacleBtn = ["Obstacle On The Road", "Hindernis Auf Der Straße", "Ovira Na Cesti", "道路上有障碍物"];
        const roadClosedBtn = ["Road Closed", "Straße Gesperrt", "Cesta Zaprta", "道路封闭"];
        const policeControl = ["Police Control", "Polizeikontrolle", "Policijski Nadzor", "警察检查"];

        if (trafficBtn.includes(reportType)){
            SendRequest(1);
        }
        else if (roadworkBtn.includes(reportType)){
            SendRequest(2);
        }
        else if (obstacleBtn.includes(reportType)){
            SendRequest(3);
        }
        else if (roadClosedBtn.includes(reportType)){
            SendRequest(4);
        }
        else if (policeControl.includes(reportType)){
            SendRequest(5);
        }
    }
});

function SendRequest(type_id) {
  showAlert("info");
  navigator.geolocation.getCurrentPosition(success, error);

  async function success(pos) {
    const ID = type_id;
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const apiUrl = "https://api.thingspeak.com/channels/2966525/feeds.json";
    const accuracy = pos.coords.accuracy;
    const cooldown = 24;

    const valid = await validSignalRequest(apiUrl, lat, lng, ID);

    if(valid){
    try {
      const response = await fetch('/api/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type_id, lat, lng, accuracy }),
      });
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();

      if (json.success) {
        showAlert("success", `Update sent! Response: ${json.message}`);
        switchBtns(true);
      } else {
        showAlert("error", "[-] " + json.error);
        switchBtns(true);
      }
    } catch (err) {
      showAlert("error", "[-] " + err.message);
      switchBtns(true);
    } 
    }
     else {
            showAlert("error", "[-] A Signal Of The Specified Type Already Exists In Your Proximity");
            switchBtns(true);
        }
  } 

  function error(err) {
        if (err.code === 1) {
            showAlert("error", "[-] Please Allow Geolocation Access!");
            switchBtns(true);
        } else {
            showAlert("error", "[-] Cannot Get Current Location!");
            switchBtns(true);
        }
    }
}


async function validSignalRequest(api_url, lat, lng, type_id) {
    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.feeds || !Array.isArray(data.feeds)) {
            console.warn("Invalid feed data structure");
            return true; // Allow signal if data is invalid
        }

        for (let i = 0; i < data.feeds.length; i++) {
            // Skip if fields are invalid
            if (
                isNaN(parseFloat(data.feeds[i].field3)) ||
                isNaN(parseFloat(data.feeds[i].field4)) ||
                isNaN(parseFloat(data.feeds[i].field5))
            ) {
                console.warn("Skipping invalid feed:", data);
                continue; 
            }

            if (type_id != data.feeds[i].field3) {
                continue; 
            }

            const isInside = isPointInRadius(lat, lng, data.feeds[i].field4, data.feeds[i].field5, 25);
            if (isInside) {
                console.log("Blocking signal: Duplicate within radius.");
                return false; 
            }
        }

        return true;
    } catch (error) {
        console.error("Error in validSignalRequest:", error);
        showAlert("error", "[-] " + error.message);
        return true; 
    }
}

function isPointInRadius(yourLat, yourLng, pointLat, pointLng, radiusMeters) {
    const yourLocation = L.latLng(yourLat, yourLng);
    const targetPoint = L.latLng(pointLat, pointLng);

    const distance = yourLocation.distanceTo(targetPoint);

    return distance <= radiusMeters;
}

function showAlert(type, err_msg = "[-] ERROR") {
    const alerts = document.getElementById("alert-container");
    
    const allAlertElements = alerts.querySelectorAll('.alert');
    allAlertElements.forEach(alert => {
        alert.hidden = true;
    });
    
    let alertToShow = null;
    if (type === "error") {
        if (err_msg.includes("Geolocation")) {
            alertToShow = alerts.querySelector('.alert.error.geo');
        } 
        else if (err_msg.includes("Proximity")) {
            alertToShow = alerts.querySelector('.alert.error.prox');
        } 
        else {
            alertToShow = alerts.querySelector('.alert.error:not(.prox):not(.geo)');
            if (alertToShow) {
                alertToShow.innerText = err_msg;
            }
        }
    } 
    else {
        alertToShow = alerts.querySelector(`.alert.${type}`);
    }
    
    if (alertToShow) {
        alertToShow.hidden = false;
    }
}

function switchBtns(on) {
    const btns = document.getElementsByTagName("button");
    for (let i = 0; i < btns.length; i++) {
        if (on) { btns[i].disabled = false; }
        else { btns[i].disabled = true; }
    }
}

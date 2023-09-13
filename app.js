//
// Der ServiceWorker
//

 Diese Zeilen zu Testzwecken auskommentieren, aber Push-Notifications funktionieren dann nicht mehr:
 if ("serviceWorker" in navigator) {
     navigator.serviceWorker.register("sw.js").then(registration => {
         console.log("SW Registered");
         console.log(registration);
     }).catch(error => {
         console.log("SW Registration failed");
         console.log(error);
     })
 } else {
     console.log("SW-registration not possible");
 }

//
// Hilfsfunktionen
//

Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
});

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * hour));
    return this;
}

Date.prototype.addMinutes = function (min) {
    this.setTime(this.getTime() + (min * minute));
    return this;
}


//
// EventListener
//

document.querySelector('#activateCountdown').addEventListener('click', function (event) {
    event.preventDefault();
    const dateControl = document.getElementById("newAlarmDate").value;
    const timeControl = document.getElementById("newAlarmTime").value;

    gapBeginning = null;
    localStorage.removeItem("beginningGap");

    const testDate = new Date(dateControl + ' ' + timeControl);
    initializeCountdown(testDate);
});

document.querySelector('#activateCountdown2').addEventListener('click', function (event) {
    event.preventDefault();
    const hours = document.getElementById("hours").value;
    const minutes = document.getElementById("minutes").value;

    let newDate = new Date();
    newDate.addHours(hours);
    newDate.addMinutes(minutes);
    newDate.setSeconds(0);

    gapBeginning = null;
    localStorage.removeItem("beginningGap");
    initializeCountdown(newDate);
});

document.querySelector('#resetCountdown').addEventListener('click', function (event) {

    event.preventDefault();
    localStorage.removeItem("savedDate");
    console.log("Gespeichertes Datum zurückgesetzt!");
    alarmDate = defaultDate;
    newEndTime = true;
    programJustStarted = true;
});

document.querySelector('#notification_always').addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("pushNotificationSetting", 'always');
    }
})

document.querySelector('#notification_reduced').addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("pushNotificationSetting", 'reduced');
    }
})

document.querySelector('#notification_end').addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("pushNotificationSetting", 'end');
    }
})

document.querySelector('#alarm').addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("alarmFeatureActivated", true);
    } else {
        localStorage.setItem("alarmFeatureActivated", false);
    }
})


//
// Initialisierung des Programms
//

function initializeCss() {
    document.getElementById("myCountdownPanel").style.width = "0%";
    document.getElementById("myOptionsPanel").style.width = "0%";
    document.getElementById("myInfoPanel").style.width = "0%";
}

function initializeInput() {

    var defaultDate = new Date();

    defaultDate = defaultDate.addHours(2);
    defaultDate.setMinutes(0);

    document.getElementById("newAlarmDate").value = (defaultDate.getFullYear() + '-' + padTo2Digits(defaultDate.getMonth() + 1) + '-' + padTo2Digits(defaultDate.getDate()));
    document.getElementById("newAlarmTime").value = (padTo2Digits(defaultDate.getHours()) + ':' + padTo2Digits(defaultDate.getMinutes()));
}

function initializeCountdown(testDate) {

    alarmDate = testDate;
    console.log("Alarm gesetzt auf: " + alarmDate);
    localStorage.setItem("savedDate", alarmDate);
    console.log("... und gespeichert.");
    update = true;
    endReached = false;
    newEndTime = true;
    alarmingTimesRemaining = alarmingTimes;
}

function initializeApp() {
    // Benachrichtigungen
    if (localStorage.getItem("pushNotificationSetting") === null) {
        console.log("Keine gespeicherte pushNotificationSetting vorhanden!");
        localStorage.setItem("pushNotificationSetting", 'always'); // Standard: 'always', falls nicht gespeichert
    }

    // Weckerfunktion
    if (localStorage.getItem("alarmFeatureActivated") === null) {
        console.log("Keine gespeicherte alarmFeatureActivated vorhanden!");
        localStorage.setItem("alarmFeatureActivated", false); // Standard: 'false', falls nicht gespeichert
    }

    // Steuerelemente initial setzen
    if (localStorage.getItem("pushNotificationSetting").match("always")) {
        document.getElementById("notification_always").checked = true;
    } else if (localStorage.getItem("pushNotificationSetting").match("reduced")) {
        document.getElementById("notification_reduced").checked = true;
    } else { // notification_end
        document.getElementById("notification_end").checked = true;
    }

    if (localStorage.getItem("alarmFeatureActivated").match(true)) {
        document.getElementById("alarm").checked = true;
    }
}


//
// programmeigene Funktionen
//

function openNav() {
    const datepickerPanel = document.getElementById("myCountdownPanel");
    const optionsPanel = document.getElementById("myOptionsPanel");
    const infoPanel = document.getElementById("myInfoPanel");
    if (datepickerPanel.style.width == "0%") {
        datepickerPanel.style.width = "80%";
    } else {
        datepickerPanel.style.width = "0%";
    }
    if (optionsPanel.style.width != "0%") {
        optionsPanel.style.width = "0%";
    }
    if (infoPanel.style.width != "0%") {
        infoPanel.style.width = "0%";
    }
}

function closeNav() {
    document.getElementById("myCountdownPanel").style.width = "0%";
}

function openOptions() {
    const optionsPanel = document.getElementById("myOptionsPanel");
    const datepickerPanel = document.getElementById("myCountdownPanel");
    const infoPanel = document.getElementById("myInfoPanel");
    if (optionsPanel.style.width == "0%") {
        optionsPanel.style.width = "80%";
    } else {
        optionsPanel.style.width = "0%";
    }
    if (datepickerPanel.style.width != "0%") {
        datepickerPanel.style.width = "0%";
    }
    if (infoPanel.style.width != "0%") {
        infoPanel.style.width = "0%";
    }
}

function closeOptions() {
    document.getElementById("myOptionsPanel").style.width = "0%";
}

function openInfo() {
    const datepickerPanel = document.getElementById("myCountdownPanel");
    const optionsPanel = document.getElementById("myOptionsPanel");
    const infoPanel = document.getElementById("myInfoPanel");
    if (infoPanel.style.width == "0%") {
        infoPanel.style.width = "80%";
    } else {
        infoPanel.style.width = "0%";
    }
    if (datepickerPanel.style.width != "0%") {
        datepickerPanel.style.width = "0%";
    }
    if (optionsPanel.style.width != "0%") {
        optionsPanel.style.width = "0%";
    }
}

function closeInfo() {
    document.getElementById("myInfoPanel").style.width = "0%";
}

function displayNotification(message) {
    console.log("Push-Notification!");
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function (reg) {
            var options = {
                body: message,
                icon: 'images/maskable_icon_x192.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                }
            };
            reg.showNotification('Achtung!', options);
        });
    }
}

function startAnimation() {
    var x = document.getElementById("Remaining");
    x.style.color = "Red";

    // trigger reflow
    document.querySelector('.Remaining').offsetWidth;

    // add animation again
    document.querySelector('.Remaining').style.animation = 'blinker 1.5s linear infinite';
}

function stopAnimation() {
    // remove animation 
    document.querySelector('.Remaining').style.animation = 'none';

    // trigger reflow
    document.querySelector('.Remaining').offsetWidth;

    var x = document.getElementById("Remaining");
    x.style.color = "Black";
    x.style.opacity = 1;
}

function padTo2Digits(num) {
    return String(num).padStart(2, '0');
};


//
// Die Hauptfunktion
//

function countdown() {
    // Berechnung der Differenz
    const countDate = alarmDate;
    const today = new Date();
    const now = today.getTime();
    const gap = (countDate.getTime()) - now;
    const gapDate = new Date((countDate - today));

    if (gapBeginning == null) {
        gapBeginning = gap;
        localStorage.setItem("beginningGap", gapBeginning);
    }
    // Konstante für die Zeitverschiebung:
    const timeShift = today.getTimezoneOffset();
    // Anzeige der aktuellen Uhrzeit
    const nowHours = Math.floor((now % day) / hour);
    const nowMinutes = Math.floor((now % hour) / minute);
    const nowSeconds = Math.floor((now % minute) / second);

    document.querySelector('.Clock').innerText = padTo2Digits((nowHours - (timeShift / 60))) + ":" + padTo2Digits(nowMinutes) + ":" + (padTo2Digits(nowSeconds)) + " Uhr";

    // Anzeige des Alarmzeitpunktes
    if (newEndTime) {
        document.querySelector('.End').innerText = "Ende: " + (padTo2Digits(alarmDate.getHours())) + ":" + (padTo2Digits(alarmDate.getMinutes())) + " Uhr";
        newEndTime = false;
    }

    if (gap > 0) {
        // Berechnung der übrigen Zeit
        const remainingHours = Math.floor(Math.abs(alarmDate - today) / 36e5);
        const remainingMinutes = Math.floor((gap % hour) / minute);
        // ProgressBar
        if (gapBeginning != null && gapBeginning != 0) {
            /*
            p=W*100/G;
            */
            const percentage = (((gapBeginning - gap) * 100) / gapBeginning);
            document.getElementById("myBar").style.width = percentage + '%';
        }

        if (savedMinutes != remainingMinutes) {
            savedMinutes = remainingMinutes;
            update = true;
        }

        if (update == true) {

            console.log("Update wird durchgeführt");

            if (remainingHours > 0) {

                if ((remainingMinutes == 59)) {
                    message = ("noch: " + (remainingHours + 1) + " h " + " 00" + " min");
                    document.querySelector('.Remaining').innerText = message;

                } else {
                    message = ("noch: " + (remainingHours) + " h " + (padTo2Digits((remainingMinutes + 1))) + " min");
                    document.querySelector('.Remaining').innerText = message;
                }

                if (((remainingMinutes + 1) % 15) == 0) { // Blinken + Farbe ändern + Push-Notification:
                    if (localStorage.getItem("pushNotificationSetting").match("always")) {
                        displayNotification(message);
                    } else if (((remainingMinutes + 1) % 60) == 0 && localStorage.getItem("pushNotificationSetting").match("reduced")) {
                        displayNotification(message);
                    }

                    startAnimation();
                } else { // Blinken stoppen + Farbe ändern:
                    stopAnimation();
                }


            } else {
                message = ("noch: " + (remainingMinutes + 1) + " min");
                document.querySelector('.Remaining').innerText = message;

                if ((remainingMinutes + 1) == 1 || (remainingMinutes + 1) == 5 || (remainingMinutes + 1) == 10 || ((remainingMinutes + 1) % 15) == 0) { // Blinken + Farbe ändern + Push-Notification:
                    if (localStorage.getItem("pushNotificationSetting").match("always")) {
                        displayNotification(message);
                    }
                    startAnimation();
                } else { // Blinken stoppen + Farbe ändern:
                    stopAnimation();
                }
            }
            update = false;
        }

    } else {
        if (endReached == false) { // Blinken + Farbe ändern + Push-Notification:
            message = "Zeit abgelaufen";
            if (programJustStarted == false) {
                if (alarmGapRemaining == 0 || localStorage.getItem("alarmFeatureActivated").match(false)) {
                    displayNotification(message);
                }
            } else {
                alarmingTimesRemaining = 0;
            }
            console.log(message);
            document.getElementById("myBar").style.width = 100 + '%';
            document.querySelector('.Remaining').innerText = message;
            startAnimation();

            endReached = true;

            // Weckerfunktion
            if (localStorage.getItem("alarmFeatureActivated").match(true) && alarmingTimesRemaining > 1 && alarmGapRemaining == 0) {
                alarmingTimesRemaining--;
                endReached = false;
                alarmGapRemaining = alarmGap;
            } else if (alarmingTimesRemaining == 0) {
                alarmingTimesRemaining = alarmingTimes;
            } else if (alarmGapRemaining > 0) {
                endReached = false;
                alarmGapRemaining--;
            }
        }
    }
    if (programJustStarted == true) {
        programJustStarted = false;
    }
};


//
// Definieren des Standartdatums + Hilfsvariablen
//

const defaultDate = new Date(2022, 5 - 1, 30, 12, 0, 0, 0);
let alarmDate = defaultDate;
let gapBeginning = null;
let savedMinutes = null;
let update = true;
let endReached = false;
let newEndTime = true;
let message = "Diese Nachricht ist nie zu sehen";
let programJustStarted = true; // Zur Vermeidung von Spam beim Start


//
// Festlegung der Zeitkonstanten
//

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;


//
// Zusätzliche Konstanten & Variablen
//

const alarmingTimes = 5;
let alarmingTimesRemaining = alarmingTimes;
const alarmGap = 1;
let alarmGapRemaining = 0;

//
// Gespeicherte Daten laden
//

if (localStorage.getItem("beginningGap") === null) {
    console.log("Keine gespeicherte beginningGap vorhanden!")
} else {
    gapBeginning = localStorage.getItem("beginningGap");
}

if (localStorage.getItem("savedDate") === null) {
    console.log("Kein gespeichertes Datum vorhanden! :(");
} else {
    console.log("Gespeichertes Datum vorhanden! :)");
    const d1 = new Date(localStorage.getItem("savedDate"));
    alarmDate = d1;
}

initializeCss();
initializeInput();
initializeApp();
countdown();
setInterval(countdown, 1000);
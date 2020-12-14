var url = '';


var times = [];
var powerLevels = [];
var solarLevels = [];
var threshold = 30;
var predictions = [0, 0];
$().ready(() => {
    var ctx = document.getElementById('mainChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7],
            datasets: [{
                label: 'Current Power Usage',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [1, 4, 2, 3, 2]
            }, {
                label: 'Power Usage Predicted',
                borderColor: 'rgb(0,135,255)',
                backgroundColor: 'rgba(0,135,255, 0.2)',
                data: [0, 0, 2, 3, 2, 4, 1]
            }]
        },
        options: {}
    });
    $('.loader').animate({'width': '100vw'}, 1300, () => {
        $('.loader').width(0);
    });
});

function addVals(jsonobj) {
    if (times.length > threshold) {
        times.shift();
        powerLevels.shift();
        solarLevels.shift();
        predictions.shift();
    }
    var time = new Date(jsonobj.times);
    var seconds = time.getSeconds();
    var minutes = time.getMinutes();
    var hour = time.getHours();
    var str = hour + ":" + minutes + ":" + seconds;
    times.push(str);
    powerLevels.push(jsonobj.pow);
    solarLevels.push(jsonobj.sol);
    predictions.push(jsonobj.prd);
}

function setBatLevel(batlevel) {
    if (batlevel > 100 || batlevel < 0) return;
    var bat = document.getElementById("bat-lev");
    bat.innerHTML = batlevel + " %";
    var lev = document.getElementsByClassName("bat-level")[0];
    lev.style.width = `calc( ${batlevel} / 100 * 20vw)`;
    if (batlevel < 25) {
        lev.style.backgroundColor = "#ff6961";
    } else {
        lev.style.backgroundColor = "#eee";
    }
}

function showPowerHistory(modal) {
    var canvasID = 'historyCanvas';
    var html = `<h1>Power Usage History</h1><canvas id="${canvasID}" width="750" height="350"></canvas>`;
    $(`.${modal}`).html(html);

    var ctx = document.getElementById(canvasID).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7],
            datasets: [{
                label: 'Current Power Usage',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [1, 4, 2, 3, 2]
            }, {
                label: 'Power Usage Predicted',
                borderColor: 'rgb(0,135,255)',
                backgroundColor: 'rgba(0,135,255, 0.2)',
                data: [0, 0, 1, 3, 2, 4, 1]
            }]
        },
        options: {}
    });
}

function showBattery(modal) {
    var canvasID = 'batteryCanvas';
    var html = `<h1>Battery Usage Levels</h1><canvas id="${canvasID}" width="750" height="350"></canvas>`;
    $(`.${modal}`).html(html);
    var ctx = document.getElementById(canvasID).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5],
            datasets: [{
                label: 'Battery Level',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [100, 90, 94, 98, 88]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                    }
                }]
            }
        }
    });
}

function showThroughputHistory(modal) {
    var canvasID = 'throughCanvas';
    var html = `<h1>Throughput Levels</h1><canvas id="${canvasID}" width="750" height="350"></canvas>`;
    $(`.${modal}`).html(html);
    var ctx = document.getElementById(canvasID).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5],
            datasets: [{
                label: 'Throughput levels',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [100, -90, -94, -98, -88]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                    }
                }]
            }
        }
    });
}

function showEnergyHistory(modal) {
    var canvasID = 'energyCanvas';
    var html = `<h1>Generation Levels</h1><canvas id="${canvasID}" width="750" height="350"></canvas>`;
    $(`.${modal}`).html(html);
    var ctx = document.getElementById(canvasID).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5],
            datasets: [{
                label: 'Generation levels',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [100, 90, 94, 98, 88]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                    }
                }]
            }
        }
    });
}

function whereIsHome(modal) {
    animateOpenModal('hero', 700, 400);
    var html = '<h1 class="h1-middle">Where is Home?</h1><div class="text-middle"><input type="text" class="text home">';
    html += '<div class="whereshome"></div></div>';
    html += '<input type="submit" class="button" value="Go" onclick="FindHome()">';
    $(`.${modal}`).html(html);
}

function showAddDevice(modal) {
    var html = '<h1 class="h1-middle">Add a device</h1>';
    html += '<div class="text-middle">';
    html += '<input type="text" class="text" placeholder="IP Address"><br/><br />';
    html += '<select name="devtype" class="newdevtype text" placeholder="Device Type" style="height: 4rem;">';
    html += '<option value="1" selected>Monitor</option>';
    html += '<option value="2">Consumer</option>';
    html += '<option value="3">Generator</option>';
    html += '</select><br /> <br />'
    html += '<input type="text" class="text" placeholder="Friendly Name"></div>';
    html += '<input type="submit" class="button" value="Add" onclick="AddDev()">';
    $(`.${modal}`).html(html);
}

function FindHome() {
    var home = $('.home').val();
    $.ajax({
        url: (home + "/Hello"),
        type: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
        },
        // dataType: 'json',
        // crossOrigin: true,
        // crossDomain: true,
        success: function(res) {
            $('.whereshome').html("Connected!");
            url = home;
            $('.overlay').click();
        },
        error: function(res) {
            $('.whereshome').html('No one is here...');
        }
    });
}

function AddDev() {

}
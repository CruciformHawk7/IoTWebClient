var url = '';
var predThres = 5;
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

async function showPowerHistory(modal) {
    var data = await GetHistory();
    var times = [];
    var uses = [];

    for (var i = 0; i<data.length; i++) {
        d = new Date(data[i].Time);
        var s = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        times.push(s);
        uses.push(data[i].TotalUsage);
    }
    times.reverse();
    uses.reverse();

    var canvasID = 'historyCanvas';
    var html = `<h1>Power Usage History</h1><canvas id="${canvasID}" width="750" height="350"></canvas>`;
    $(`.${modal}`).html(html);

    var ctx = document.getElementById(canvasID).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Current Power Usage',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: uses
            }]
        },
        options: {}
    });
}

async function updateMainChart() {
    var data = await GetHistory();
    var times = [];
    var uses = [];
    var nums = [];
    var d;
    var pred = [];
    for (var i = 0; i<data.length; i++) {
        nums.push(i);
        d = new Date(data[i].Time);
        var s = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        times.push(s);
        uses.push(data[i].TotalUsage);
    }
    times.reverse();
    uses.reverse();
    var des = findLineByLeastSquares(nums, uses);
    for (var i = 0; i<predThres; i++) {
        d.setSeconds(d.getSeconds() + 1);
        var s = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        times.push(s);
        des[1].unshift(0);
    }
    var ctx = document.getElementById('mainChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Current Power Usage',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: uses
            }, {
                label: 'Power Usage Predicted',
                borderColor: 'rgb(0,135,255)',
                backgroundColor: 'rgba(0,135,255, 0.2)',
                data: des[1]
            }]
        },
        options: {}
    });
}

async function showBattery(modal) {
    var data = await GetHistory();
    var times = [];
    var uses = [];

    for (var i = 0; i<data.length; i++) {
        d = new Date(data[i].Time);
        var s = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        times.push(s);
        uses.push(data[i].BatteryLevel);
    }
    times.reverse();
    uses.reverse();


    var canvasID = 'batteryCanvas';
    var html = `<h1>Battery Usage Levels</h1><canvas id="${canvasID}" width="750" height="350"></canvas>`;
    $(`.${modal}`).html(html);
    var ctx = document.getElementById(canvasID).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Battery Level',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: uses
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

async function showThroughputHistory(modal) {
    var data = await GetHistory();
    var times = [];
    var uses = [];

    for (var i = 0; i<data.length; i++) {
        d = new Date(data[i].Time);
        var s = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        times.push(s);
        var p = data[i].TotalProduction - data[i].TotalUsage;
        uses.push(p);
    }
    times.reverse();
    uses.reverse();

    var canvasID = 'throughCanvas';
    var html = `<h1>Throughput Levels</h1><canvas id="${canvasID}" width="750" height="350"></canvas>`;
    $(`.${modal}`).html(html);
    var ctx = document.getElementById(canvasID).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Throughput levels',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: uses
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

async function showEnergyHistory(modal) {
    
    var data = await GetHistory();
    var times = [];
    var uses = [];

    for (var i = 0; i<data.length; i++) {
        d = new Date(data[i].Time);
        var s = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        times.push(s);
        uses.push(data[i].TotalProduction);
    }
    times.reverse();
    uses.reverse();

    var canvasID = 'energyCanvas';
    var html = `<h1>Generation Levels</h1><canvas id="${canvasID}" width="750" height="350"></canvas>`;
    $(`.${modal}`).html(html);
    var ctx = document.getElementById(canvasID).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Generation levels',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: uses
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
    var html = '<h1 class="h1-middle">Where is Home?</h1><div class="text-middle"><input type="text" value="http://192.168.0.104:3000" class="text home">';
    html += '<div class="whereshome"></div></div>';
    html += '<input type="submit" class="button" value="Go" onclick="FindHome()">';
    $(`.${modal}`).html(html);
}

function showAddDevice(modal) {
    var html = '<h1 class="h1-middle">Add a device</h1>';
    html += '<div class="text-middle">';
    html += '<input type="text" class="text" placeholder="IP Address" id="ipaddr"><br/><br />';
    html += '<select name="devtype" class="newdevtype text" id="type" placeholder="Device Type" style="height: 4rem;">';
    html += '<option value="Monitor" selected>Monitor</option>';
    html += '<option value="Consumer">Consumer</option>';
    html += '<option value="Generator">Generator</option>';
    html += '</select><br /> <br />'
    html += '<input type="text" class="text" placeholder="Friendly Name" id="friendly"></div>';
    html += '<input type="submit" class="button" value="Add" onclick="AddDev()">';
    $(`.${modal}`).html(html);
}

async function FindHome() {
    var home = url = $('.home').val();
    $.ajax({
        url: (home + "/Hello"),
        type: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
        },
        success: async function(res) {
            $('.whereshome').html("Connected!");
            $('.overlay').click();
            GetDevices();
            await updateMainChart();
        },
        error: function(res) {
            $('.whereshome').html('No one is here...');
        }
    });
}

function AddDev() {
    var ip = $('#ipaddr').val()
    var dt = $('#type :selected').text();
    var fn = $('#friendly').val();
    $.ajax({
        url: (home + "Add"),
        type: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
        },
        data: {
            "Friendly" : fn,
            "IP": ip,
            "DeviceType": dt
        }
    })
}

function GetDevices() {
    $.ajax({
        url: (url + "/GetDevices"),
        type: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
        },
        success: (res) => { 
            updateDevs(res); 
            setInterval(GetSummary, 1000);
        }
});

function GetSummary() {
    $.ajax({
        url: (url + "/GetSummary"),
        type: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
        },
        success: (res) => { updateVals(res); }
    })
}

function updateDevs(res) {
    res.forEach(e => {
        if (e.DeviceType == "Consumer") {
            var newContent = `<div class="card through" style="position: relative;">
                <h2>${e.Friendly}</h2>
                <h1 class="dev-${e.ID}">0 W</h1>
            </div>`
            $('.Devices').html($('.Devices').html() + newContent);
        }});
    }
}

function updateVals(res) {
    $('#max-lev').html(`${res[0].TotalUsage} W`);
    $('#bat-lev').html(`${res[0].BatteryLevel} W`);
    setBatLevel(res[0].BatteryLevel);
    $('#rew-level').html(`${res[0].TotalProduction} W`);
    var tr = res[0].TotalProduction - res[0].TotalUsage;
    if (tr < 0) $('#thr-lev').css('color', '#f00');
    else $('#thr-lev').css('color', '#0f0');
    $('#thr-lev').html(`${tr} W`);
    res[0].Measures.forEach(e => {
        $(`.dev-${e.ID}`).html(`${e.Measure} W`);
    });
}

async function GetHistory() {
    return await $.ajax({
        url: (url + "/GetHistory"),
        type: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
        },
        success: (res) => { return res; }
    });
}

function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v<values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];

    for (var v = 0; v<values_length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [result_values_x, result_values_y];
}
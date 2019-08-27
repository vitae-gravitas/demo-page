var ctx = document.getElementById('myChart');
var scatterChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Descent',
            data: [{
                x: 0,
                y: 10
            }, {
                x: 0.5,
                y: 9
            }, {
                x: -0.3,
                y: 8
            }, {
                x: -0.2,
                y: 7
            }, {
                x: 0.3,
                y: 6
            }, {
                x: 0.2,
                y: 5
            }, {
                x: 0.35,
                y: 4
            }, {
                x: -0.1,
                y: 3
            }, {
                x: -0.3,
                y: 2
            }, {
                x: -0.5,
                y: 1
            }]
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: -2,
                    max: 2
                },
                gridLines: {
                    display: false
                }
            }],
        }
    }
});

var ctx2 = document.getElementById('myChart2');
var scatterChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Ascent',
            data: [{
                x: 0,
                y: 10
            }, {
                x: 0.5,
                y: 9
            }, {
                x: 0.3,
                y: 8
            }, {
                x: 0.2,
                y: 7
            }, {
                x: 0.4,
                y: 6
            }, {
                x: 0.5,
                y: 5
            }, {
                x: 0.15,
                y: 4
            }, {
                x: -0.2,
                y: 3
            }, {
                x: -0.3,
                y: 2
            }, {
                x: -0.2,
                y: 1
            }]
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: -2,
                    max: 2
                },
                gridLines: {
                    display: false
                }
            }],
//            yAxes: [{
//                gridLines: {
//                    display: false
//                }
//            }]
        }
    }
});

var ctx3 = document.getElementById('myChart3');
var scatterChart2 = new Chart(ctx3, {
    type: 'line',
    data: {
        datasets: [{
            tension: 0,
            fill: false,
            label: 'Leg Position',
            data: [{
                x: 1.3,
                y: 5
            }, {
                x: -1.5,
                y: 5
            }, {
                x: 0.4,
                y: 0.2
            }]
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: -2,
                    max: 2
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: 0,
                    max: 6
                },
                gridLines: {
                    display: false
                }
            }]
        }
    }
});

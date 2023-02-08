var ctxBar = document.getElementById("barchar");
var data = {

    datasets: [{
        backgroundColor: 'red',
        borderColor: 'red',
        data: 5,
        hidden: true,
        label: 'D0'
    }, {
        backgroundColor: 'orange',
        borderColor: 'orange',
        data: 2,
        label: 'D1',
        fill: '-1'
    }, {
        backgroundColor: 'yellow',
        borderColor: 'yellow',
        data: 7,
        hidden: true,
        label: 'D2',
        fill: 1
    }, {
        backgroundColor: 'green',
        borderColor: 'green',
        data: 7,
        label: 'D3',
        fill: '-1'
    }, {
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: 3,
        label: 'D4',
        fill: '-1'
    }, {
        backgroundColor: 'grey',
        borderColor: 'grey',
        data: 6,
        label: 'D5',
        fill: '+2'
    }]
};
var options = {
    maintainAspectRatio: false,
    spanGaps: false,
    elements: {
        line: {
            tension: 0.000001
        }
    },
    scales: {
        yAxes: [{
            stacked: true
        }]
    },
    plugins: {
        filler: {
            propagate: false
        },
        samples_filler_analyser: {
            target: 'chart-analyser'
        }
    }
};
new Chart(ctxBar, {
    type: 'line',
    data: data,
    options: options
});
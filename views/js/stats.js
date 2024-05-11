let appStatsData;
let actions = ['AppStats', 'HeatMap', 'AppTimeline']

document.addEventListener('DOMContentLoaded', function() {
    // Get the test variable embedded in the data attribute
    appStatsData = JSON.parse(document.querySelector('[data-applicationStatsData]').getAttribute('data-applicationStatsData'));
    // Now you can use the testData variable as needed
    //- console.log(appStatsData);
    // You can perform any further operations with testData here
});

function resetBtnColor(currentAction) {
    const className = 'btn font-weight-bold mr-2 '
    for (let i = 0; i < actions.length; i++) {
        if (currentAction === actions[i]) {
            document.getElementById('display' + actions[i]).className = className + 'btn-primary'
        } else {
            document.getElementById('display' + actions[i]).className = className + 'btn-light'
        }
    }
}

function displayAppTimeline() {
    resetBtnColor('AppTimeline')
}

function displayHeatMap() {
    resetBtnColor('HeatMap')
}

function displayAppStats() {
    resetBtnColor('AppStats')

    const labels = ['Applied', 'Interview', 'Offer', 'Accepted', 'Declined', 'Rejected'];
    const datasets = []

    for (let i = 0; i < labels.length; i++) {
        const label = labels[i]

        let found = false
        for (let j = 0; j < appStatsData.length; j++) {
            if (appStatsData[j].Status === label) {
                found = true;
                datasets.push(appStatsData[j].Total)
                break;
            }
        }

        if (!found) {
            datasets.push(0)
        }

    }

    const ctx = document.getElementById('applicationStatsChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Applications',
                    data: datasets,
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1,
                    min: 0
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Application Statistics',
                    font: {
                        size: 20
                    }
                }
            }
        }
    });
}

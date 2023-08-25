// Utility functions
const parseExcelData = (excelData) => {
    // Parse the Excel data using a library like SheetJS
    // Return an object with parsed data (months, sales, revenue, expenses)
    const workbook = XLSX.read(excelData, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(worksheet);

    const months = [];
    const salesData = [];
    const revenueData = [];
    const expensesData = [];

    data.forEach((row) => { //month,sales,revenue,expenses need to be exactly the same as the header in excel
        months.push(row.month);
        salesData.push(row.sales);
        revenueData.push(row.revenue);
        expensesData.push(row.expenses);
    });

    return {
        months: months,
        sales: salesData,
        revenue: revenueData,
        expenses: expensesData
    };
};



// Higher-order function for creating line charts
const createLineChart = (chartType, xlabel, datasetLabels, datasets) => {
    const chartsContainer = document.getElementById('charts');
    const canvas = document.createElement('canvas');
    chartsContainer.innerHTML = '';
    chartsContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const chartData = {
        labels: xlabel,
        datasets: datasets.map((data, index) => ({
            label: datasetLabels[index],
            data: data,
            borderColor: getRandomColor(),
            fill: false
        }))
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values'
                }
            }
        }
    };

    new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

//Higher-order function for creating bar charts
const createBarChart = (xLabels, datasetLabels, datasets) => {
    const chartsContainer = document.getElementById('bar_charts');
    const canvas = document.createElement('canvas');
    chartsContainer.innerHTML = '';
    chartsContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const chartData = {
        labels: xLabels,
        datasets: datasets.map((data, index) => ({
            label: datasetLabels[index],
            data: data,
            backgroundColor: getRandomColor(),
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1
        }))
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values'
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
};

// Higher-order function for creating scatter plots
const createScatterPlot = (xlabel, ylabel, xData, yData, relation) => {
    const chartsContainer = document.getElementById(relation);
    const canvas = document.createElement('canvas');
    chartsContainer.innerHTML = '';
    chartsContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const chartData = {
        datasets: [{
            label: xlabel + ' vs ' + ylabel,
            data: xData.map((x, index) => ({ x: x, y: yData[index] })),
            backgroundColor: getRandomColor(),
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 8,
            showLine: false
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: xlabel
                }
            },
            y: {
                title: {
                    display: true,
                    text: ylabel
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'scatter',
        data: chartData,
        options: chartOptions
    });
};

const createScatterRegressPlot = (xlabel, ylabel, xData, yData, relation) => {
    const chartsContainer = document.getElementById(relation);
    const canvas = document.createElement('canvas');
    chartsContainer.innerHTML = '';
    chartsContainer.appendChild(canvas);

    const regressResult = timeRegressionAnalysis(xData, yData);

    const ctx = canvas.getContext('2d');

    const chartData = {
        datasets: [{
            label: `${ylabel} scatter plot`,
            data: xData.map((x, index) => ({ x: index, y: yData[index] })),
            backgroundColor: getRandomColor(),
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 8,
            showLine: false
        }, 
        {
            type: "line",
            label: `${ylabel} linear regression`,
            borderColor: getRandomColor(),
            data: regressResult[2],
            fill: false,
            trendlineLinear: {
                style: getRandomColor(),
                lineStyle: "dashed",
                width: 2,
            }
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: xlabel
                }
            },
            y: {
                title: {
                    display: true,
                    text: ylabel
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'scatter',
        data: chartData,
        options: chartOptions
    });
};

const timeRegressionAnalysis = (tData, yData) => {
    const numData = tData.length;
    const xData = Array.from({length: tData.length}, (_, i) => i);
    const xSum = xData.reduce((s, x) => s + x, 0);
    // Turn each month into array of 0, 1, 2, 3 to normalize the value
    const ySum = yData.reduce((s, x) => s + x, 0);
    const xySum = xData.map((v, i) => v * yData[i]).reduce((s, x) => s + x, 0);
    const xSqSum = xData.reduce((s, x) => Math.pow(x, 2) + s, 0);
    const xSumSq = Math.pow(xSum, 2);

    const slope = ( numData * xySum - xSum * ySum ) / ( numData * xSqSum - xSumSq );
    const intercept = ( xSqSum * ySum - xSum * xySum ) / ( numData * xSqSum - xSumSq );

    const result = Array.from(xData, (v) => {
        return {x: v, y: slope*v + intercept}
    });

    return [slope, intercept, result];
}

const correlationAnalysis = (xData, yData) => {
    const numData = xData.length;
    const xSum = xData.reduce((s, x) => s + x, 0);
    const ySum = yData.reduce((s, x) => s + x, 0);
    const xySum = xData.map((v, i) => v * yData[i]).reduce((s, x) => s + x, 0);
    const xSqSum = xData.reduce((s, x) => Math.pow(x, 2) + s, 0);
    const ySqSum = yData.reduce((s, x) => Math.pow(x, 2) + s, 0);
    const xSumSq = Math.pow(xSum, 2);
    const ySumSq = Math.pow(ySum, 2)

    const correlation = ( numData * xySum - xSum * ySum ) / Math.pow((( numData * xSqSum - xSumSq ) * ( numData * ySqSum - ySumSq )), 0.5);

    return correlation;
}


// Event listener for input
document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyze-button');
    const fileInput = document.getElementById('file-input');
    const chartsContainer = document.getElementById('charts');
    const correlationContainer = document.getElementById('correlation-data');
    
    analyzeButton.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('analysis-section').removeAttribute('hidden');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                event.preventDefault();
                const excelData = event.target.result;
                const parsedData = parseExcelData(excelData);

                const months = parsedData.months;
                const salesData = parsedData.sales;
                const revenueData = parsedData.revenue;
                const expensesData = parsedData.expenses;

                // Display analysis results
                chartsContainer.innerHTML = '';
                correlationContainer.innerHTML = '';
                // Display analysis results for testing returned array of object
                const parsedDataContainer = document.getElementById('testing');
                parsedDataContainer.innerHTML = `
                    <p>Months: ${parsedData.months}</p>
                    <p>Sales: ${parsedData.sales}</p>
                    <p>Revenue: ${parsedData.revenue}</p>
                    <p>Expenses: ${parsedData.expenses}</p>
                `;

                // Create charts
                createLineChart('line', months, ['Sales', 'Revenue', 'Expenses'], [salesData, revenueData, expensesData]);
                createScatterRegressPlot('Time Unit', 'Sales', months, salesData, 'regress-chart-sales')
                createScatterRegressPlot('Time Unit', 'Revenue', months, revenueData, 'regress-chart-revenue')
                createScatterRegressPlot('Time Unit', 'Expenses', months, expensesData, 'regress-chart-expenses')
                createBarChart(months, ['Sales', 'Revenue', 'Expenses'], [salesData, revenueData, expensesData]);
                createScatterPlot('Sales', 'Revenue', parsedData.sales, parsedData.revenue,'scatter_svr');
                createScatterPlot('Expenses', 'Revenue', parsedData.expenses, parsedData.revenue,'scatter_evr');
                createScatterPlot('Sales', 'Expenses', parsedData.sales, parsedData.expenses,'scatter_sve');
            };

            reader.readAsArrayBuffer(file);
        }
        
    });
    
});
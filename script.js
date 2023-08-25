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
            label: ylabel + ' vs ' + xlabel,
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

const trendString = (slope) => {
    const output = slope > 0 ? 'is trending up' :
    slope < 0 ? 'is trending down.' :
    'has no trend.'

    return output;
}


// Event listener for input
document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyze-button');
    const fileInput = document.getElementById('file-input');
    const chartsContainer = document.getElementById('charts');
    
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
                // Display analysis results for testing returned array of object
                const parsedDataContainer = document.getElementById('testing');
                parsedDataContainer.innerHTML = `
                    <p>Months: ${parsedData.months}</p>
                    <p>Sales: ${parsedData.sales}</p>
                    <p>Revenue: ${parsedData.revenue}</p>
                    <p>Expenses: ${parsedData.expenses}</p>
                `;

                // Create Line charts
                createLineChart('line', months, ['Sales', 'Revenue', 'Expenses'], [salesData, revenueData, expensesData]);

                // Regression Analysis on Sales
                createScatterRegressPlot('Time Unit', 'Sales', months, salesData, 'regress-chart-sales');
                const regressSales = timeRegressionAnalysis(months, salesData);
                document.getElementById('regress-result-sales').innerHTML = `The linear regression equation of sales: ${regressSales[0]}x + ${regressSales[1]}.`;
                document.getElementById('regress-result-sales').innerHTML += `<br\>The sales ${trendString(regressSales[0])}`;
                
                // Regression Analysis on Revenue
                createScatterRegressPlot('Time Unit', 'Revenue', months, revenueData, 'regress-chart-revenue');
                const regressRevenue = timeRegressionAnalysis(months, revenueData);
                document.getElementById('regress-result-revenue').innerHTML = `The linear regression equation of revenue: ${regressRevenue[0]}x + ${regressRevenue[1]}`;
                document.getElementById('regress-result-revenue').innerHTML += `<br\>The revenue ${trendString(regressRevenue[0])}`;

                // Regression Analysis on Expenses
                createScatterRegressPlot('Time Unit', 'Expenses', months, expensesData, 'regress-chart-expenses');
                const regressExpenses = timeRegressionAnalysis(months, expensesData);
                document.getElementById('regress-result-expenses').innerHTML = `The linear regression equation of expenses: ${regressExpenses[0]}x + ${regressExpenses[1]}`;
                document.getElementById('regress-result-expenses').innerHTML += `<br\>The revenue ${trendString(regressExpenses[0])}`;

                // Create Bar Chart
                createBarChart(months, ['Sales', 'Revenue', 'Expenses'], [salesData, revenueData, expensesData]);

                // Create Scatter Plot
                createScatterPlot('Sales', 'Revenue', salesData, revenueData,'scatter-rvs');
                document.getElementById('correlation-rvs').innerHTML = `The correlation between Sales and Revenue: ${correlationAnalysis(salesData, revenueData)}`;

                createScatterPlot('Expenses', 'Revenue', expensesData, revenueData,'scatter-rve');
                document.getElementById('correlation-rve').innerHTML = `The correlation between Expenses and Revenue: ${correlationAnalysis(expensesData, revenueData)}`;

                createScatterPlot('Sales', 'Expenses', salesData, expensesData,'scatter-evs');
                document.getElementById('correlation-evs').innerHTML = `The correlation between Sales and Expenses: ${correlationAnalysis(salesData, expensesData)}`;
            };

            reader.readAsArrayBuffer(file);
        }
        
    });
    
});
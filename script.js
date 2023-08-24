// Utility functions
const calculateMean = (data) => data.reduce((sum, value) => sum + value, 0) / data.length;

const calculateCorrelation = (dataX, dataY) => {
    // Calculate correlation between two datasets
    // You can use a library like simple-statistics for statistical calculations
};

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

    data.forEach((row) => {
        months.push(row.month.toLowerCase());// Convert to lowercase for consistent comparison
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
const createChart = (chartType, xlabel, datasetLabels, datasets) => {
    const chartsContainer = document.getElementById('charts');
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    chartsContainer.innerHTML = '';
    chartsContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const chartData = {
        labels: `${xlabel}`,
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
    canvas.width = 400;
    canvas.height = 300;
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

// Event listener for input
document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyze-button');
    const fileInput = document.getElementById('file-input');
    const chartsContainer = document.getElementById('charts');
    const correlationContainer = document.getElementById('correlation');
    
    analyzeButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const excelData = event.target.result;
                const parsedData = parseExcelData(excelData);

                const months = parsedData.months;
                const salesData = parsedData.sales;
                const revenueData = parsedData.revenue;
                const expensesData = parsedData.expenses;

                // Perform statistical analysis
                const salesMean = calculateMean(salesData);
                const revenueMean = calculateMean(revenueData);
                const expensesMean = calculateMean(expensesData);

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
                createChart('line',[months], ['Sales', 'Revenue', 'Expenses'], [salesData, revenueData, expensesData]);
                createBarChart(months, ['Sales', 'Revenue', 'Expenses'], [salesData, revenueData, expensesData]);

                // Perform and display correlation analysis
                const correlationCoefficient = calculateCorrelation(salesData, revenueData);
                correlationContainer.innerHTML = `Correlation Coefficient: ${correlationCoefficient.toFixed(2)}`;
            };

            reader.readAsArrayBuffer(file);
        }
    });
});
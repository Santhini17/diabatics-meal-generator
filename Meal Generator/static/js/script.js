document.addEventListener('DOMContentLoaded', function () {

    const tableStyles = `
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        border: 1px solid green; 
                    }

                    table, th, td {
                        border: 1px solid black;
                        text-align: center;
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', tableStyles);

    const generateMealButton = document.getElementById('generateMealButton');
    generateMealButton.addEventListener('click', async () => {
        const name = document.getElementById('name').value;
        const dob = document.getElementById('dob').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const bloodGlucoseLevel = document.getElementById('blood-glucose-level').value;

        if (!name || !dob || !height || !weight || !bloodGlucoseLevel) {
            alert('Please fill in all the required fields.');
            return;
        }

        const loader = document.createElement('div');
        loader.classList.add('loader');
        const mealPlanTable = document.getElementById('meal-plan-table');
        mealPlanTable.innerHTML = '';
        mealPlanTable.appendChild(loader);

        // Load data from CSV
        const csvFilePath = 'source/recipes.csv'; // Change to the actual path of your CSV file
        fetchDataFromCSV(csvFilePath)
            .then(data => {
                // Generate meal plans for 7 days using the loaded data
                const mealPlans = generateMealPlans(data);

                // Display the meal plans in a table format
                displayMealPlans(mealPlans, mealPlanTable, data);

                // Remove the loader
                mealPlanTable.removeChild(loader);
            })
            .catch(error => {
                console.error('An error occurred:', error);
                mealPlanTable.textContent = 'An error occurred while fetching and processing data.';
            });
    });

    async function fetchDataFromCSV(csvFilePath) {
        // Fetch and parse the CSV file
        const response = await fetch(csvFilePath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        const rows = Papa.parse(text, { header: true }).data;
        return rows;
    }

    function generateMealPlans(data) {
        const days = 7;
        const mealPlans = [];

        for (let day = 0; day < days; day++) {
            // Generate meals for each day
            const dailyMeals = {
                Breakfast: getRandomMeals(data),
                Lunch: getRandomMeals(data),
                Dinner: getRandomMeals(data),
            };

            mealPlans.push(dailyMeals);
        }

        return mealPlans;
    }

    function getRandomMeals(data) {
        // Replace this with your logic to select random meals from the loaded data
        // You can use data from your CSV to determine which meals to include
        const randomMeals = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * data.length);
            randomMeals.push(data[randomIndex].Recipe);
        }
        return randomMeals;
    }

    function displayMealPlans(mealPlans, mealPlanTable, data) {
        // Create and populate the table with meal plan data
        const table = document.createElement('table');
        table.classList.add('meal-plan-table');

        // Create table headers for days
        const daysHeader = document.createElement('tr');
        daysHeader.innerHTML = '<th></th>';
        for (let day = 0; day < 7; day++) {
            const dayHeader = document.createElement('th');
            dayHeader.textContent = `Day ${day + 1}`;
            daysHeader.appendChild(dayHeader);
        }
        table.appendChild(daysHeader);

        // Create table rows for breakfast, lunch, and dinner
        const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];
        mealTimes.forEach(mealTime => {
            const mealRow = document.createElement('tr');
            mealRow.innerHTML = `<td>${mealTime}</td>`;
            mealPlans.forEach(dailyMeals => {
                const mealCell = document.createElement('td');
                const mealList = document.createElement('ul');

                dailyMeals[mealTime].forEach(meal => {
                    const mealItem = document.createElement('li');
                    mealItem.textContent = meal;
                    mealList.appendChild(mealItem);
                });

                mealCell.appendChild(mealList);
                mealRow.appendChild(mealCell);
            });

            // Check if there are meals for this meal time, if not, skip it
            if (mealPlans.some(dailyMeals => dailyMeals[mealTime].length > 0)) {
                table.appendChild(mealRow);
            }
        });

        mealPlanTable.appendChild(table);
    }

    
    

    const toggleButton = document.getElementById('toggleMenuButton');
    const toggleButtonMobile = document.getElementById('toggleMenuButtonMobile');
    const mobileNav = document.getElementById('mobileNav');

    toggleButton.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
    });

    toggleButtonMobile.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
    });

    // Add the existing code for the send message button
    document.getElementById('sendMessageButton').addEventListener('click', () => {
        const name = encodeURIComponent(document.getElementById('user-name').value);
        const email = encodeURIComponent(document.getElementById('email').value);
        const subject = encodeURIComponent(document.getElementById('subject').value);
        const message = encodeURIComponent(document.getElementById('message').value);

        const gmailLink = `mailto:bharathvaidhyaselvan@gmail.com?subject=${subject}&body=Name: ${name}%0DEmail: ${email}%0DSubject: ${subject}%0DMessage: ${message}`;

        window.location.href = gmailLink;
    });
});

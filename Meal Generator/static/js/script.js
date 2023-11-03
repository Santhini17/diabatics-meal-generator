document.addEventListener('DOMContentLoaded', function () {
    const style = document.createElement('style');
    style.textContent = `
        table {
            border-collapse: collapse;
            width: 100%;
            border: 1px solid green;
        }
        table, th, td {
            border: 1px solid black;
            text-align: center;
        }
        h2 {
            font-weight: bold;
            font-size: 40px;
            margin-top: 20px;
        }
        h3 {
            font-size: 30px;
        }
        ul {
            font-size: 23px;
            margin: 10px 0;
        }
        li {
            list-style: disc;
        }
    `;
    document.head.appendChild(style);

    const generateMealButton = document.getElementById('generateMealButton');
    generateMealButton.addEventListener('click', async () => {
        const name = document.getElementById('name').value;
        const dob = document.getElementById('dob').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const bloodGlucoseLevel = document.getElementById('blood-glucose-level').value;

        if (!name || !dob || height < 0 || height > 300 || weight < 0 || weight > 300 || bloodGlucoseLevel < 0 || bloodGlucoseLevel > 300) {
            alert('Please fill in all the required fields with valid values.');
            return;
        }

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
        const csvFilePath = 'source/recipes.csv';
        fetchDataFromCSV(csvFilePath)
            .then(data => {
        
                const mealPlans = generateMealPlans(data);
                displayMealPlans(mealPlans, mealPlanTable, data);
                mealPlanTable.removeChild(loader);
            })
            .catch(error => {
                console.error('An error occurred:', error);
                mealPlanTable.textContent = 'An error occurred while fetching and processing data.';
            });
    });

    async function fetchDataFromCSV(csvFilePath) {
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
        const randomMeals = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * data.length);
            randomMeals.push(data[randomIndex]);
        }
        return randomMeals;
    }

    function displayMealPlans(mealPlans, mealPlanTable, data) {
        mealPlans.forEach((dailyMeals, day) => {
            const dayHeader = document.createElement('h2');
            dayHeader.textContent = `Day ${day + 1}:`;
            mealPlanTable.appendChild(dayHeader);
    
            const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];
            mealTimes.forEach(mealTime => {
                const mealTimeHeader = document.createElement('h3');
                mealTimeHeader.textContent = `${mealTime}:`;
                mealPlanTable.appendChild(mealTimeHeader);
    
                const mealsForThisTime = dailyMeals[mealTime];
    
                if (mealsForThisTime.length === 0) {
                    const randomMeal = getRandomMeal(data);
                    const mealName = randomMeal['Recipe'];
                    const mealIngredients = randomMeal['Ingredients'];
    
                    const mealNameHeader = document.createElement('p');
                    mealNameHeader.innerHTML = `1. Meal Name: ${mealName || 'No meal available'} ,  Ingredients: ${mealIngredients || 'No ingredients available'}`;
                    mealPlanTable.appendChild(mealNameHeader);
                } else {
                    for (let index = 0; index < 3; index++) {
                        if (index < mealsForThisTime.length) {
                            const meal = mealsForThisTime[index];
                            const mealName = meal['Recipe'];
                            const mealIngredients = meal['Ingredients'];
    
                            const mealNameHeader = document.createElement('p');
                            mealNameHeader.innerHTML = `${index + 1}. Meal Name: ${mealName || 'No meal available'} ,  Ingredients: ${mealIngredients || 'No ingredients available'}`;
                            mealPlanTable.appendChild(mealNameHeader);
                        } else {
                            const randomMeal = getRandomMeal(data);
                            const mealName = randomMeal['Recipe'];
                            const mealIngredients = randomMeal['Ingredients'];
    
                            const mealNameHeader = document.createElement('p');
                            mealNameHeader.innerHTML = `${index + 1}. Meal Name: ${mealName || 'No meal available'} ,  Ingredients: ${mealIngredients || 'No ingredients available'}`;
                            mealPlanTable.appendChild(mealNameHeader);
                        }
                    }
                }
            });
        });
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

    document.getElementById('sendMessageButton').addEventListener('click', () => {
        const name = encodeURIComponent(document.getElementById('name').value);
        const email = encodeURIComponent(document.getElementById('email').value);
        const subject = encodeURIComponent(document.getElementById('subject').value);
        const message = encodeURIComponent(document.getElementById('message').value);

        const gmailLink = `mailto:bharathvaidhyaselvan@gmail.com?subject=${subject}&body=Name: ${name}%0DEmail: ${email}%0DSubject: ${subject}%0DMessage: ${message}`;

        window.location.href = gmailLink;
    });
});

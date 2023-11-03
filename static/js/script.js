document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener to the "generateMealButton" button
    const generateMealButton = document.getElementById('generateMealButton');
    generateMealButton.addEventListener('click', async () => {
        const loader = document.createElement('div');
        loader.classList.add('loader');
        const mealPlanTable = document.getElementById('meal-plan-table');
        mealPlanTable.innerHTML = '';
        mealPlanTable.appendChild(loader);

        // Collect user inputs
        const name = document.getElementById('name').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const dob = document.getElementById('dob').value;
        const height = parseFloat(document.getElementById('height').value); 
        const weight = parseFloat(document.getElementById('weight').value); 
        const bloodGlucoseLevel = parseFloat(document.getElementById('blood-glucose-level').value);

        // Calculate BMI
        const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);

        // Generate prompt based on BMI
        let prompt = '';
        if (bmi < 18.5) {
            prompt = 'You are underweight. It is important to maintain a balanced diet.';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            prompt = 'You have a healthy weight. Continue with a balanced diet and regular exercise.';
        } else if (bmi >= 24.9 && bmi < 29.9) {
            prompt = 'You are overweight. Consider a diet and exercise plan to maintain a healthy weight.';
        } else {
            prompt = 'You are obese. It is crucial to consult a healthcare professional for guidance.';
        }

        // Display the prompt and BMI
        const resultPrompt = document.createElement('div');
        resultPrompt.classList.add('result-prompt');
        resultPrompt.textContent = `BMI: ${bmi} - ${prompt}`;
        mealPlanTable.appendChild(resultPrompt);

        try {
            // Send a POST request to your server
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, gender, dob, bmi, height, weight, bloodGlucoseLevel }),
            });

            if (response.ok) {
                // Request successful, parse and display the meal plan
                const data = await response.json();
                mealPlanTable.innerHTML = data.mealPlan;
            } else {
                // Handle server errors
                console.error('Failed to fetch meal plan');
            }
        } catch (error) {
            // Handle network or other errors
            console.error('An error occurred:', error);
        }
    });

    // Add the existing code for the toggle buttons
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

        const gmailLink = `mailto:bharathvaidhyaselvan@gmail.com?subject=${subject}&body=Name: ${-user-name}%0DEmail: ${email}%0DSubject: ${subject}%0DMessage: ${message}`;

        window.location.href = gmailLink;
    });
});

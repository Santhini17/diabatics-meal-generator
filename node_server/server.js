const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');
const ConstraintSolver = require('python-constraint'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const openaiAPIKey = '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';

const openaiInstance = new openai({ key: openaiAPIKey });

app.post('/suggest-meal', async (req, res) => {
    const { name, gender, dob, bmi, height, weight, bloodGlucoseLevel } = req.body;


    const problem = new ConstraintSolver.Problem();

    problem.addVariable('age', [30, 40, 50]);
    problem.addVariable('bmi', [20, 25, 30]);
    problem.addVariable('glucoseLevel', [80, 120, 160]);

   
    problem.addConstraint((age, dob) => age <= dob, ['age', 'dob']);
    problem.addConstraint((bmi, userBmi) => bmi <= userBmi, ['bmi', 'userBmi']);
    problem.addConstraint((glucoseLevel, bloodGlucoseLevel) => glucoseLevel <= bloodGlucoseLevel, ['glucoseLevel', 'bloodGlucoseLevel']);

    // Solve the CSP to find valid assignments
    const solutions = problem.solveAll();

    // Use the solutions to generate meal plans

    if (solutions.length === 0) {
        res.status(400).json({ error: 'No valid solutions found' });
        return;
    }

    const randomSolution = solutions[Math.floor(Math.random() * solutions.length)];

    const { age, bmi, glucoseLevel } = randomSolution;

    const prompt = `Suggest a meal plan for ${name}, a ${gender}, who has provided the following information:\n
    Name: ${name}
    Gender: ${gender}
    Date of Birth: ${dob}
    BMI: ${bmi}
    Height: ${height}
    Weight: ${weight}
    Blood Glucose Level: ${bloodGlucoseLevel}
    Age: ${age}
    BMI Constraint: ${bmi}
    Glucose Level Constraint: ${glucoseLevel}
    `;

    try {
        const response = await openaiInstance.completions.create({
            engine: 'text-davinci-002',
            prompt,
            max_tokens: 100,
        });

        const mealPlan = response.choices[0].text;

        res.json({ mealPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate a meal plan' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

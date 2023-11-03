const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const openaiAPIKey = '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';

const openaiInstance = new openai({ key: openaiAPIKey });

app.post('/predict', async (req, res) => {
    const { name, gender, dob, bmi, height, weight, bloodGlucoseLevel } = req.body;

    const prompt = `Predict diabetic levels and suggest a meal plan for ${name}, a ${gender}, who has provided the following information:\n
Name: ${name}
Gender: ${gender}
Date of Birth: ${dob}
BMI: ${bmi}
Height: ${height}
Weight: ${weight}
Blood Glucose Level: ${bloodGlucoseLevel}
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

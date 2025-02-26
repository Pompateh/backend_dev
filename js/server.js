const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Resolve the path to your credentials.json file
const keyfilePath = path.resolve(__dirname, 'credentials.json');

app.post('/submit-order', async (req, res) => {
    const { email, orderDetails } = req.body;

    try {
        // Authenticate using the JSON key file
        const auth = await authenticate({
            keyfilePath: keyfilePath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        google.options({ auth });

        // Access Google Sheets API
        const sheets = google.sheets('v4');
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEET_ID, // Ensure this is defined in your .env file
            range: 'Sheet1!A1:B1', // Adjust the range as needed
            valueInputOption: 'RAW',
            requestBody: {
                values: [[email, orderDetails]],
            },
        });

        console.log('Data appended successfully:', response.data);
        res.json({ message: 'Order received successfully', response });

    } catch (error) {
        console.error('Error accessing Google Sheets:', error.message);
        res.status(500).json({ message: 'Error storing data in Google Sheets', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

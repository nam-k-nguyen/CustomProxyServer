const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON request bodies

// Example route (GET request)
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Query notion database with a POST request
app.post("/query-notion-db", async (req, res) => {
    console.log(req)
    let data = req.body;
    console.log(data)
    let { db_id, api_key } = data;

    try {
        const response = await axios.post(
            `https://api.notion.com/v1/databases/${db_id}/query`,
            {},
            {
                headers: {
                    "Authorization": `Bearer ${api_key}`,
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json"
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update notion page with a PATCH request
app.post("/update-notion-page", async (req, res) => {
    console.log(req)
    let data = req.body;
    console.log(data)
    let { page_id, api_key, params } = data;
    let { properties, in_trash } = params

    try {
        const response = await axios.patch(
            `https://api.notion.com/v1/pages/${page_id}`,
            {
                properties,
                archived: in_trash
            },
            {
                headers: {
                    "Authorization": `Bearer ${api_key}`,
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json"
                }
            }
        );
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    const env = process.env.NODE_ENV || "development";
    console.log(`Server running in ${env} mode on port ${PORT}`);
});

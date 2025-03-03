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

app.get("/get-notion-page", async (req, res) => {
    console.log(req)
    let data = req.body;
    console.log(data)
    let { page_id, api_key } = data;

    try {
        const response = await axios.get(
            `https://api.notion.com/v1/pages/${page_id}`,
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
        if (error.response.status) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
})

app.post("/create-notion-page", async (req, res) => {
    console.log(req)
    let data = req.body;
    console.log(data)
    let { api_key, params } = data;
    let { parent, properties } = params;

    try {
        const response = await axios.post(
            `https://api.notion.com/v1/pages`,
            {
                parent,
                properties
            },
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
app.patch("/update-notion-page", async (req, res) => {
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
                in_trash
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

app.post("get-image-metadata", async (req, res) => {
    let headers = req.headers ? req.headers : {};
    let data = req.body;
    let { api_key, url } = data;

    console.log(headers)
    
    try {
        res.json(JSON.stringify(headers))
        const response = await axios.get(
            `https://api.linkpreview.net/?q=${url}`,
            {
                headers: {
                    "X-Linkpreview-Api-Key": `${api_key}`,
                    "Content-Type": "application/json"
                }
            }
        );
        res.json(response.data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})

// Start the server
app.listen(PORT, () => {
    const env = process.env.NODE_ENV || "development";
    console.log(`Server running in ${env} mode on port ${PORT}`);
});

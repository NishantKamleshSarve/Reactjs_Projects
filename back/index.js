const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/userhome", async (req, res) => {
  console.log("Proxy received body:", req.body);

  try {
    const response = await fetch(
      "https://testapp.gokidogo.com/webapi/api.php/userhome", // Note: remote API spelling stays as is
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`Remote API returned error: ${response.status}`, text);
      return res.status(502).json({
        error: `Remote API error ${response.status}`,
        details: text,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy server error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});

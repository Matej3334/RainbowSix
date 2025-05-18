const express = require('express');

const app = express();

app.use(express.json());  
app.use(express.static('public')); 

const API_KEY = 'CO2XLOJ2YSAJ5228'; 
const MAPTILER_API_KEY= "tyCDHh3i1SsCbYz2Le5v";
app.post('/api/send-request', async (req, res) => {
  try {
    const { type_id, lat, lng, accuracy } = req.body;

    if (!type_id || !lat || !lng || !accuracy) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const API_KEY = 'CO2XLOJ2YSAJ5228'; 
    const cooldown = 24;

    const url = `https://api.thingspeak.com/update?api_key=${API_KEY}&field3=${type_id}&field4=${lat}&field5=${lng}&field6=${accuracy}&field7=${cooldown}`;

    const response = await globalThis.fetch(url);
    const data = await response.text(); 

    return res.json({ success: true, message: "Update sent", data });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get('/api/maptiler-key', (req, res) => {
    res.json({ key: MAPTILER_API_KEY });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

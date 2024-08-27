const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000; // Replace with your desired port
const configFilePath = './vou.conf'; // Example path to Nginx config file

app.use(express.json());

app.post('/update-ip', (req, res) => {
  const newIP = req.body.ip;

  if (!newIP) {
    return res.status(400).json({ error: 'IP address is required' });
  }


  try {
    // Read the existing config file content
    const configData = fs.readFileSync(configFilePath, 'utf8');

    // Replace the old IP with the new one using regular expressions or string manipulation
    const updated1ConfigData = configData.replace(/proxy_pass http:\/\/.+:/g, `proxy_pass http://[${newIP}]:`);
    const updated2ConfigData = updated1ConfigData.replace(/proxy_pass https:\/\/.+;/g, `proxy_pass https://[${newIP}];`);

    // Write the updated content back to the config file
    fs.writeFileSync(configFilePath, updated2ConfigData, 'utf8');

    res.json({ message: 'IP address updated successfully' });
  } catch (error) {
    console.error('Error updating config file:', error);
    res.status(500).json({ error: 'Failed to update config file' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
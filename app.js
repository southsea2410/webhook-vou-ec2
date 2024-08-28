const express = require("express");
const { execSync } = require("child_process");
const fs = require("fs");

const app = express();
const port = 3000; // Replace with your desired port
const configFilePath = "/etc/nginx/conf.d/vou.conf"; // Example path to Nginx config file
// const configFilePath = "./vou.conf"; // Example path to Nginx config file

let oldIP = "";

app.use(express.json());

app.get("/update-ip", (req, res) => {
  const newIP = req.query.ip;

  if (!newIP) {
    return res.status(400).json({ error: "IP address is required" });
  }

  if (newIP === oldIP) {
    return res.json({ message: "IP address is already up to date" });
  }
  oldIP = newIP;

  try {
    // Read the existing config file content
    const configData = fs.readFileSync(configFilePath, "utf8");

    // Replace the old IP with the new one using regular expressions or string manipulation
    const updated1ConfigData = configData.replace(
      /proxy_pass http:\/\/.+:/g,
      `proxy_pass http://[${newIP}]:`
    );
    const updated2ConfigData = updated1ConfigData.replace(
      /proxy_pass https:\/\/.+;/g,
      `proxy_pass https://[${newIP}];`
    );

    // Write the updated content back to the config file
    fs.writeFileSync(configFilePath, updated2ConfigData, "utf8");

    
    // Optionally, you can reload the server here to apply the changes
    execSync('nginx -s reload');
    res.json({ message: "IP address updated successfully" });
  } catch (error) {
    console.error("Error updating config file:", error);
    res.status(500).json({ error: "Failed to update config file" });
  }
});

app.get("/reload", (req, res) => {
  try {
    // Perform the reload operation using the appropriate command
    // For example, if using Nginx, you can use the following command:
    // execSync('nginx -s reload');

    res.json({ message: "Server reloaded successfully" });
  } catch (error) {
    console.error("Error reloading server:", error);
    res.status(500).json({ error: "Failed to reload server" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Detect actual environment (localhost = development)
const isLocalhost = PORT === 5000 || HOST === 'localhost' || HOST === '0.0.0.0';
const actualEnv = (process.env.NODE_ENV === 'production' && !isLocalhost) 
    ? 'production' 
    : 'development';

app.listen(PORT, HOST, () => {
    console.log(`My Best Career Guidance Server running on http://${HOST}:${PORT}`);
    console.log(`Environment: ${actualEnv} (NODE_ENV: ${process.env.NODE_ENV || 'not set'})`);
    if (isLocalhost && process.env.NODE_ENV === 'production') {
        console.log(`Running on localhost - treated as development mode`);
    }
    console.log(`Started at: ${new Date().toISOString()}`);
    console.log(`Local URL: http://localhost:${PORT}`);
    console.log(`Network URL: http://${require("os").hostname()}:${PORT}`);
});

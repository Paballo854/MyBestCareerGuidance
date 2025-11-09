require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`🚀 My Best Career Guidance Server running on http://${HOST}:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`🌐 Network URL: http://${require("os").hostname()}:${PORT}`);
});

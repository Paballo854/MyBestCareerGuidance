const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin role required."
        });
    }
    next();
};

const instituteMiddleware = (req, res, next) => {
    if (req.user.role !== "institute") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Institute role required."
        });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware, instituteMiddleware };

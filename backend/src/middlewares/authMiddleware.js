const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    try {
        // 2. Verify token
        // Use the same secret as in authController
        const secret = process.env.JWT_SECRET || 'secret_access_key';
        const decoded = jwt.verify(token, secret);

        // 3. Attach user info to request
        req.user = decoded; // { id, role, roleId, iat, exp }

        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }
};

module.exports = authMiddleware;

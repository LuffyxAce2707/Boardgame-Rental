const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {

    return (req, res, next) => {

        try {

            const token = req.header('Authorization');

            if (!token) {
                return res.status(401).json({
                    message: 'Access denied. No token provided.'
                });
            }

            const verified = jwt.verify(
                token.replace('Bearer ', ''),
                process.env.JWT_SECRET || 'secretkey'
            );

            req.user = verified;

            // Role check
            if (
                roles.length > 0 &&
                !roles.includes(req.user.role)
            ) {
                return res.status(403).json({
                    message: 'Forbidden'
                });
            }

            next();

        } catch (error) {

            return res.status(401).json({
                message: 'Invalid token'
            });

        }

    };

};

module.exports = authMiddleware;
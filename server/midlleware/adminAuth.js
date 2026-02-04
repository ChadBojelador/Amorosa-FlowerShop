const adminAuth = (req, res, next) => {
    try {
        // Check if user is authenticated (auth middleware should run first)
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = adminAuth;

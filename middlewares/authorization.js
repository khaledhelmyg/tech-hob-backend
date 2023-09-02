const isAdmin = (req, res, next) => {
    console.log("req.user:", req.user)
    if(req.user && (req.user.role === "admin" || req.user.is_admin)) {
        next()
    } else {
        res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
}

const isUser = (req, res, next) => {
    if (req.user && (req.user.role === "user" || req.user.role === "admin" && req.user.email === process.env.ADMIN_EMAIL)) {
        next()
    } else {
        res.status(403).json({ message: "Access denied. User privileges required." });
    }
}

const isVisitor = (req, res, next) => {
    if (!req.user || req.user.role === "visitor") {
        next()
    } else {
        res.status(403).json({ message: "Access denied. Visitor privileges required." });
    }
}

module.exports = {
    isAdmin,
    isUser,
    isVisitor
}
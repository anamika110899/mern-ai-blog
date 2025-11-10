// ✅ Role-based Access Middleware
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied: Insufficient permissions" });
      }

      next(); 
    } catch (error) {
      console.error("Role verification error:", error);
      res.status(500).json({ message: "Error checking role" });
    }
  };
};

module.exports = verifyRole;

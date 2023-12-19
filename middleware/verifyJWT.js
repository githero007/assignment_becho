const jwt = require('jsonwebtoken');
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];//this accesses the header named Authorization
    if (!authHeader) { return res.status(401).json({message : 'Unauthorized'}) }
    const token = authHeader//.split(' ')[1];//splitting because authHeader provides in the form of Bearer __ which is to be split and only the bearer token is to be accepted
   if (!token) { return res.status(404).send("no token found") }
   
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if(err.name === 'TokenExpiredError')
            {
               return  res.status(401).send("your session has expired please login again to continue")
            }
           return res.status(500).send("something went wrong please try again")
             }
       if(decoded.email != req.body.email)
       {
        return res.status(403).send("you are not allowed to have access to this")
       }

        next();
    });

}
module.exports = verifyJWT
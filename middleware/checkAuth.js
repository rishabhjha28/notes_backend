const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

const checkAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if(err){
                res.status(401).json({error: "Unauthorized"})
            }
            else{
                req.id = decodedToken.id
                next()
            }
        })
    }
    else{
        res.status(401).json({error: "Unauthorized"})
    }
}

module.exports = checkAuth
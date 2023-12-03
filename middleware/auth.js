import jwt from 'jsonwebtoken'

//wants to like a post
// click the like button => auth middleware (NEXT) => like controllers...

// third parameter next means do something and then move next.
const auth = async (req, res, next) => {
  try {
    // req.headers.aut
    console.log(req.headers.authorization)
    console.log(JSON.parse(JSON.stringify(req.headers)).authorizaton)

    const token = JSON.parse(JSON.stringify(req.headers)).authorizaton.split(
      ' ',
    )[1]
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxhdmt1c2gxNTkyMDAwQGdtYWlsLmNvbSIsImlkIjoiNjFjZGY5YjUwZWUwOWIyZDhmNWFhYjcwIiwiaWF0IjoxNjQwOTM5Njc3LCJleHAiOjE2NDA5NDMyNzd9.PijwYwx3YAViBfEjs_Kkxse3VUi6FcxSTpEsCAkJfNc
    console.log(token)
    const isCustomAuth = token.length < 500
    //if token.length is less than 500 then it is manual login and if token.length greater than 500 then it is google login.

    let decodeData

    if (token && isCustomAuth) {
      console.log('manual login')
      decodeData = jwt.verify(token, 'test')
      req.userId = decodeData?.id
      console.log(req.userId)
      // here 'test' is secret which is created when token is created in controllers/user.js. both should have same value.
    } else {
      decodeData = jwt.decode(token)

      req.userId = decodeData?.sub
      // sub is basically a google id with the help of google differentiate users;
    }
    next()
  } catch (error) {
    console.log('error occur in middleware')
    res.status(404).send('error occur in auth')
  }
}

export default auth

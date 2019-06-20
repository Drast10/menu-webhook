const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const menuRouter = require('./controllers/menu')


const app = express()
const port = process.env.PORT || 4000


  app
  .use(cors())
  .use(bodyParser.json())
  .use(menuRouter)
  .use(eventRouter)
  .use(authRouter)
  .use(ticketRouter)
  .use(commentsRouter)
  

  
  app.listen(port, ()=>console.log(`Listening on port ${port}`))
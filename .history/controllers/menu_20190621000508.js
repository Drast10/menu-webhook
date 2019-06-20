const {Router} = require('express')
const models = require('../models');
const router = new Router()
const Menu =models.menus;

router.get('/menus', (req, res) => {
	Menu.findAll({
	  attributes: ['date', 'dish', 'type']
	})
	  .then(result => {
	    // do something with result
	    res.send({
	    	menus: result
	    })
	  })
	  .catch(err => {
	    // there was an error, return some HTTP error code
	    res.status(500).send({error: 'Something went wrong with Postgres'})
	  })
})

router.get('/menus/:id', (req, res) => {
	const menutId = req.params.id
	Menu.findById(menutId)
	  .then(result => {
	  	if (!result) {
	  		res.status(404).send({error: 'Does not exist'})
	  	}
	  	else {
	  		res.send(result)
	  	}
	  })
	  .catch(err => {
	    res.status(500).send({error: 'Something went wrong with Postgres'})
	  })
})

router.post('/menus', (req, res) => {
  const menu = req.body
  console.log(menu)

  Menu.create(menu).then(entity => {

    // send back the 201 Created status and the entity
    res.status(201).send(entity)
  })
})

//webhooks

router.post("/webhook",(req,res,next)=>{  
 
  console.log("webhook enter");
   console.log(req.body );
  console.log(JSON.stringify(req.body ));
   
   if (req.body.queryResult.action === "schedule") {
   
   }
  else if (req.body.queryResult.action === "menu") {


    Menu.count()
    .then(total=>{
      Menu
      .findAll({where: {
        day: 'Monday',
        type:'Soup'
      }})
      .then(menus =>{
        console.log(menus)
        let dishes=menus.reduce((acc, menu)=>{
          acc=acc+menu.dish+','
          return acc;
        },'')
        


        total,dishes
        res.send({fulfillmentText:" In Today Menu for Soup we have "+total +"si"+dishes,})
    })
    .catch(error => next(error))
   
    })
    .catch(error=>next(error)); 
    
    // res.json({
    //          fulfillmentText: "Great! I've set your reservation for $number person on "+req.body.queryResult.parameters.date+" at"+ req.body.queryResult.parameters.time+". Do you have any special occasion?",
    //      });
   }
   else if(req.body.queryResult.action==="menuType"){
     const newdate = data.filter(date=>date.date===req.body.queryResult.parameters.date)
     res.json({
       fulfillmentText:" Today Menu is "+newdate,
       parameters:{
 
       }
     })
   }

 })



router.put('/menus/:id', (req, res) => {
  const menutId = Number(req.params.id)
  const updates = req.body

  // find the product in the DB
  Menu.findById(menutId)
    .then(entity => {
      // change the product and store in DB
      return entity.update(updates)
    })
    .then(final => {
      // respond with the changed product and status code 200 OK
      res.send(final)
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })

})

router.delete('/menus/:id', (req, res) => {
  const menutId = Number(req.params.id)

  Product.findById(menutId)
	  .then(entity => {
	    // change the product and store in DB
	    return entity.destroy()
	  })
	  .then(_ => {
	    // respond with the changed product and status code 200 OK
	    res.send({
	      message: 'The product was deleted succesfully'
	    })
	  })
	  .catch(error => {
	    res.status(500).send({
	      message: `Something went wrong`,
	      error
	    })
	  })
})

module.exports = router


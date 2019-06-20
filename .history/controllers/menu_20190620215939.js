const {Router} = require('express')
const models = require('../models');
const router = new Router()


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

app.delete('/menus/:id', (req, res) => {
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


const {Router} = require('express')
const models = require('../models');
const router = new Router()


//display specific event's tickets
router.get('/menu',(req,res,next)=>{
  console.log("===")


      Menu
      .findAll({limit, offset,where: {
        event_id: req.params.event_id
      }})
      .then(tickets =>{
        let page = Math.ceil(total/limit);
        res.send({tickets,total,page})
    })
    .catch(error => next(error))
   
    })
    .catch(error=>next(error)); 
})

//add ticket by perticular event with risk factor
router.post('/events/:event_id/tickets', auth,(req,res, next)=>{
  let user=userId(req,res,next);
  console.log(user)
  const ticket = req.body
  //ticket.user_id=user;
  //ticket.event_id=req.params.event_id;
  ticketRisk(ticket,user,req.params.event_id,next,res)
  
})

async function ticketRisk(ticket,user_id,event_id,next,res) {
  //const event = await Event.findOne(event_id)
  //if(!event) throw new Error('Your event doesnot exist')

  //minimum risk is 5
  ticket.user_id = user_id
  ticket.event_id = event_id
  ticket.risk = 5 
  //if ticket created by auther then add 10% to risk
  const tickets = await Ticket.findAll()
  const totalAuthor = tickets.filter(ticket=>ticket.user_id === user_id).length
  if(totalAuthor === 0) ticket.risk = ticket.risk+10

  //risk assessment based on the price of the ticket
        //map through all the tickets to find tickets available for this event
        const ticketsForCurrentEvent = tickets.filter(ticket => ticket.event_id === event_id)
        const ticketPriceList = ticketsForCurrentEvent.map(ticket => ticket.price)

        //calculate the total & average price of all tickets
        const totalPrice = ticketPriceList.reduce((a, b) => a + b, 0)
        const averagePrice = totalPrice / ticketPriceList.length

        if (ticketsForCurrentEvent.length === 0) {
          ticket.risk = ticket.risk
      } else {
          //if ticket price is cheaper than the average price then add x% to the risk
          if ((ticket.price - averagePrice) <= 0) {
              const x = (averagePrice - ticket.price) / averagePrice * 100
              ticket.risk += x
          } else {
              //if ticket price is higher than the average price then reduce risk up to 10%
              const x = (ticket.price - averagePrice) / averagePrice * 100
              if (x <= 10) {
                  ticket.risk -= x
              } else {
                  ticket.risk -= 10
              }
          }
      }

      //risk deducted 10% if ticket added during business hours (9-17)
        //otherwise, add 10% to the risk
        let d=new Date(ticket.date);
        const hour = d.getHours()
        if (hour >= 9 && hour <= 17) {
            ticket.risk -= 10
        } else {
            ticket.risk += 10
        }

        //add 5% risk if there are more than 3 comments on the ticket
        const comments = await Comment.findAll()
        const numberOfCommentOnTheTicket = comments.filter(comment => comment.ticket_id === ticket.id).length
        if (numberOfCommentOnTheTicket > 3) ticket.risk += 5
        //also check fraud risk during creation of comments (in comment controler)

        //minimal risk is 5% and maximum risk is 95%
        if (ticket.risk < 5) ticket.risk = 5
        if (ticket.risk > 95) ticket.risk = 95

          Ticket
          .create(ticket)
          .then(ticket=>{
            return res.status(201).send(ticket)
          })
          .catch(error=>next(error))
}


module.exports = router


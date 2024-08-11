const Ticket = require('../models/ticket');
const db = require('../db'); 

const receiveTicket = async (req, res) => {
  console.log(req.body)
  const { id, subject, description, email, priority, status, source } = req.body;

  console.log(id, subject, description, email, priority, status, source);

  try {
    const ticketData = {
      id,
      subject,
      description,
      email,
      priority,
      status,
      source,
    };  

    const ticketExists = await db.checkTicketExists(id);
    if (ticketExists) {
      await db.updateTicket(ticketData);
    } else {
      await db.insertTicket(ticketData);
    }

    res.status(201).send({ message: 'Ticket received and stored' });
  } catch (error) {
    console.error('Failed to store ticket:', error);
    res.status(500).send({ error: 'Failed to store ticket' });
  }
};

module.exports = {
  receiveTicket,
};

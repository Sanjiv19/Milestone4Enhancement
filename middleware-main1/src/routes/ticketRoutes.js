const express = require('express');
const router = express.Router();
const Ticket = require('../db/models/ticket');
const cron = require('node-cron');
const axios = require('axios');

router.post('/tickets', async (req, res) => {
  const { ticket_id, subject, description, email, priority, status, source } = req.body;
  try {
    await Ticket.create({
      ticket_id,
      subject,
      description,
      email,
      priority,
      status,
      source,
      processed: false // Mark the ticket as unprocessed initially
    });
    res.status(200).json({ message: 'Ticket received successfully' });
  } catch (error) {
    console.error('Error saving ticket:', error);
    res.status(500).json({ message: 'Failed to save ticket' });
  }
});

const createFreshdeskTicket = async () => {
  try {
    const unprocessedTickets = await Ticket.findAll({
      where: { processed: false }, // Fetch tickets that haven't been processed yet
    });

    for (const ticket of unprocessedTickets) {
      const freshdeskUrl = `https://${process.env.FRESHDESK_DOMAIN}/api/v2/tickets`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.FRESHDESK_API_KEY + ':X').toString('base64')}`,
      };

      const ticketData = {
        subject: ticket.subject,
        description: ticket.description,
        email: ticket.email,
        priority: ticket.priority,
        status: ticket.status || 2, // Use status from the database, default to 2 (Open)
        source: ticket.source || 2, // Use source from the database, default to 2 (Web)
      };

      const response = await axios.post(freshdeskUrl, ticketData, { headers });

      if (response.status === 200 || response.status === 201) {
        await ticket.update({ processed: true });
        console.log(`Ticket ${ticket.ticket_id} created in Freshdesk.`);
      }
    }
  } catch (error) {
    console.error("Error creating Freshdesk ticket: ", error);
  }
};

// Schedule the job to run every 5 minutes
cron.schedule('*/5 * * * *', createFreshdeskTicket);

module.exports = router;


const axios = require('axios');
const Ticket = require('../db/models/ticket');

const pushTicketsToFreshdesk = async () => {
  try {
    const unprocessedTickets = await Ticket.findAll({
      where: { processed: false },
    });

    for (const ticket of unprocessedTickets) {
      const response = await axios.post(
        `https://${process.env.FRESHDESK_DOMAIN}/api/v2/tickets`,
        {
          subject: ticket.subject,
          description: ticket.description,
          email: ticket.email,
          priority: ticket.priority,
          status: ticket.status,
          source: ticket.source,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(process.env.FRESHDESK_API_KEY + ':X').toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        await ticket.update({ processed: true });
      }
    }console.log('Tickets processed after 5 minutes.');
  } catch (error) {
    console.error('Error pushing tickets to Freshdesk:', error);
  }
};



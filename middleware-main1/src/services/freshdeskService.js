const fetch = require('node-fetch'); // Import fetch from node-fetch v2
const { Buffer } = require('buffer'); // Import Buffer if needed
const cron = require('node-cron');
// Function to send tickets to Freshdesk
const sendToFreshdesk = async (ticket) => {
  const freshdeskApiKey = process.env.FRESHDESK_API_KEY;
  const freshdeskDomain = process.env.FRESHDESK_DOMAIN;

  const freshdeskUrl = `https://${freshdeskDomain}/api/v2/tickets`;
  const authString = `${freshdeskApiKey}:x`;
  const encodedAuth = Buffer.from(authString).toString('base64');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${encodedAuth}`,
  };

  const ticketData = {
    subject: ticket.subject,
    description: ticket.description,
    email: ticket.email,
    priority: ticket.priority,
    status: 2, // Open
    source: 2, // Web
  };

  try {
    const response = await fetch(freshdeskUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Freshdesk Ticket Created: ', data);
  } catch (error) {
    console.error('Error creating Freshdesk ticket: ', error);
  }
};

module.exports = { sendToFreshdesk };

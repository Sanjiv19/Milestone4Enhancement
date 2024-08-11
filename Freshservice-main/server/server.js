const btoa  = require("btoa"); 

exports = {
  events: [
    {
      event: "onTicketCreate",
      callback: "onTicketCreateHandler",
    },
  ],

  onTicketCreateHandler: async function (payload) {
    

    const incident = payload.data.ticket;
    const requester = payload.data.requester;

    if (!incident || !requester || !requester.email) {
      console.error("Incident or requester email is missing.");
      return;
    }

    const ticketData = {
      ticket_id: incident.id,
      subject: incident.subject,
      description: incident.description,
      email: requester.email,
      priority: incident.priority,
      status: 2, // Open
      source: 2, // Web
      payload: payload
    };


    console.log("ticket")
    console.log(ticketData)
    await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
    },
      body: JSON.stringify(ticketData),
    }).then((response) => response.json())
    .then((data) => {
        console.log(data);
    });
  },
};

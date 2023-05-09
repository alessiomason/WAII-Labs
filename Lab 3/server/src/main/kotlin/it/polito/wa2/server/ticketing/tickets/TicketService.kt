package it.polito.wa2.server.ticketing.tickets

import it.polito.wa2.server.ticketing.purchases.PurchaseDTO

interface TicketService {
    fun getAllTickets(): List<TicketDTO>

    fun getTicket(id: Int): TicketDTO

    fun createTicket(purchaseDTO: PurchaseDTO)

    fun editTicket(ticketDTO: TicketDTO)
}
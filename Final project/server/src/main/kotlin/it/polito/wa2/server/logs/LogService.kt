package it.polito.wa2.server.logs

import it.polito.wa2.server.tickets.Ticket
import it.polito.wa2.server.tickets.TicketStatus

interface LogService {
    fun getLogsByTicketId(ticketId: Int): List<LogDTO>

    fun getLogsByExpertId(expertId: String): List<LogDTO>

    fun createLog(ticket: Ticket, newTicketStatus: TicketStatus)
}
package it.polito.wa2.server.ticketing.logs

import it.polito.wa2.server.ticketing.tickets.TicketDTO
import it.polito.wa2.server.ticketing.tickets.TicketStatus
import it.polito.wa2.server.ticketing.tickets.toDTO

data class LogDTO(
    val id: Int,
    val previousTicketStatus: TicketStatus,
    val newTicketStatus: TicketStatus,
    val time: java.time.Instant,
    val ticket: TicketDTO
)

fun Log.toDTO(): LogDTO {
    return LogDTO(
        id,
        previousTicketStatus,
        newTicketStatus,
        time,
        ticket.toDTO()
    )
}
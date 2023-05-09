package it.polito.wa2.server.ticketing.tickets

import it.polito.wa2.server.ticketing.employees.ExpertDTO
import it.polito.wa2.server.ticketing.employees.toDTO
import it.polito.wa2.server.ticketing.purchases.PurchaseDTO
import it.polito.wa2.server.ticketing.purchases.toDTO

data class TicketDTO(
    val id: Int,
    val purchase: PurchaseDTO,
    val expert: ExpertDTO?,
    val ticketStatus: TicketStatus,
    val priorityLevel: PriorityLevel
)

fun Ticket.toDTO(): TicketDTO {
    return TicketDTO(id, purchase.toDTO(), expert?.toDTO(), ticketStatus, priorityLevel)
}
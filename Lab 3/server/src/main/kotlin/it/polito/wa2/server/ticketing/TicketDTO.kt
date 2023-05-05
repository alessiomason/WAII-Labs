package it.polito.wa2.server.ticketing

data class TicketDTO(
    val purchase: PurchaseDTO,
    val expert: ExpertDTO?,
    val ticketStatus: TicketStatus,
    val priorityLevel: PriorityLevel
)

fun Ticket.toDTO(): TicketDTO {
    return TicketDTO(purchase.toDTO(), expert?.toDTO(), ticketStatus, priorityLevel)
}
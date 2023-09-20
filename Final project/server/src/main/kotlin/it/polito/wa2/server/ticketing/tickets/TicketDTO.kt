package it.polito.wa2.server.ticketing.tickets

import it.polito.wa2.server.ticketing.chat.ChatDTO
import it.polito.wa2.server.ticketing.chat.toDTO
import it.polito.wa2.server.ticketing.employees.ExpertDTO
import it.polito.wa2.server.ticketing.employees.toDTO
import it.polito.wa2.server.ticketing.purchases.PurchaseDTO
import it.polito.wa2.server.ticketing.purchases.toDTO

data class TicketDTO(
    val id: Int,
    val title: String,
    val description: String,
    val purchase: PurchaseDTO,
    val expert: ExpertDTO?,
    val ticketStatus: TicketStatus,
    val priorityLevel: PriorityLevel,
    val chat: ChatDTO? = null
)

data class NewTicketDTO(
    val title: String,
    val description: String,
    val purchase: PurchaseDTO
)

fun Ticket.toDTO(): TicketDTO {
    return TicketDTO(id, title, description, purchase.toDTO(), expert?.toDTO(), ticketStatus, priorityLevel, chat?.toDTO())
}

fun Ticket.toNewDTO(): NewTicketDTO {
    return NewTicketDTO(title, description, purchase.toDTO())
}
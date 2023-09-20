package it.polito.wa2.server.tickets

import it.polito.wa2.server.chat.ChatDTO
import it.polito.wa2.server.chat.toDTO
import it.polito.wa2.server.employees.ExpertDTO
import it.polito.wa2.server.employees.toExpertDTO
import it.polito.wa2.server.purchases.PurchaseDTO
import it.polito.wa2.server.purchases.toDTO

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
    return TicketDTO(id, title, description, purchase.toDTO(), expert?.toExpertDTO(), ticketStatus, priorityLevel, chat?.toDTO())
}

fun Ticket.toNewDTO(): NewTicketDTO {
    return NewTicketDTO(title, description, purchase.toDTO())
}
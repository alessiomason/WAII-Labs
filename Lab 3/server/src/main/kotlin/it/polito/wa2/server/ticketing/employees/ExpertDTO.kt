package it.polito.wa2.server.ticketing.employees

import it.polito.wa2.server.ticketing.tickets.TicketDTO
import it.polito.wa2.server.ticketing.tickets.toDTO

data class ExpertDTO(
    override val id: Int,
    override val firstName: String,
    override val lastName: String,
    val tickets: List<TicketDTO>
): EmployeeDTO(id, firstName, lastName)

data class NewExpertDTO(
    val firstName: String,
    val lastName: String
)

fun Expert.toDTO(): ExpertDTO {
    return ExpertDTO(id, firstName, lastName, tickets.map { it.toDTO() })
}
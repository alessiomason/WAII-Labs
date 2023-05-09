package it.polito.wa2.server.ticketing.employees

import it.polito.wa2.server.ticketing.tickets.TicketDTO
import it.polito.wa2.server.ticketing.tickets.toDTO

data class ExpertDTO(
    override val id: Int,
    override val firstName: String,
    override val lastName: String,
    val tickets: Set<TicketDTO>
): EmployeeDTO(id, firstName, lastName)

fun Expert.toDTO(): ExpertDTO {
    return ExpertDTO(id, firstName, lastName, tickets.map { it.toDTO() }.toSet())
}
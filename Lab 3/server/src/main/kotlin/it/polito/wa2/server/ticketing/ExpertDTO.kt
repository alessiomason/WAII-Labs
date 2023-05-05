package it.polito.wa2.server.ticketing

data class ExpertDTO(
    override var firstName: String,
    override var lastName: String,
    val tickets: Set<TicketDTO>
): EmployeeDTO(firstName, lastName)

fun Expert.toDTO(): ExpertDTO {
    return ExpertDTO(firstName, lastName, tickets.map { it.toDTO() }.toSet())
}
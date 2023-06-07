package it.polito.wa2.server.ticketing.employees

data class ExpertDTO(
    override val id: Int,
    override val firstName: String,
    override val lastName: String,
    val specializations: List<ExpertSpecializationDTO>,
    val ticketIds: List<Int>
    // only the ids of the corresponding tickets are returned, to avoid an infinite loop of conversions to DTO
): EmployeeDTO(id, firstName, lastName)

data class NewExpertDTO(
    val firstName: String,
    val lastName: String
)

fun Expert.toDTO(): ExpertDTO {
    return ExpertDTO(id, firstName, lastName, specializations.map { it.toDTO() }, tickets.map { it.id })
}

fun Expert.toNewDTO(): NewExpertDTO {
    return NewExpertDTO(firstName, lastName)
}
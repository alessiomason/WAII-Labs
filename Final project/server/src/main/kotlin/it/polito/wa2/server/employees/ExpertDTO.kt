package it.polito.wa2.server.employees

data class ExpertDTO(
    override val id: String,
    override val firstName: String,
    override val lastName: String,
    val specializations: List<ExpertSpecializationDTO>,
    val ticketIds: List<Int>
    // only the ids of the corresponding tickets are returned, to avoid an infinite loop of conversions to DTO
): PersonDTO(id, firstName, lastName)

fun Expert.toDTO(): ExpertDTO {
    return ExpertDTO(id, firstName, lastName, specializations.map { it.toDTO() }, tickets.map { it.id })
}
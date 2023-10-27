package it.polito.wa2.server.employees

import it.polito.wa2.server.customers.PersonDTO

data class ExpertDTO(
    override val id: String,
    override val firstName: String,
    override val lastName: String,
    val specializations: List<ExpertSpecializationDTO>,
    val ticketIds: List<Int>
    // only the ids of the corresponding tickets are returned, to avoid an infinite loop of conversions to DTO
): PersonDTO(id, firstName, lastName)

data class AuthorizedDTO(
    val authorized: Boolean
)

fun Expert.toExpertDTO(): ExpertDTO {
    return ExpertDTO(id, firstName, lastName, specializations.map { it.toDTO() }, tickets.map { it.id })
}
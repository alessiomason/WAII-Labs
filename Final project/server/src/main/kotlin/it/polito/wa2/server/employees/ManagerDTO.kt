package it.polito.wa2.server.employees

import it.polito.wa2.server.customers.PersonDTO

data class ManagerDTO(
    override val id: String,
    override val firstName: String,
    override val lastName: String
): PersonDTO(id, firstName, lastName)

fun Manager.toDTO(): ManagerDTO {
    return ManagerDTO(id, firstName, lastName)
}
package it.polito.wa2.server.ticketing.employees

data class ManagerDTO(
    override val id: Int,
    override val firstName: String,
    override val lastName: String
): EmployeeDTO(id, firstName, lastName)

fun Manager.toDTO(): ManagerDTO {
    return ManagerDTO(id, firstName, lastName)
}
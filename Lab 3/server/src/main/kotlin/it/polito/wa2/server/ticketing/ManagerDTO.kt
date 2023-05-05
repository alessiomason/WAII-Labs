package it.polito.wa2.server.ticketing

data class ManagerDTO(
    override var firstName: String,
    override var lastName: String
): EmployeeDTO(firstName, lastName)

fun Manager.toDTO(): ManagerDTO {
    return ManagerDTO(firstName, lastName)
}
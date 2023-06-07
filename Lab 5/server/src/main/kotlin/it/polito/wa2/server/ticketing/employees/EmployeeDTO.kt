package it.polito.wa2.server.ticketing.employees

abstract class EmployeeDTO(
    open val id: Int,
    open val firstName: String,
    open val lastName: String
)
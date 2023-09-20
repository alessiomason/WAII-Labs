package it.polito.wa2.server.ticketing.employees

import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.validation.constraints.Email

@Entity
@Table(name = "managers")
class Manager(
    id: String,
    @Email
    email: String,
    firstName: String,
    lastName: String
): Person(
    id,
    email,
    firstName,
    lastName
)
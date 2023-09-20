package it.polito.wa2.server.customers

import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.validation.constraints.Email

@Entity
@Table(name = "profiles")
class Profile(
    id: String,
    @Email
    email: String,
    firstName: String,
    lastName: String,
    var phone: String?
): Person(
    id,
    email,
    firstName,
    lastName
)
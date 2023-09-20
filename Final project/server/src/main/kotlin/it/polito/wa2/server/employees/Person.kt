package it.polito.wa2.server.employees

import jakarta.persistence.Column
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass
import jakarta.validation.constraints.Email

@MappedSuperclass
open class Person(
    @Id
    @Column(updatable = false, nullable = false)
    val id: String,
    @Email
    @Column(unique = true)
    val email: String,
    var firstName: String,
    var lastName: String
)
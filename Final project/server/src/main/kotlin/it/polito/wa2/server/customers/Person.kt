package it.polito.wa2.server.customers

import jakarta.persistence.*
import jakarta.validation.constraints.Email

@Entity
@Table(name = "people")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
open class Person(
    @Id
    @Column(updatable = false, nullable = false)
    val id: String,
    @Email
    @Column(unique = true)
    var email: String,
    var firstName: String,
    var lastName: String
)

fun Person.toDTO(): PersonDTO {
    return PersonDTO(id, firstName, lastName)
}
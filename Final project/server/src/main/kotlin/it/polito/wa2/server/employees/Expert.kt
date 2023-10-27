package it.polito.wa2.server.employees

import it.polito.wa2.server.customers.Person
import it.polito.wa2.server.tickets.Ticket
import jakarta.persistence.Entity
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import jakarta.validation.constraints.Email

@Entity
@Table(name = "experts")
class Expert(
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
) {
    var authorized = false

    @OneToMany(mappedBy = "expert")
    val specializations = listOf<ExpertSpecialization>()

    @OneToMany(mappedBy = "expert")
    val tickets = mutableSetOf<Ticket>()
}
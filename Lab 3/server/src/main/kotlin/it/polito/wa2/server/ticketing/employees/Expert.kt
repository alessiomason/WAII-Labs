package it.polito.wa2.server.ticketing.employees

import it.polito.wa2.server.ticketing.tickets.Ticket
import jakarta.persistence.Entity
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

@Entity
@Table(name = "experts")
class Expert(firstName: String, lastName: String): Employee(firstName, lastName) {
    @OneToMany(mappedBy = "expert")
    val tickets = mutableSetOf<Ticket>()
}
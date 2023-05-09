package it.polito.wa2.server.ticketing.employees

import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "managers")
class Manager(firstName: String, lastName: String): Employee(firstName, lastName)
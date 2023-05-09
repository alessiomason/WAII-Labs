package it.polito.wa2.server.ticketing.employees

import jakarta.persistence.Column
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass

@MappedSuperclass
open class Employee (
    var firstName: String,
    var lastName: String
) {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    var id: Int = 0
}
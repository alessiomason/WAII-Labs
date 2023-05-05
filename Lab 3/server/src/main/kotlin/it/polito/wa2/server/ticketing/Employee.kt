package it.polito.wa2.server.ticketing

import jakarta.persistence.Column
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass

@MappedSuperclass
open class Employee (
    var firstName: String,
    var lastName: String
) {
    @GeneratedValue
    @Id
    @Column(updatable = false, nullable = false)
    var id: Int = 0
}
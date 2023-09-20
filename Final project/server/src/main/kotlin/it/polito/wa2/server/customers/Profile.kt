package it.polito.wa2.server.customers

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Email

@Entity
@Table(name = "profiles")
class Profile (
    @Id
    @Column(updatable = false, nullable = false)
    val id: String,
    @Email
    @Column(unique = true)
    var email: String,
    var firstName: String,
    var lastName: String,
    var phone: String?
)
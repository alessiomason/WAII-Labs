package it.polito.wa2.server.customers

import jakarta.validation.constraints.Email
import org.springframework.data.jpa.repository.JpaRepository

interface PersonRepository: JpaRepository<Person, String> {
    fun findByEmail(@Email email: String): Person?
}
package it.polito.wa2.server.customers

import org.springframework.data.jpa.repository.JpaRepository

interface PersonRepository: JpaRepository<Person, String>
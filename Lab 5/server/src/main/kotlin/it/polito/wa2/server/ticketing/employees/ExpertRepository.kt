package it.polito.wa2.server.ticketing.employees

import jakarta.validation.constraints.Email
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ExpertRepository: JpaRepository<Expert, String> {
    fun findByEmail(@Email email: String): Expert?
}
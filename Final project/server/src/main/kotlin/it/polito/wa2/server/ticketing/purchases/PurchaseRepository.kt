package it.polito.wa2.server.ticketing.purchases

import jakarta.validation.constraints.Email
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PurchaseRepository: JpaRepository<Purchase, Int> {
    fun findByCustomerEmail(@Email email: String): List<Purchase>
}
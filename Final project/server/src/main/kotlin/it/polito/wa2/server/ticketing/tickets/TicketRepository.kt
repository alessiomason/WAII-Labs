package it.polito.wa2.server.ticketing.tickets

import jakarta.validation.constraints.Email
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TicketRepository: JpaRepository<Ticket, Int> {
    fun findByPurchaseCustomerEmail(@Email email: String): List<Ticket>
}
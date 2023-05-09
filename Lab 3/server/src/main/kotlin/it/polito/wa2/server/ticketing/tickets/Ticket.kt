package it.polito.wa2.server.ticketing.tickets

import it.polito.wa2.server.ticketing.employees.Expert
import it.polito.wa2.server.ticketing.purchases.Purchase
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

enum class TicketStatus {
    OPEN, IN_PROGRESS, CLOSED, REOPENED, RESOLVED
}

enum class PriorityLevel {
    LOW, NORMAL, HIGH, CRITICAL
}

@Entity
@Table(name = "tickets")
class Ticket (
    @ManyToOne
    val purchase: Purchase
) {
    @Id
    @Column(updatable = false, nullable = false)
    var id: Int = 0
    @ManyToOne
    var expert: Expert? = null
    var ticketStatus = TicketStatus.OPEN
    var priorityLevel = PriorityLevel.NORMAL
}
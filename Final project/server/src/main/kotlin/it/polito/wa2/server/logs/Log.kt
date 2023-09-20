package it.polito.wa2.server.logs

import it.polito.wa2.server.tickets.Ticket
import it.polito.wa2.server.tickets.TicketStatus
import jakarta.persistence.*

@Entity
@Table(name = "logs")
class Log (
    var previousTicketStatus: TicketStatus,
    var newTicketStatus: TicketStatus,
    var time: java.time.Instant,
    @ManyToOne
    var ticket: Ticket
) {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    var id: Int = 0
}
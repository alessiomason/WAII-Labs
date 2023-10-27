package it.polito.wa2.server.logs

import it.polito.wa2.server.tickets.Ticket
import it.polito.wa2.server.tickets.TicketStatus
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class LogServiceImpl(
    private val logRepository: LogRepository
): LogService {
    override fun getLogsByTicketId(ticketId: Int): List<LogDTO> {
        return logRepository.findAllByTicketId(ticketId).map { it.toDTO() }
    }

    override fun getLogsByExpertId(expertId: String): List<LogDTO> {
        return logRepository.findAllByTicketExpertId(expertId).map { it.toDTO() }
    }

    override fun createLog(ticket: Ticket, newTicketStatus: TicketStatus) {
        val log = Log(ticket.ticketStatus, newTicketStatus, Instant.now(), ticket)
        logRepository.save(log)
    }
}
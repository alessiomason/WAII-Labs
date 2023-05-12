package it.polito.wa2.server.ticketing.logs

import org.springframework.stereotype.Service

@Service
class LogServiceImpl(
    private val logRepository: LogRepository
) : LogService {
    override fun getLogsByTicketId(ticketId: Int): List<LogDTO> {
        return logRepository.findAll().filter { it.ticket.id == ticketId }.map { it.toDTO() }
    }

    override fun getLogsByExpertId(expertId: Int): List<LogDTO> {
        return logRepository.findAll().filter { it.ticket.expert?.id == expertId }.map { it.toDTO() }
    }

}
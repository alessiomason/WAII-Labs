package it.polito.wa2.server.logs

import org.springframework.stereotype.Service

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
}
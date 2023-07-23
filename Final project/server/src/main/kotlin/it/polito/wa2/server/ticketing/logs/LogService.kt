package it.polito.wa2.server.ticketing.logs

interface LogService {
    fun getLogsByTicketId(ticketId: Int): List<LogDTO>

    fun getLogsByExpertId(expertId: String): List<LogDTO>
}
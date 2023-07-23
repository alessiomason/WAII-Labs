package it.polito.wa2.server.ticketing.logs

import it.polito.wa2.server.ticketing.tickets.TicketDTO
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class LogController (
    private val logService: LogService
) {
    @GetMapping("/API/logs/ticket/{ticketId}")
    fun getLogsByTicketId(@PathVariable ticketId: Int): List<LogDTO> {
        return logService.getLogsByTicketId(ticketId)
    }

    @GetMapping("/API/logs/expert/{expertId}")
    fun getLogsByExpertId(@PathVariable expertId: String): List<LogDTO> {
        return logService.getLogsByExpertId(expertId)
    }
}
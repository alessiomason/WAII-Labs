package it.polito.wa2.server.ticketing.tickets

import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class TicketController(
    private val ticketService: TicketService
) {
    @GetMapping("/API/tickets")
    fun getAllTickets(): List<TicketDTO> {
        return ticketService.getAllTickets()
    }

    @GetMapping("/API/tickets/{id}")
    fun getTicketById(@PathVariable id: Int): TicketDTO {
        return ticketService.getTicket(id)
    }

    @PostMapping("/API/tickets")
    fun createTicket(@RequestBody @Valid newTicketDTO: NewTicketDTO): TicketDTO {
        return ticketService.createTicket(newTicketDTO)
    }

    @PutMapping("/API/tickets")
    fun editTicketDescription(@RequestBody @Valid ticketDTO: TicketDTO) {
        ticketService.editTicketDescription(ticketDTO)
    }

    @PutMapping("/API/tickets/properties")
    fun editTicketProperties(@RequestBody @Valid ticketDTO: TicketDTO) {
        ticketService.editTicketProperties(ticketDTO)
    }

    @PostMapping("/API/tickets/expert")
    fun assignExpert(@RequestBody @Valid ticketDTO: TicketDTO) {
        ticketService.assignExpert(ticketDTO)
    }
}
package it.polito.wa2.server.ticketing.tickets

import it.polito.wa2.server.ticketing.purchases.PurchaseDTO
import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

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

    //-- Test new ticket --
    //-- NewSomethingDTO per tutte le create --
    //-- return DTO in create --
    //-- non set ma list in DTO --

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
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
    fun createTicket(@RequestBody @Valid purchaseDTO: PurchaseDTO) {
        ticketService.createTicket(purchaseDTO)
    }

    @PutMapping("/API/tickets")
    fun editTicket(@RequestBody @Valid ticketDTO: TicketDTO) {
        ticketService.editTicket(ticketDTO)
    }
}
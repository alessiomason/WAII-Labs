package it.polito.wa2.server.ticketing.tickets

import it.polito.wa2.server.exceptions.RoleNotFoundException
import it.polito.wa2.server.getRoleFromJWT
import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*


@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class TicketController(
    private val ticketService: TicketService
) {
    @GetMapping("/API/tickets")
    fun getAllTickets(@AuthenticationPrincipal principal: Jwt): List<TicketDTO> {
        val role = getRoleFromJWT(principal)

        return when (role) {
            "customer" -> {
                val email = principal.getClaimAsString("email")
                ticketService.getTicketsByCustomer(email)
            }
            "expert" -> {
                val email = principal.getClaimAsString("email")
                ticketService.getTicketsByExpert(email)
            }
            "manager" -> ticketService.getAllTickets()
            else -> throw RoleNotFoundException()
        }
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
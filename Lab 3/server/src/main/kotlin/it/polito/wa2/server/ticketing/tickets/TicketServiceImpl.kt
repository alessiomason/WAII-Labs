package it.polito.wa2.server.ticketing.tickets

import it.polito.wa2.server.exceptions.ProfileNotFoundException
import it.polito.wa2.server.ticketing.employees.Expert
import it.polito.wa2.server.ticketing.employees.ExpertRepository
import it.polito.wa2.server.ticketing.purchases.PurchaseDTO
import it.polito.wa2.server.ticketing.purchases.PurchaseRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class TicketServiceImpl(
    private val ticketRepository: TicketRepository,
    private val expertRepository: ExpertRepository,
    private val purchaseRepository: PurchaseRepository
): TicketService {
    override fun getAllTickets(): List<TicketDTO> {
        return ticketRepository.findAll().map { it.toDTO() }
    }

    override fun getTicket(id: Int): TicketDTO {
        return ticketRepository.findByIdOrNull(id)?.toDTO() ?: throw ProfileNotFoundException()
    }

    override fun createTicket(purchaseDTO: PurchaseDTO) {
        val purchase = purchaseRepository.findByIdOrNull(purchaseDTO.id) ?: throw ProfileNotFoundException()

        val newTicket = Ticket(purchase)
        ticketRepository.save(newTicket)
    }

    override fun editTicket(ticketDTO: TicketDTO) {
        val ticket = ticketRepository.findByIdOrNull(ticketDTO.id) ?: throw ProfileNotFoundException()
        var expert: Expert? = null
        if (ticketDTO.expert != null)
            expert = expertRepository.findByIdOrNull(ticketDTO.expert.id) ?: throw ProfileNotFoundException()

        // modify all fields except id
        ticket.expert = expert
        ticket.ticketStatus = ticketDTO.ticketStatus
        ticket.priorityLevel = ticketDTO.priorityLevel
    }
}
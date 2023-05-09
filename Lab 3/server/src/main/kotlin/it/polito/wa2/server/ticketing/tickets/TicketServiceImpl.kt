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

    override fun createTicket(newTicketDTO: NewTicketDTO): TicketDTO {
        val purchase = purchaseRepository.findByIdOrNull(newTicketDTO.purchase.id) ?: throw ProfileNotFoundException()

        val newTicket = Ticket(newTicketDTO.title, newTicketDTO.description, purchase)
        ticketRepository.save(newTicket)

        return newTicket.toDTO()
    }

    override fun editTicketDescription(ticketDTO: TicketDTO) {
        val ticket = ticketRepository.findByIdOrNull(ticketDTO.id) ?: throw ProfileNotFoundException()

        ticket.title = ticketDTO.title
        ticket.description = ticketDTO.description
    }

    override fun editTicketProperties(ticketDTO: TicketDTO) {
        val ticket = ticketRepository.findByIdOrNull(ticketDTO.id) ?: throw ProfileNotFoundException()

        ticket.ticketStatus = ticketDTO.ticketStatus
        ticket.priorityLevel = ticketDTO.priorityLevel
    }

    override fun assignExpert(ticketDTO: TicketDTO) {
        val ticket = ticketRepository.findByIdOrNull(ticketDTO.id) ?: throw ProfileNotFoundException()
        var expert: Expert? = null
        if (ticketDTO.expert != null)
            expert = expertRepository.findByIdOrNull(ticketDTO.expert.id)

        if (expert == null)
            throw ProfileNotFoundException()

        if (ticket.ticketStatus != TicketStatus.OPEN)
            throw ProfileNotFoundException()

        ticket.expert = expert
        ticket.ticketStatus = TicketStatus.IN_PROGRESS
        ticket.priorityLevel = ticketDTO.priorityLevel
    }
}
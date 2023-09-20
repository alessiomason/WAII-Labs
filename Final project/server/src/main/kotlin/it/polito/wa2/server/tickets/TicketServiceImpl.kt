package it.polito.wa2.server.tickets

import it.polito.wa2.server.exceptions.*
import it.polito.wa2.server.employees.Expert
import it.polito.wa2.server.employees.ExpertRepository
import it.polito.wa2.server.purchases.PurchaseRepository
import jakarta.validation.constraints.Email
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

    override fun getTicketsByCustomer(@Email email: String): List<TicketDTO> {
        return ticketRepository.findByPurchaseCustomerEmail(email).map { it.toDTO() }
    }

    override fun getTicketsByExpert(@Email email: String): List<TicketDTO> {
        return ticketRepository.findByExpertEmail(email).map { it.toDTO() }
    }

    override fun getTicket(id: Int): TicketDTO {
        return ticketRepository.findByIdOrNull(id)?.toDTO() ?: throw TicketNotFoundException()
    }

    override fun createTicket(newTicketDTO: NewTicketDTO): TicketDTO {
        val purchase = purchaseRepository.findByIdOrNull(newTicketDTO.purchase.id) ?: throw PurchaseNotFoundException()

        val newTicket = Ticket(newTicketDTO.title, newTicketDTO.description, purchase)
        ticketRepository.save(newTicket)

        return newTicket.toDTO()
    }

    override fun editTicketDescription(ticketDTO: TicketDTO) {
        val ticket = ticketRepository.findByIdOrNull(ticketDTO.id) ?: throw TicketNotFoundException()

        ticket.title = ticketDTO.title
        ticket.description = ticketDTO.description

        ticketRepository.save(ticket)
    }

    override fun editTicketProperties(ticketDTO: TicketDTO) {
        val ticket = ticketRepository.findByIdOrNull(ticketDTO.id) ?: throw TicketNotFoundException()

        if (!ticketStatusTransitionAllowed(currentTicketStatus = ticket.ticketStatus, newTicketStatus = ticketDTO.ticketStatus))
            throw TicketStatusException()

        ticket.ticketStatus = ticketDTO.ticketStatus
        ticket.priorityLevel = ticketDTO.priorityLevel

        ticketRepository.save(ticket)
    }

    override fun assignExpert(ticketDTO: TicketDTO) {
        val ticket = ticketRepository.findByIdOrNull(ticketDTO.id) ?: throw TicketNotFoundException()
        var expert: Expert? = null
        if (ticketDTO.expert != null)   // ticketDTO can be null (to remove the expert), if not null, it has to be present
            expert = expertRepository.findByIdOrNull(ticketDTO.expert.id) ?: throw ExpertNotFoundException()

        if (ticket.ticketStatus != TicketStatus.OPEN && ticket.ticketStatus != TicketStatus.REOPENED)
            throw TicketStatusException()

        ticket.expert = expert
        ticket.ticketStatus = TicketStatus.IN_PROGRESS
        ticket.priorityLevel = ticketDTO.priorityLevel

        ticketRepository.save(ticket)
    }

    private fun ticketStatusTransitionAllowed(currentTicketStatus: TicketStatus, newTicketStatus: TicketStatus): Boolean {
        return when (currentTicketStatus) {
            TicketStatus.OPEN -> when (newTicketStatus) {
                TicketStatus.OPEN -> true
                TicketStatus.IN_PROGRESS -> true
                TicketStatus.CLOSED -> true
                TicketStatus.REOPENED -> false
                TicketStatus.RESOLVED -> true
            }
            TicketStatus.IN_PROGRESS -> when (newTicketStatus) {
                TicketStatus.OPEN -> true
                TicketStatus.IN_PROGRESS -> true
                TicketStatus.CLOSED -> true
                TicketStatus.REOPENED -> false
                TicketStatus.RESOLVED -> true
            }
            TicketStatus.CLOSED -> when (newTicketStatus) {
                TicketStatus.OPEN -> false
                TicketStatus.IN_PROGRESS -> false
                TicketStatus.CLOSED -> true
                TicketStatus.REOPENED -> true
                TicketStatus.RESOLVED -> false
            }
            TicketStatus.REOPENED -> when (newTicketStatus) {
                TicketStatus.OPEN -> false
                TicketStatus.IN_PROGRESS -> true
                TicketStatus.CLOSED -> true
                TicketStatus.REOPENED -> true
                TicketStatus.RESOLVED -> true
            }
            TicketStatus.RESOLVED -> when (newTicketStatus) {
                TicketStatus.OPEN -> false
                TicketStatus.IN_PROGRESS -> false
                TicketStatus.CLOSED -> true
                TicketStatus.REOPENED -> true
                TicketStatus.RESOLVED -> true
            }
        }
    }
}
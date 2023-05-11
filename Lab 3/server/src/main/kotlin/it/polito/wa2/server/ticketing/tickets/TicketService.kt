package it.polito.wa2.server.ticketing.tickets

interface TicketService {
    fun getAllTickets(): List<TicketDTO>

    fun getTicket(id: Int): TicketDTO

    fun createTicket(newTicketDTO: NewTicketDTO): TicketDTO

    /**
     * Edits the ticket title and description. Ignores other changes.
     */
    fun editTicketDescription(ticketDTO: TicketDTO)

    /**
     * Edits the ticket status and priority level. Can be used by an expert or a manager.
     */
    fun editTicketProperties(ticketDTO: TicketDTO)

    /**
     * Assigns the expert, modifies the priority level and marks the ticket status as IN_PROGRESS.
     * Set the expert to null to remove the current one.
     * Can be used only by a manager.
     *
     * Throws if the expert is not found or the ticket status is not currently OPEN.
     */
    fun assignExpert(ticketDTO: TicketDTO)
}
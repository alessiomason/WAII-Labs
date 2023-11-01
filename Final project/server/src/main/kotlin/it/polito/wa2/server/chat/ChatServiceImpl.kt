package it.polito.wa2.server.chat

import it.polito.wa2.server.customers.PersonRepository
import it.polito.wa2.server.exceptions.*
import it.polito.wa2.server.tickets.TicketRepository
import jakarta.validation.constraints.Email
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.ZonedDateTime

@Service
class ChatServiceImpl(
    private val chatRepository: ChatRepository,
    private val messageRepository: MessageRepository,
    private val ticketRepository: TicketRepository,
    private val personRepository: PersonRepository
): ChatService {
    override fun createChat(ticketId: Int): ChatDTO {
        val ticket = ticketRepository.findByIdOrNull(ticketId) ?: throw TicketNotFoundException()
        val chat = Chat(ticket)

        chatRepository.save(chat)
        ticket.chat = chat
        ticketRepository.save(ticket)

        return chat.toDTO()
    }

    override fun sendMessage(ticketId: Int, messageDTO: NewMessageDTO, @Email email: String): MessageDTO {
        val ticket = ticketRepository.findByIdOrNull(ticketId) ?: throw TicketNotFoundException()
        if (ticket.chat == null) throw ChatNotFoundException()
        if (ticket.chat!!.closed) throw ChatClosedException()

        val from = personRepository.findByEmail(email) ?: throw ProfileNotFoundException()
        val time = ZonedDateTime.now()

        val message = Message(messageDTO.text, time, from, ticket.chat!!)
        messageRepository.save(message)

        return message.toDTO()
    }

    override fun closeChat(ticketId: Int) {
        val ticket = ticketRepository.findByIdOrNull(ticketId) ?: throw TicketNotFoundException()
        if (ticket.chat == null) {
            throw ChatNotFoundException()
        }

        ticket.chat!!.closed = true
        chatRepository.save(ticket.chat!!)
    }
}
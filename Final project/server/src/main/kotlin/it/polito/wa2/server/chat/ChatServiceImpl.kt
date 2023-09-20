package it.polito.wa2.server.chat

import it.polito.wa2.server.customers.PersonRepository
import it.polito.wa2.server.exceptions.ChatClosedException
import it.polito.wa2.server.exceptions.ChatNotFoundException
import it.polito.wa2.server.exceptions.ProfileNotFoundException
import it.polito.wa2.server.exceptions.TicketNotFoundException
import it.polito.wa2.server.customers.ProfileRepository
import it.polito.wa2.server.tickets.TicketRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

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

    override fun sendMessage(ticketId: Int, messageDTO: NewMessageDTO): MessageDTO {
        val ticket = ticketRepository.findByIdOrNull(ticketId) ?: throw TicketNotFoundException()
        if (ticket.chat == null) throw ChatNotFoundException()
        if (ticket.chat!!.closed) throw ChatClosedException()

        val from = personRepository.findByIdOrNull(messageDTO.fromId) ?: throw ProfileNotFoundException()
        val to = personRepository.findByIdOrNull(messageDTO.toId) ?: throw ProfileNotFoundException()

        val message = Message(messageDTO.text, messageDTO.time, from, to, ticket.chat!!)
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
package it.polito.wa2.server.chat

import jakarta.validation.constraints.Email

interface ChatService {
    fun createChat(ticketId: Int): ChatDTO

    fun sendMessage(ticketId: Int, messageDTO: NewMessageDTO, @Email email: String): MessageDTO

    fun closeChat(ticketId: Int)
}
package it.polito.wa2.server.ticketing.chat

interface ChatService {
    fun createChat(ticketId: Int): ChatDTO

    fun sendMessage(ticketId: Int, messageDTO: NewMessageDTO): MessageDTO

    fun closeChat(ticketId: Int)
}
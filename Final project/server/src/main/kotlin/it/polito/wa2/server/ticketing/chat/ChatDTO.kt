package it.polito.wa2.server.ticketing.chat

data class ChatDTO(
    val id: Int,
    val closed: Boolean,
    val messages: List<Message>
)

fun Chat.toDTO(): ChatDTO {
    return ChatDTO(id, closed, messages)
}

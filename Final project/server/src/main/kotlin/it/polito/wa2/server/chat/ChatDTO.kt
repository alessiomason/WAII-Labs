package it.polito.wa2.server.chat

data class ChatDTO(
    val id: Int,
    val closed: Boolean,
    val messages: List<MessageDTO>
)

fun Chat.toDTO(): ChatDTO {
    return ChatDTO(id, closed, messages.map { it.toDTO() }.sortedBy { it.time })
}
package it.polito.wa2.server.chat

import it.polito.wa2.server.customers.PersonDTO
import it.polito.wa2.server.customers.toDTO
import java.time.ZonedDateTime

data class MessageDTO(
    val id: Int,
    val text: String,
    val time: ZonedDateTime,
    val from: PersonDTO
)

data class NewMessageDTO(
    val text: String
)

fun Message.toDTO(): MessageDTO {
    return MessageDTO(id, text, time, from.toDTO())
}
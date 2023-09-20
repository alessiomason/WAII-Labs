package it.polito.wa2.server.chat

import it.polito.wa2.server.customers.PersonDTO
import it.polito.wa2.server.customers.toDTO
import jakarta.validation.constraints.Email
import java.time.ZonedDateTime

data class MessageDTO(
    val id: Int,
    val text: String,
    val time: ZonedDateTime,
    val from: PersonDTO,
    val to: PersonDTO
)

data class NewMessageDTO(
    val text: String,
    val time: ZonedDateTime,
    val fromId: @Email String,
    val toId: @Email String
)

fun Message.toDTO(): MessageDTO {
    return MessageDTO(id, text, time, from.toDTO(), to.toDTO())
}
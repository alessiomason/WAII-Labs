package it.polito.wa2.server.chat

import it.polito.wa2.server.profiles.ProfileDTO
import it.polito.wa2.server.profiles.toDTO
import java.time.ZonedDateTime

data class MessageDTO(
    val id: Int,
    val text: String,
    val time: ZonedDateTime,
    val from: ProfileDTO,
    val to: ProfileDTO
)

data class NewMessageDTO(
    val text: String,
    val time: ZonedDateTime,
    val from: ProfileDTO,
    val to: ProfileDTO
)

fun Message.toDTO(): MessageDTO {
    return MessageDTO(id, text, time, from.toDTO(), to.toDTO())
}
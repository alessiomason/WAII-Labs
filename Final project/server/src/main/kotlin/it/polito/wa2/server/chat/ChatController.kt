package it.polito.wa2.server.chat

import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class ChatController(
    private val chatService: ChatService
) {
    @PostMapping("/API/tickets/{ticketId}/chat")
    fun createChat(@PathVariable ticketId: Int): ChatDTO {
        return chatService.createChat(ticketId)
    }

    @PostMapping("/API/tickets/{ticketId}/chat/messages")
    fun sendMessage(
        @PathVariable ticketId: Int,
        @RequestBody @Valid newMessageDTO: NewMessageDTO,
        @AuthenticationPrincipal principal: Jwt
    ): MessageDTO {
        val email = principal.getClaimAsString("email")

        return chatService.sendMessage(ticketId, newMessageDTO, email)
    }

    @PutMapping("/API/tickets/{ticketId}/chat")
    fun closeChat(@PathVariable ticketId: Int) {
        return chatService.closeChat(ticketId)
    }
}
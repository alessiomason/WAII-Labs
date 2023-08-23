package it.polito.wa2.server.ticketing.chat

import it.polito.wa2.server.ticketing.tickets.Ticket
import jakarta.persistence.*

@Entity
@Table(name = "chats")
class Chat(
    @OneToOne
    val ticket: Ticket
) {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    var id: Int = 0
    var closed = false
    @OneToMany(mappedBy = "chat")
    val messages = mutableListOf<Message>()
}
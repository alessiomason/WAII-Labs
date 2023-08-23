package it.polito.wa2.server.ticketing.chat

import it.polito.wa2.server.profiles.Profile
import jakarta.persistence.*
import java.time.ZonedDateTime

@Entity
@Table(name = "messages")
class Message(
    val text: String,
    val time: ZonedDateTime,
    @OneToOne
    val from: Profile,
    @OneToOne
    val to: Profile,
    @ManyToOne
    val chat: Chat
) {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    var id: Int = 0
}
package it.polito.wa2.server.ticketing.chat

import org.springframework.data.jpa.repository.JpaRepository

interface MessageRepository: JpaRepository<Message, Int>
package it.polito.wa2.server.ticketing.chat

import org.springframework.data.jpa.repository.JpaRepository

interface ChatRepository: JpaRepository<Chat, Int>
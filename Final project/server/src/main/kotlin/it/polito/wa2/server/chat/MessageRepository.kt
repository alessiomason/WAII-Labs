package it.polito.wa2.server.chat

import org.springframework.data.jpa.repository.JpaRepository

interface MessageRepository: JpaRepository<Message, Int>
package it.polito.wa2.server.ticketing.logs

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface LogRepository: JpaRepository<Log, Int> {
    fun findAllByTicketId(id: Int): List<Log>

    fun findAllByTicketExpertId(id: String): List<Log>
}
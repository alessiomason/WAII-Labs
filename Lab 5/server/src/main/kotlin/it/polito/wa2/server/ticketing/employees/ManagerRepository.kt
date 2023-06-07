package it.polito.wa2.server.ticketing.employees

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ManagerRepository: JpaRepository<Manager, Int>
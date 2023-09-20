package it.polito.wa2.server.employees

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ManagerRepository: JpaRepository<Manager, String>
package it.polito.wa2.server.employees

import org.springframework.data.jpa.repository.JpaRepository

interface ExpertSpecializationRepository: JpaRepository<ExpertSpecialization, Int>
package it.polito.wa2.server.purchases.warranties

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface WarrantyRepository: JpaRepository<Warranty, Int>
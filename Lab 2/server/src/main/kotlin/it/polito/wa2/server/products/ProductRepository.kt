package it.polito.wa2.server.products

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

// Stores and fetches things from a database, with a primary key that is a string
@Repository
interface ProductRepository: JpaRepository<Product, String>
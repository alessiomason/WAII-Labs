package it.polito.wa2.server.ticketing.purchases.warranties

import java.time.LocalDate

data class WarrantyDTO(
    val id: Int,
    val expiryDate: LocalDate
)

data class NewWarrantyDTO(
    val expiryDate: LocalDate
)

fun Warranty.toDTO(): WarrantyDTO {
    return WarrantyDTO(id, expiryDate)
}
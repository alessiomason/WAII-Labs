package it.polito.wa2.server.ticketing.purchases

import it.polito.wa2.server.products.ProductDTO
import it.polito.wa2.server.products.toDTO
import it.polito.wa2.server.profiles.ProfileDTO
import it.polito.wa2.server.profiles.toDTO

data class PurchaseDTO(
    val id: Int,
    val customer: ProfileDTO,
    val product: ProductDTO,
    val status: PurchaseStatus,
    val ticketIds: List<Int>
    // only the ids of the corresponding tickets are returned, to avoid an infinite loop of conversions to DTO
)

data class NewPurchaseDTO(
    val customer: ProfileDTO,
    val product: ProductDTO,
    val status: PurchaseStatus = PurchaseStatus.PREPARING
)

fun Purchase.toDTO(): PurchaseDTO {
    return PurchaseDTO(id, customer.toDTO(), product.toDTO(), status, tickets.map { it.id })
}

fun Purchase.toNewDTO(): NewPurchaseDTO {
    return NewPurchaseDTO(customer.toDTO(), product.toDTO(), status)
}
package it.polito.wa2.server.ticketing

import it.polito.wa2.server.products.ProductDTO
import it.polito.wa2.server.products.toDTO
import it.polito.wa2.server.profiles.ProfileDTO
import it.polito.wa2.server.profiles.toDTO

data class PurchaseDTO(
    val user: ProfileDTO,
    val product: ProductDTO,
    val tickets: Set<TicketDTO>
)

fun Purchase.toDTO(): PurchaseDTO {
    return PurchaseDTO(user.toDTO(), product.toDTO(), tickets.map { it.toDTO() }.toSet())
}
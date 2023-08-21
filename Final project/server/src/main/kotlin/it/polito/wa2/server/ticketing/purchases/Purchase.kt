package it.polito.wa2.server.ticketing.purchases

import it.polito.wa2.server.products.Product
import it.polito.wa2.server.profiles.Profile
import it.polito.wa2.server.ticketing.purchases.warranties.Warranty
import it.polito.wa2.server.ticketing.tickets.Ticket
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.temporal.ChronoUnit

enum class PurchaseStatus {
    PREPARING, SHIPPED, DELIVERED, WITHDRAWN, REFUSED, REPLACED, REPAIRED
}

@Entity
@Table(name = "purchases")
class Purchase (
    @OneToOne
    val customer: Profile,
    @OneToOne
    val product: Product,
    var status: PurchaseStatus,
    val dateOfPurchase: LocalDate,
    @OneToOne
    var warranty: Warranty? = null
) {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    var id: Int = 0
    val coveredByWarranty: Boolean
        get() {
            // standard 2 years warranty coverage
            if (ChronoUnit.DAYS.between(LocalDate.now(), dateOfPurchase.plusYears(2)) > 0)
                return true

            // specific warranty coverage
            if (warranty != null)
                return ChronoUnit.DAYS.between(LocalDate.now(), warranty!!.expiryDate) > 0

            return false
        }
    @OneToMany(mappedBy = "purchase")
    val tickets = mutableSetOf<Ticket>()
}
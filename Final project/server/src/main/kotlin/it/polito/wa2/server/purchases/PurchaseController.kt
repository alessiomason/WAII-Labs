package it.polito.wa2.server.purchases

import it.polito.wa2.server.exceptions.RoleNotFoundException
import it.polito.wa2.server.getRoleFromJWT
import it.polito.wa2.server.purchases.warranties.NewWarrantyDTO
import it.polito.wa2.server.purchases.warranties.WarrantyDTO
import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class PurchaseController(
    private val purchaseService: PurchaseService
) {
    @GetMapping("API/purchases")
    fun getPurchases(@AuthenticationPrincipal principal: Jwt): List<PurchaseDTO> {
        val role = getRoleFromJWT(principal)

        return when (role) {
            "customer" -> {
                val email = principal.getClaimAsString("email")
                purchaseService.getPurchasesByCustomer(email)
            }
            "expert", "manager" -> purchaseService.getAllPurchases()
            else -> throw RoleNotFoundException()
        }
    }

    @GetMapping("/API/purchases/{id}")
    fun getPurchaseById(@PathVariable id: Int): PurchaseDTO {
        return purchaseService.getPurchase(id)
    }

    @PostMapping("/API/purchases")
    fun createPurchase(@RequestBody @Valid newPurchaseDTO: NewPurchaseDTO): PurchaseDTO {
        return purchaseService.createPurchase(newPurchaseDTO)
    }

    @PutMapping("API/purchases/{id}")
    fun updatePurchaseStatus(@PathVariable id: Int, newPurchaseStatus: PurchaseStatus) {
        purchaseService.updatePurchaseStatus(id, newPurchaseStatus)
    }

    @PostMapping("/API/purchases/{id}/warranty")
    fun addWarranty(@PathVariable id: Int, @RequestBody @Valid newWarrantyDTO: NewWarrantyDTO): WarrantyDTO {
        return purchaseService.addWarranty(id, newWarrantyDTO)
    }
}
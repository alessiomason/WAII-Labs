package it.polito.wa2.server.ticketing.purchases

import it.polito.wa2.server.ticketing.purchases.warranties.NewWarrantyDTO
import it.polito.wa2.server.ticketing.purchases.warranties.WarrantyDTO
import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class PurchaseController(
    private val purchaseService: PurchaseService
) {
    @GetMapping("API/purchases")
    fun getPurchases(): List<PurchaseDTO> {
        return purchaseService.getAllPurchases()
    }

    @GetMapping("/API/purchases/{id}")
    fun getPurchaseById(@PathVariable id: Int): PurchaseDTO {
        return purchaseService.getPurchase(id)
    }

    @PostMapping("/API/purchases")
    fun createPurchase(@RequestBody @Valid newPurchaseDTO: NewPurchaseDTO): PurchaseDTO {
        return purchaseService.createPurchase(newPurchaseDTO)
    }

    @PostMapping("/API/purchases/{id}/warranty")
    fun addWarranty(@PathVariable id: Int, @RequestBody @Valid newWarrantyDTO: NewWarrantyDTO): WarrantyDTO {
        return purchaseService.addWarranty(id, newWarrantyDTO)
    }
}
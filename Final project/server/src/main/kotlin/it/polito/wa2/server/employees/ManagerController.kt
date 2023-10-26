package it.polito.wa2.server.employees

import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class ManagerController(
    private val managerService: ManagerService
) {
    @GetMapping("/API/managers/{id}")
    fun getManagerById(@PathVariable id: String): ManagerDTO {
        return managerService.getManager(id)
    }

    @GetMapping("/API/managersByEmail/{email}")
    fun getManagerByEmail(@PathVariable email: String): ManagerDTO {
        return managerService.getManagerByEmail(email)
    }
    @PutMapping("/API/managers")
    fun editManager(@RequestBody @Valid managerDTO: ManagerDTO) {
        managerService.editManager(managerDTO)
    }
}
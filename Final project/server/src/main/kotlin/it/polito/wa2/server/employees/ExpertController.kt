package it.polito.wa2.server.employees

import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class ExpertController(
    private val expertService: ExpertService
) {
    @GetMapping("/API/experts")
    fun getAllExperts(): List<ExpertDTO> {
        return expertService.getAllExperts()
    }

    @GetMapping("/API/experts/{id}")
    fun getExpertById(@PathVariable id: String): ExpertDTO {
        return expertService.getExpert(id)
    }

    @GetMapping("/API/expertsByEmail/{email}")
    fun getExpertByEmail(@PathVariable email: String): ExpertDTO {
        return expertService.getExpertByEmail(email)
    }

    @PutMapping("/API/experts")
    fun editExpert(@RequestBody @Valid expertDTO: ExpertDTO) {
        expertService.editExpert(expertDTO)
    }

    @PatchMapping("/API/experts/{id}/authorize")
    fun authorizeExpert(@PathVariable id: String, @RequestBody @Valid authorizedDTO: AuthorizedDTO) {
        expertService.authorizeExpert(id, authorizedDTO.authorized)
    }

    @PostMapping("/API/experts/{id}/specialization")
    fun addExpertSpecialization(@PathVariable id: String, @RequestBody @Valid newSpecialization: String): ExpertSpecializationDTO {
        return expertService.addSpecialization(id, newSpecialization)
    }

    @DeleteMapping("/API/experts/specialization")
    fun deleteSpecialization(@RequestBody @Valid specializationDTO: ExpertSpecializationDTO) {
        expertService.removeSpecialization(specializationDTO)
    }
}
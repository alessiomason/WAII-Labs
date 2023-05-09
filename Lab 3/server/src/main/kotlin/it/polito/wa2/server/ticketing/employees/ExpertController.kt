package it.polito.wa2.server.ticketing.employees

import it.polito.wa2.server.exceptions.IncoherentParametersException
import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class ExpertController(
    private val expertService: ExpertService
) {
    @GetMapping("/API/experts/{id}")
    fun getExpertById(@PathVariable id: Int): ExpertDTO {
        return expertService.getExpert(id)
    }

    @PostMapping("/API/experts")
    fun createExpert(@RequestBody @Valid expertDTO: ExpertDTO) {
        expertService.createExpert(expertDTO)
    }

    @PutMapping("/API/experts/{id}")
    fun editExpert(@PathVariable id: Int, @RequestBody @Valid expertDTO: ExpertDTO) {
        if (id != expertDTO.id)
            throw IncoherentParametersException()

        expertService.editExpert(expertDTO)
    }
}
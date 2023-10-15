package it.polito.wa2.server.customers

import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class ProfileController(
    private val profileService: ProfileService
) {
    @GetMapping("/API/profiles/{id}")
    fun getProfileById(@PathVariable id: String): ProfileDTO {
        return profileService.getProfile(id)
    }

    @GetMapping("/API/profilesByEmail/{email}")
    fun getProfileByEmail(@PathVariable email: String): ProfileDTO {
        return profileService.getProfileByEmail(email)
    }

    @PutMapping("/API/profiles")
    fun editProfile(@RequestBody @Valid profileDTO: ProfileDTO) {
        profileService.editProfile(profileDTO)
    }
}
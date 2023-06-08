package it.polito.wa2.server.profiles

import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class ProfileController(
    private val profileService: ProfileService
) {
    @GetMapping("/API/profiles/{email}")
    fun getProfileById(@PathVariable @Email email: String): ProfileDTO {
        return profileService.getProfile(email)
    }

    @PutMapping("/API/profiles")
    fun editProfile(@RequestBody @Valid profileDTO: ProfileDTO) {
        profileService.editProfile(profileDTO)
    }
}
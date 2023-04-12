package it.polito.wa2.server.profiles

import it.polito.wa2.server.exceptions.DuplicateProductException
import it.polito.wa2.server.exceptions.ProfileNotFoundException
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class ProfileController(
    private val profileService: ProfileService
) {
    @GetMapping("/API/profiles/{email}")
    fun getProfileById(@PathVariable email: String): ProfileDTO {
        return profileService.getProfile(email) ?: throw ProfileNotFoundException()
    }

    @PostMapping("/API/profiles")
    fun createProfile(@RequestBody profileDTO: ProfileDTO?) {
        if (profileDTO != null)
            profileService.createProfile(profileDTO)
        //else //TODO empty body
    }

    @PutMapping("/API/profiles/{email}")
    fun editProfile(@PathVariable email: String, @RequestBody profileDTO: ProfileDTO?) {
        if (profileDTO != null)
            profileService.editProfile(profileDTO)
    }
}
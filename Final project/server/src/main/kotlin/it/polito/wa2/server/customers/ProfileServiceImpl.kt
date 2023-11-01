package it.polito.wa2.server.customers

import it.polito.wa2.server.exceptions.ProfileNotFoundException
import it.polito.wa2.server.security.AuthenticationService
import jakarta.validation.constraints.Email
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ProfileServiceImpl(
    private val profileRepository: ProfileRepository,
    private val authenticationService: AuthenticationService
): ProfileService {
    override fun getProfile(id: String): ProfileDTO {
        return profileRepository.findByIdOrNull(id)?.toDTO() ?: throw ProfileNotFoundException()
    }

    override fun getProfileByEmail(@Email email: String): ProfileDTO {
        return profileRepository.findByEmail(email)?.toDTO() ?: throw ProfileNotFoundException()
    }

    override fun editProfile(profileDTO: ProfileDTO) {
        val profile = profileRepository.findByIdOrNull(profileDTO.id) ?: throw ProfileNotFoundException()

        // modify all fields except primary key
        profile.email = profileDTO.email
        profile.firstName = profileDTO.firstName
        profile.lastName = profileDTO.lastName
        profile.phone = profileDTO.phone

        // modify name in Keycloak
        authenticationService.editName(profileDTO.id, profileDTO.firstName, profileDTO.lastName)

        profileRepository.save(profile)
    }
}
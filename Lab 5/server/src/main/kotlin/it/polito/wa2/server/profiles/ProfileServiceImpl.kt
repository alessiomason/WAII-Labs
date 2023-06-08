package it.polito.wa2.server.profiles

import it.polito.wa2.server.exceptions.DuplicateProfileException
import it.polito.wa2.server.exceptions.ProfileNotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ProfileServiceImpl(
    private val profileRepository: ProfileRepository
): ProfileService {
    override fun getProfile(email: String): ProfileDTO {
        return profileRepository.findByIdOrNull(email)?.toDTO() ?: throw ProfileNotFoundException()
    }

    override fun editProfile(profileDTO: ProfileDTO) {
        val profile = profileRepository.findByIdOrNull(profileDTO.email) ?: throw ProfileNotFoundException()

        // modify all fields except primary key
        profile.firstName = profileDTO.firstName
        profile.lastName = profileDTO.lastName
        profile.phone = profileDTO.phone

        profileRepository.save(profile)
    }
}
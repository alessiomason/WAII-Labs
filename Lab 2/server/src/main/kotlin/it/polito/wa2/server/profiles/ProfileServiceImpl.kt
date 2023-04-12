package it.polito.wa2.server.profiles

import it.polito.wa2.server.exceptions.DuplicateProductException
import it.polito.wa2.server.exceptions.ProfileNotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ProfileServiceImpl(
    private val profileRepository: ProfileRepository
): ProfileService {
    override fun getProfile(email: String): ProfileDTO? {
        return profileRepository.findByIdOrNull(email)?.toDTO()
    }

    override fun createProfile(profileDTO: ProfileDTO) {
        if (getProfile(profileDTO.email) != null)
            throw DuplicateProductException()

        profileRepository.save(profileDTO.toProfile())
    }

    override fun editProfile(profileDTO: ProfileDTO) {
        if (getProfile(profileDTO.email) == null)
            throw ProfileNotFoundException()

        profileRepository.save(profileDTO.toProfile())
    }
}
package it.polito.wa2.server.profiles

interface ProfileService {
    fun getProfile(email: String): ProfileDTO

    fun createProfile(profileDTO: ProfileDTO)

    fun editProfile(profileDTO: ProfileDTO)
}
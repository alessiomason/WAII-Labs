package it.polito.wa2.server.profiles

interface ProfileService {
    fun getProfile(id: String): ProfileDTO

    fun editProfile(profileDTO: ProfileDTO)
}
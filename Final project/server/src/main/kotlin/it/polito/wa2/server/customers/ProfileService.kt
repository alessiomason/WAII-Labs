package it.polito.wa2.server.customers

import jakarta.validation.constraints.Email

interface ProfileService {
    fun getProfile(id: String): ProfileDTO

    fun getProfileByEmail(@Email email: String): ProfileDTO

    fun editProfile(profileDTO: ProfileDTO)
}
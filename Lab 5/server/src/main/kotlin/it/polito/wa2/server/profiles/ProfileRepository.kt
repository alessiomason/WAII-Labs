package it.polito.wa2.server.profiles

import jakarta.validation.constraints.Email
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProfileRepository: JpaRepository<Profile, String> {
    fun findByEmail(@Email email: String): Profile?
}
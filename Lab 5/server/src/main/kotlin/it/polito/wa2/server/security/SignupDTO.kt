package it.polito.wa2.server.security

import jakarta.validation.constraints.Email

data class SignupDTO(
    @Email
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String,
    val phone: String?
)

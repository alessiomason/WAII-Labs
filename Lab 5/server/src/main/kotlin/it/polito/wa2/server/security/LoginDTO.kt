package it.polito.wa2.server.security

import jakarta.validation.constraints.Email

data class LoginDTO(
    @Email
    val email: String,
    val password: String
)

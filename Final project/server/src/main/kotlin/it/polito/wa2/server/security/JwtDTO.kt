package it.polito.wa2.server.security

data class JwtDTO(
    val accessToken: String,
    val refreshToken: String
)

data class RefreshJwtDTO (
    val refreshToken: String
)
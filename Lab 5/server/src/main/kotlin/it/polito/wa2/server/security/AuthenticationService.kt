package it.polito.wa2.server.security

interface AuthenticationService {
    fun login(loginDTO: LoginDTO): JwtDTO?

    fun signup(signupDTO: SignupDTO, isExpert: Boolean): String
}
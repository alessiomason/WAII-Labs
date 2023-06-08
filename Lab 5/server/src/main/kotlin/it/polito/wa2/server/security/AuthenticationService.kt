package it.polito.wa2.server.security

interface AuthenticationService {
    fun login(loginDTO: LoginDTO): String?

    fun signup(signupDTO: SignupDTO, isExpert: Boolean): String
}
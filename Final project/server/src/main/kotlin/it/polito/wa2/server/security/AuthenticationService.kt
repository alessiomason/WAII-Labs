package it.polito.wa2.server.security

interface AuthenticationService {
    fun login(loginDTO: LoginDTO): JwtDTO?

    fun refreshLogin(refreshJwtDTO: RefreshJwtDTO): JwtDTO?

    fun signup(signupDTO: SignupDTO, isExpert: Boolean): String

    fun editName(userId: String, firstName: String, lastName: String)
}
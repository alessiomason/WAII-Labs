package it.polito.wa2.server.security

interface LoginService {
    fun login(loginDTO: LoginDTO): String?
}
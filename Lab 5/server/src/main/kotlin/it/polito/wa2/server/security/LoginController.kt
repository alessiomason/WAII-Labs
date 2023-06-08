package it.polito.wa2.server.security

import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class LoginController(private val loginService: LoginService) {

   //"http://localhost:8081/realms/wa2-products/protocol/openid-connect/logout"

    @PostMapping("/API/login")
    fun login(@RequestBody loginDTO: LoginDTO): String {
        val jwt = loginService.login(loginDTO)
        if (jwt != null) return jwt
        else throw Exception()
    }
}
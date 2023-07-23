package it.polito.wa2.server.security

import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class AuthenticationController(private val authenticationService: AuthenticationService) {
    @PostMapping("/API/login")
    fun login(@RequestBody @Valid loginDTO: LoginDTO): JwtDTO {
        return authenticationService.login(loginDTO) ?: throw Exception()
    }

    @PostMapping("/API/signup")
    fun signup(@RequestBody @Valid signupDTO: SignupDTO): String {
        return authenticationService.signup(signupDTO, false)
    }

    @PostMapping("/API/experts")
    fun createExpert(@RequestBody @Valid signupDTO: SignupDTO): String {
        return authenticationService.signup(signupDTO, true)
    }
}
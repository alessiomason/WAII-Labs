package it.polito.wa2.server.security

import jakarta.validation.Valid
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.keycloak.admin.client.KeycloakBuilder

data class LoginRequest(
    val username: String,
    val password: String
)

@RestController
@CrossOrigin("http://localhost:3000")
@Validated
class LoginController {

   //"http://localhost:8081/realms/wa2-products/protocol/openid-connect/logout"

    @PostMapping("/API/login")
    fun login(@RequestBody login: LoginRequest): String {
        val client = OkHttpClient()

        val formBody = FormBody.Builder()
            .add("grant_type", "password")
            .add("client_id", "wa2-products-client")
            .add("username", login.username)
            .add("password", login.password)
            .build()

        val request = Request.Builder()
            .url("http://localhost:8081/realms/wa2-products/protocol/openid-connect/token")
            .post(formBody)
            .build()

        val response = client.newCall(request).execute()
        val responseBody = response.body?.string()
        println(responseBody)

        response.close()
        return responseBody ?: ""
    }
}
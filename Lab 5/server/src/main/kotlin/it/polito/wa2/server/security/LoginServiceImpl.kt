package it.polito.wa2.server.security

import jakarta.transaction.Transactional
import org.keycloak.admin.client.KeycloakBuilder
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.stereotype.Service
import javax.ws.rs.core.Response
import javax.ws.rs.core.Response.status
import javax.ws.rs.NotAuthorizedException

@Service
class LoginServiceImpl: LoginService {
    @Value("\${keycloak.address}")
    private lateinit var keycloakAddress: String

    override fun login(loginDTO: LoginDTO): String? {
        val keycloak = KeycloakBuilder.builder()
            .serverUrl("http://$keycloakAddress")
            .realm("wa2-products")
            .clientId("wa2-products-client")
            .username(loginDTO.username)
            .password(loginDTO.password)
            .build()

        return try {
            keycloak.tokenManager().grantToken().token
        } catch (e: NotAuthorizedException) {
            null
        }
    }
}
package it.polito.wa2.server

import org.springframework.security.oauth2.jwt.Jwt

fun getRoleFromJWT(principal: Jwt): String {
    val rolesList = principal.getClaimAsMap("resource_access")["wa2-products-client"] as Map<*, *>
    return (rolesList["roles"] as List<*>).first() as String
}
package it.polito.wa2.server.employees

import jakarta.validation.constraints.Email

interface ManagerService {

    fun getManager(id: String): ManagerDTO

    fun getManagerByEmail(@Email email: String): ManagerDTO

    fun editManager(managerDTO: ManagerDTO)

}
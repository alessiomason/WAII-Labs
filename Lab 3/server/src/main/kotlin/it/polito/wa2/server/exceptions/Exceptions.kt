package it.polito.wa2.server.exceptions

class ProductNotFoundException: RuntimeException("Product not found!")

class ProfileNotFoundException: RuntimeException("Profile not found!")

class ExpertNotFoundException: RuntimeException("Expert not found!")

class ManagerNotFoundException: RuntimeException("Manager not found!")

class PurchaseNotFoundException: RuntimeException("Purchase not found!")

class TicketNotFoundException: RuntimeException("Ticket not found!")

class TicketStatusException: RuntimeException("Ticket status not coherent!")

class DuplicateProductException: RuntimeException("The product is already present!")

class DuplicateProfileException: RuntimeException("The profile is already present!")
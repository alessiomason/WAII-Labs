package it.polito.wa2.server.exceptions

class ProductNotFoundException: RuntimeException("Product not found!")

class ProfileNotFoundException: RuntimeException("Profile not found!")

class DuplicateProductException: RuntimeException("The product is already present!")
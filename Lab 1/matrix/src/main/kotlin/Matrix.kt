class Matrix(private val matrixAsString: String) {

    private val m = matrixAsString.lines() // remove \n or other delimitation characters
        .map{ it.split(' ') // split('') -> list of string divided by row
            .map(String::toInt) // cast to Int
        }

    fun column(colNr: Int): List<Int> {
        return m.map { r -> r[colNr -1 ] } // for each row at "colNr - 1" index, take only the first value (row and column start by 0)
    }

    fun row(rowNr: Int): List<Int> {
        return m[rowNr - 1] // take the row at "rowNr - 1" (row and column start by 0)
    }
}

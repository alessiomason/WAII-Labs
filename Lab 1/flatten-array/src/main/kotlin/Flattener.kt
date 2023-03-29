object Flattener {
    fun flatten(source: Collection<Any?>): List<Any> {
        val list: MutableList<Any> = mutableListOf()

        for (item in source) {
            if (item is Collection<Any?>)
                list.addAll(flatten(item))
            else if (item != null)
                list.add(item)
        }

        return list
    }
}

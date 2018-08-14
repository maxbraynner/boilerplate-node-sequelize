interface Filter {
    // identificador
    id: string

    // especificar outros campos possíveis para o filtro

    /**
     * quantidade de elementos retornados
     */
    qtd: string

    /**
     * inicio da paginação 
     */
    init: string
}

export default Filter;
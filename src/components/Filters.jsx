

const Filters = ({ filters, applyFilters, handleFilterChange}) => {
    return (<>
        <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="Категория"
            className="form-control mb-2"
        />
        <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Минимальная цена"
            className="form-control mb-2"
        />
        <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Максимальная цена"
            className="form-control mb-2"
        />
        <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="form-control mb-2"
        >
            <option value="">Выберите сортировку</option>
            <option value="cheap">По цене (от дешевых к дорогим)</option>
            <option value="expensive">По цене (от дорогих к дешевым)</option>
            <option value="alphabet">По алфавиту</option>
        </select>
        <button onClick={applyFilters} className="btn btn-primary mt-2">
            Применить фильтры
        </button>
    </>)
}

export { Filters }
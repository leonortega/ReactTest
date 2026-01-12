using StocksApi.Stocks.Models;

namespace StocksApi.Shared;

public interface IStockRepository
{
    Task<IEnumerable<StockValue>> GetStockValuesAsync(string companyId, DateOnly date);
}

using MediatR;
using StocksApi.Stocks.Models;

namespace StocksApi.Stocks;

public record GetStockValuesQuery(string CompanyId, DateOnly Date) : IRequest<IEnumerable<StockValue>>;

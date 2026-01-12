using MediatR;
using StocksApi.Shared;
using StocksApi.Stocks.Models;

namespace StocksApi.Stocks;

public class GetStockValueHandler : IRequestHandler<GetStockValuesQuery, IEnumerable<StockValue>>
{
    private readonly IStockRepository _repo;

    public GetStockValueHandler(IStockRepository repo) => _repo = repo;

    public Task<IEnumerable<StockValue>> Handle(GetStockValuesQuery request, CancellationToken cancellationToken)
        => _repo.GetStockValuesAsync(request.CompanyId, request.Date);
}

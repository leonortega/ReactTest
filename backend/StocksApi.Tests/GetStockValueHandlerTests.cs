using System;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using StocksApi.Shared;
using StocksApi.Stocks;
using StocksApi.Stocks.Models;
using Xunit;

namespace StocksApi.Tests;

public class GetStockValueHandlerTests
{
    [Fact]
    public async Task Handle_UsesRepositoryWithRequestValues()
    {
        var repo = new Mock<IStockRepository>(MockBehavior.Strict);
        var date = new DateOnly(2024, 1, 1);
        var expected = new[] { new StockValue("ABC", new DateTime(2024, 1, 1, 10, 0, 0, DateTimeKind.Utc), 123.45m) };

        repo.Setup(r => r.GetStockValuesAsync("ABC", date))
            .ReturnsAsync(expected);

        var handler = new GetStockValueHandler(repo.Object);

        var result = await handler.Handle(new GetStockValuesQuery("ABC", date), CancellationToken.None);

        Assert.Same(expected, result);
        repo.Verify(r => r.GetStockValuesAsync("ABC", date), Times.Once);
    }
}

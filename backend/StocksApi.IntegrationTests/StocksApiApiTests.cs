using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace StocksApi.IntegrationTests;

public class StocksApiApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public StocksApiApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetStocks_ReturnsOkAndArray()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/stocks/ABC?date=2024-01-01");

        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(payload);

        Assert.Equal(JsonValueKind.Array, doc.RootElement.ValueKind);
        Assert.NotEmpty(doc.RootElement.EnumerateArray());
    }

    [Fact]
    public async Task GetStocks_MissingDate_ReturnsBadRequest()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/stocks/ABC");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetStocks_ResponseMatchesContract()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/stocks/ABC?date=2024-01-01");

        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(payload);

        foreach (var item in doc.RootElement.EnumerateArray())
        {
            Assert.True(item.TryGetProperty("companyId", out var companyId));
            Assert.Equal(JsonValueKind.String, companyId.ValueKind);

            Assert.True(item.TryGetProperty("dateTime", out var dateTime));
            Assert.Equal(JsonValueKind.String, dateTime.ValueKind);

            Assert.True(item.TryGetProperty("price", out var price));
            Assert.True(price.ValueKind is JsonValueKind.Number);
        }
    }
}

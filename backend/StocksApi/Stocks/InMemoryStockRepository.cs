using StocksApi.Shared;
using StocksApi.Stocks.Models;

namespace StocksApi.Stocks;

public class InMemoryStockRepository : IStockRepository
{
    private readonly List<StockValue> _data;
    private static readonly Random _rnd = new Random();

    public InMemoryStockRepository()
    {
        _data = new List<StockValue>
        {
            new StockValue("ABC", new DateTime(2024,1,1,10,0,0, DateTimeKind.Utc), 100.5m),
            new StockValue("ABC", new DateTime(2024,1,1,11,0,0, DateTimeKind.Utc), 101.2m),
            new StockValue("XYZ", new DateTime(2024,1,1,10,0,0, DateTimeKind.Utc), 50.0m),
        };
    }

    public Task<IEnumerable<StockValue>> GetStockValuesAsync(string companyId, DateOnly date)
    {
        lock (_data)
        {
            // All items for this company
            var companyItems = _data.Where(s => string.Equals(s.CompanyId, companyId, StringComparison.OrdinalIgnoreCase)).ToList();

            // Existing items on the requested date
            var existingForDate = companyItems.Where(s => DateOnly.FromDateTime(s.DateTime) == date).OrderBy(s => s.DateTime).ToList();

            // Date range for requested date (UTC)
            var dateStart = DateTime.SpecifyKind(date.ToDateTime(new TimeOnly(0, 0)), DateTimeKind.Utc);
            var dateEnd = DateTime.SpecifyKind(date.ToDateTime(new TimeOnly(23, 59)), DateTimeKind.Utc);

            decimal startingPrice = 100m;
            var latestCompanyItem = companyItems.OrderByDescending(s => s.DateTime).FirstOrDefault();
            if (latestCompanyItem != null)
            {
                startingPrice = latestCompanyItem.Price;
            }

            var newPoints = new List<StockValue>();
            if (!existingForDate.Any())
            {
                // Create two points at 00:00 and 00:01 (UTC) with random small changes from startingPrice
                var timeUtc1 = dateStart;
                var timeUtc2 = dateStart.AddMinutes(1);

                if (timeUtc1 >= dateStart && timeUtc1 <= dateEnd)
                {
                    var change = (_rnd.NextDouble() - 0.5) * 0.5;
                    startingPrice = Math.Round(startingPrice + (decimal)change, 2);
                    var point1 = new StockValue(companyId, DateTime.SpecifyKind(timeUtc1, DateTimeKind.Utc), startingPrice);
                    newPoints.Add(point1);
                    _data.Add(point1);
                }

                if (timeUtc2 >= dateStart && timeUtc2 <= dateEnd)
                {
                    var change = (_rnd.NextDouble() - 0.5) * 0.5;
                    startingPrice = Math.Round(startingPrice + (decimal)change, 2);
                    var point2 = new StockValue(companyId, DateTime.SpecifyKind(timeUtc2, DateTimeKind.Utc), startingPrice);
                    newPoints.Add(point2);
                    _data.Add(point2);
                }
            }
            else
            {
                var candidateTimeUtc = existingForDate.Max(s => s.DateTime).ToUniversalTime().AddMinutes(1);
                if (candidateTimeUtc < dateStart)
                    candidateTimeUtc = dateStart;

                if (candidateTimeUtc <= dateEnd && DateOnly.FromDateTime(candidateTimeUtc) == date)
                {
                    var change = (_rnd.NextDouble() - 0.5) * 0.5;
                    var price = Math.Round(startingPrice + (decimal)change, 2);
                    var newPoint = new StockValue(companyId, DateTime.SpecifyKind(candidateTimeUtc, DateTimeKind.Utc), price);
                    newPoints.Add(newPoint);
                    _data.Add(newPoint);
                }
            }

            var result = existingForDate.Concat(newPoints).OrderBy(s => s.DateTime);
            return Task.FromResult(result.AsEnumerable());
        }
    }
}

(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/_hooks/useStocks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStocks",
    ()=>useStocks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useStocks(companyId, date, options) {
    _s();
    const [stockData, setStockData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(options?.initialData ?? []);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(options?.initialData ? 'success' : 'idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFetching, setIsFetching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastFetchTime, setLastFetchTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(options?.initialLastFetchTime ?? null);
    const initialKeyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(`${companyId}-${date}`);
    const hasUsedInitialRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const fetchStocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useStocks.useCallback[fetchStocks]": ()=>{
            if (!companyId || !date) return;
            setStatus('loading');
            setIsFetching(true);
            setError(null);
            const view = options?.view ?? 'intraday';
            const url = `/api/stocks?companyId=${encodeURIComponent(companyId)}&date=${encodeURIComponent(date)}&view=${encodeURIComponent(view)}`;
            fetch(url).then({
                "useStocks.useCallback[fetchStocks]": (res)=>{
                    if (!res.ok) throw new Error('Failed to fetch stocks');
                    return res.json();
                }
            }["useStocks.useCallback[fetchStocks]"]).then({
                "useStocks.useCallback[fetchStocks]": (data)=>{
                    setStockData(data);
                    setStatus('success');
                    setLastFetchTime(Date.now());
                }
            }["useStocks.useCallback[fetchStocks]"]).catch({
                "useStocks.useCallback[fetchStocks]": (err)=>{
                    setError(err.message);
                    setStatus('error');
                }
            }["useStocks.useCallback[fetchStocks]"]).finally({
                "useStocks.useCallback[fetchStocks]": ()=>setIsFetching(false)
            }["useStocks.useCallback[fetchStocks]"]);
        }
    }["useStocks.useCallback[fetchStocks]"], [
        companyId,
        date,
        options?.view
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStocks.useEffect": ()=>{
            if (!(companyId && date)) return;
            const key = `${companyId}-${date}`;
            if (!hasUsedInitialRef.current && options?.initialData && key === initialKeyRef.current) {
                hasUsedInitialRef.current = true;
                return;
            }
            fetchStocks();
        }
    }["useStocks.useEffect"], [
        companyId,
        date,
        fetchStocks,
        options?.initialData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStocks.useEffect": ()=>{
            if (!(companyId && date)) return;
            const id = window.setInterval({
                "useStocks.useEffect.id": ()=>{
                    fetchStocks();
                }
            }["useStocks.useEffect.id"], 5000);
            return ({
                "useStocks.useEffect": ()=>window.clearInterval(id)
            })["useStocks.useEffect"];
        }
    }["useStocks.useEffect"], [
        companyId,
        date,
        fetchStocks
    ]);
    return {
        stockData,
        status,
        error,
        refetch: fetchStocks,
        isFetching,
        lastFetchTime
    };
}
_s(useStocks, "M6drVYtATi300t2rapd2ATohE0A=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/_components/StockChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StockChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-chartjs-2/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerables"]);
function formatTimeLabel(iso) {
    const d = new Date(iso);
    return d.toISOString().slice(11, 16);
}
function computeSMA(values, window) {
    if (window <= 1) return values.slice();
    const result = [];
    for(let i = 0; i < values.length; i++){
        const start = Math.max(0, i - window + 1);
        const slice = values.slice(start, i + 1);
        const avg = slice.reduce((s, v)=>s + v, 0) / slice.length;
        result.push(Number(avg.toFixed(2)));
    }
    return result;
}
function computeEMA(values, window) {
    if (window <= 1) return values.slice();
    const multiplier = 2 / (window + 1);
    const result = [];
    for(let i = 0; i < values.length; i++){
        if (i === 0) {
            result.push(values[i]);
            continue;
        }
        const prev = result[i - 1];
        const next = (values[i] - prev) * multiplier + prev;
        result.push(Number(next.toFixed(2)));
    }
    return result;
}
function computeRSI(values, window) {
    if (window <= 1) return values.map(()=>50);
    const result = [];
    let avgGain = 0;
    let avgLoss = 0;
    for(let i = 1; i < values.length; i++){
        const diff = values[i] - values[i - 1];
        const gain = Math.max(diff, 0);
        const loss = Math.abs(Math.min(diff, 0));
        if (i <= window) {
            avgGain += gain;
            avgLoss += loss;
            result.push(50);
        } else {
            avgGain = (avgGain * (window - 1) + gain) / window;
            avgLoss = (avgLoss * (window - 1) + loss) / window;
            const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            const rsi = 100 - 100 / (1 + rs);
            result.push(Number(rsi.toFixed(2)));
        }
    }
    return [
        50,
        ...result
    ].slice(0, values.length);
}
function StockChart({ stockData = [], loading = false, showPoints = false, showSMA = true, showEMA = false, showRSI = false, smaWindow = 5, emaWindow = 8, rsiWindow = 14, error = null }) {
    _s();
    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StockChart.useMemo[chartData]": ()=>{
            if (!stockData || stockData.length === 0) return null;
            const points = stockData.map({
                "StockChart.useMemo[chartData].points": (p)=>({
                        t: new Date(p.dateTime),
                        price: Number(p.price)
                    })
            }["StockChart.useMemo[chartData].points"]).sort({
                "StockChart.useMemo[chartData].points": (a, b)=>a.t.getTime() - b.t.getTime()
            }["StockChart.useMemo[chartData].points"]);
            const labels = points.map({
                "StockChart.useMemo[chartData].labels": (p)=>formatTimeLabel(p.t.toISOString())
            }["StockChart.useMemo[chartData].labels"]);
            const prices = points.map({
                "StockChart.useMemo[chartData].prices": (p)=>Number(p.price)
            }["StockChart.useMemo[chartData].prices"]);
            const sma = computeSMA(prices, smaWindow);
            const ema = computeEMA(prices, emaWindow);
            const rsi = computeRSI(prices, rsiWindow);
            return {
                labels,
                prices,
                sma,
                ema,
                rsi
            };
        }
    }["StockChart.useMemo[chartData]"], [
        stockData,
        smaWindow,
        emaWindow,
        rsiWindow
    ]);
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StockChart.useMemo[options]": ()=>({
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: ({
                                "StockChart.useMemo[options]": (items)=>{
                                    if (!items || !items[0]) return '';
                                    return String(items[0].label);
                                }
                            })["StockChart.useMemo[options]"]
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time (UTC)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price'
                        }
                    },
                    rsi: showRSI ? {
                        display: true,
                        position: 'right',
                        min: 0,
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'RSI'
                        }
                    } : undefined
                }
            })
    }["StockChart.useMemo[options]"], [
        showRSI
    ]);
    const dataForChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StockChart.useMemo[dataForChart]": ()=>{
            if (!chartData) return {
                labels: [],
                datasets: []
            };
            const datasets = [
                {
                    label: 'Price',
                    data: chartData.prices,
                    borderColor: '#1f77b4',
                    backgroundColor: 'rgba(31,119,180,0.08)',
                    tension: 0.2,
                    pointRadius: showPoints ? 3 : 0,
                    borderWidth: 2
                }
            ];
            if (showSMA) {
                datasets.push({
                    label: `SMA (${smaWindow})`,
                    data: chartData.sma,
                    borderColor: '#ff7f0e',
                    backgroundColor: 'rgba(255,127,14,0.05)',
                    tension: 0.2,
                    pointRadius: 0,
                    borderDash: [
                        6,
                        4
                    ],
                    borderWidth: 2
                });
            }
            if (showEMA) {
                datasets.push({
                    label: `EMA (${emaWindow})`,
                    data: chartData.ema,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.05)',
                    tension: 0.2,
                    pointRadius: 0,
                    borderWidth: 2
                });
            }
            if (showRSI) {
                datasets.push({
                    label: `RSI (${rsiWindow})`,
                    data: chartData.rsi,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139,92,246,0.05)',
                    tension: 0.2,
                    pointRadius: 0,
                    borderWidth: 2,
                    yAxisID: 'rsi'
                });
            }
            return {
                labels: chartData.labels,
                datasets
            };
        }
    }["StockChart.useMemo[dataForChart]"], [
        chartData,
        showPoints,
        showSMA,
        smaWindow,
        showEMA,
        emaWindow,
        showRSI,
        rsiWindow
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rs-chart box-border h-[380px] w-full overflow-hidden bg-white p-3",
        "aria-busy": loading,
        "aria-label": "Stock chart",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "error-message",
                role: "alert",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Error:"
                    }, void 0, false, {
                        fileName: "[project]/app/_components/StockChart.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    " ",
                    String(error)
                ]
            }, void 0, true, {
                fileName: "[project]/app/_components/StockChart.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this),
            chartData && chartData.labels.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                data: dataForChart,
                options: options
            }, void 0, false, {
                fileName: "[project]/app/_components/StockChart.tsx",
                lineNumber: 222,
                columnNumber: 9
            }, this) : !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "last-fetch",
                children: "No data"
            }, void 0, false, {
                fileName: "[project]/app/_components/StockChart.tsx",
                lineNumber: 224,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/_components/StockChart.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_s(StockChart, "8J1EOiJR6N+U8S2Gf4IQamBYxqo=");
_c = StockChart;
var _c;
__turbopack_context__.k.register(_c, "StockChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/_components/StockControls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function StockControls({ tempCompanyId, tempDate, onTempCompanyIdChange, onTempDateChange, onSubmit, enabled, loading }) {
    _s();
    const handleSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StockControls.useCallback[handleSubmit]": (event)=>{
            event.preventDefault();
            onSubmit();
        }
    }["StockControls.useCallback[handleSubmit]"], [
        onSubmit
    ]);
    const handleCompanyChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StockControls.useCallback[handleCompanyChange]": (event)=>{
            onTempCompanyIdChange(event.target.value);
        }
    }["StockControls.useCallback[handleCompanyChange]"], [
        onTempCompanyIdChange
    ]);
    const handleDateChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StockControls.useCallback[handleDateChange]": (event)=>{
            onTempDateChange(event.target.value);
        }
    }["StockControls.useCallback[handleDateChange]"], [
        onTempDateChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        className: "mb-3 flex flex-wrap items-end gap-3",
        onSubmit: handleSubmit,
        "aria-label": "Stock query form",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "control-label mb-1 block",
                        htmlFor: "company-input",
                        children: "Company ID"
                    }, void 0, false, {
                        fileName: "[project]/app/_components/StockControls.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "company-input",
                        "aria-label": "Company ID",
                        value: tempCompanyId || '',
                        onChange: handleCompanyChange,
                        className: "input-base"
                    }, void 0, false, {
                        fileName: "[project]/app/_components/StockControls.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/_components/StockControls.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "control-label mb-1 block",
                        htmlFor: "date-input",
                        children: "Date"
                    }, void 0, false, {
                        fileName: "[project]/app/_components/StockControls.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "date-input",
                        "aria-label": "Date",
                        type: "date",
                        value: tempDate || '',
                        onChange: handleDateChange,
                        className: "input-base"
                    }, void 0, false, {
                        fileName: "[project]/app/_components/StockControls.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/_components/StockControls.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "btn-primary",
                    type: "submit",
                    "aria-label": "Refresh data",
                    disabled: !enabled || loading,
                    children: loading ? 'Loading...' : 'Refresh now'
                }, void 0, false, {
                    fileName: "[project]/app/_components/StockControls.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/_components/StockControls.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/_components/StockControls.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s(StockControls, "Knnzp2bsWX2bBHsW+7/wxBSvkp8=");
_c = StockControls;
const __TURBOPACK__default__export__ = /*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(StockControls);
var _c, _c1;
__turbopack_context__.k.register(_c, "StockControls");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/_components/ToggleOption.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
function ToggleOption({ label, checked, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "control-label inline-flex items-center gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                checked: checked,
                onChange: (e)=>onChange(e.target.checked),
                className: "form-checkbox"
            }, void 0, false, {
                fileName: "[project]/app/_components/ToggleOption.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/_components/ToggleOption.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/_components/ToggleOption.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = ToggleOption;
const __TURBOPACK__default__export__ = /*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(ToggleOption);
var _c, _c1;
__turbopack_context__.k.register(_c, "ToggleOption");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/public/logo.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/logo.033d0095.svg");}),
"[project]/public/logo.svg.mjs { IMAGE => \"[project]/public/logo.svg (static in ecmascript, tag client)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/public/logo.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 40,
    height: 40,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/_components/AppClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_hooks$2f$useStocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_hooks/useStocks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$StockChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/StockChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$StockControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/StockControls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$ToggleOption$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/ToggleOption.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/logo.svg.mjs { IMAGE => "[project]/public/logo.svg (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function AppClient({ initialCompanyId = 'ABC', initialDate = '2024-01-01', initialStockData, initialLastFetchTime, initialView = 'intraday' }) {
    _s();
    const [companyId, setCompanyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialCompanyId);
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialDate);
    const [tempCompanyId, setTempCompanyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(companyId);
    const [tempDate, setTempDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(date);
    const [showPoints, setShowPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSMA, setShowSMA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showEMA, setShowEMA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRSI, setShowRSI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [smaWindow, setSmaWindow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [emaWindow, setEmaWindow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(8);
    const [rsiWindow, setRsiWindow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(14);
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialView);
    const debounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppClient.useEffect": ()=>{
            clearTimeout(debounceRef.current);
            debounceRef.current = window.setTimeout({
                "AppClient.useEffect": ()=>{
                    setCompanyId({
                        "AppClient.useEffect": (prev)=>{
                            if (prev !== tempCompanyId) return tempCompanyId;
                            return prev;
                        }
                    }["AppClient.useEffect"]);
                    setDate({
                        "AppClient.useEffect": (prev)=>{
                            if (prev !== tempDate) return tempDate;
                            return prev;
                        }
                    }["AppClient.useEffect"]);
                }
            }["AppClient.useEffect"], 600);
            return ({
                "AppClient.useEffect": ()=>clearTimeout(debounceRef.current)
            })["AppClient.useEffect"];
        }
    }["AppClient.useEffect"], [
        tempCompanyId,
        tempDate
    ]);
    const { stockData = [], status, error, refetch, isFetching, lastFetchTime } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_hooks$2f$useStocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStocks"])(companyId, date, {
        initialData: initialStockData,
        initialLastFetchTime,
        view
    });
    const [localLastFetchTime, setLocalLastFetchTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppClient.useEffect": ()=>{
            if (!isFetching && status === 'success') {
                setLocalLastFetchTime(new Date());
            }
        }
    }["AppClient.useEffect"], [
        isFetching,
        status,
        stockData
    ]);
    const loading = status === 'loading' || isFetching;
    const handleTempCompanyIdChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleTempCompanyIdChange]": (value)=>{
            setTempCompanyId(value);
        }
    }["AppClient.useCallback[handleTempCompanyIdChange]"], []);
    const handleTempDateChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleTempDateChange]": (value)=>{
            setTempDate(value);
        }
    }["AppClient.useCallback[handleTempDateChange]"], []);
    const handleSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleSubmit]": ()=>{
            refetch();
        }
    }["AppClient.useCallback[handleSubmit]"], [
        refetch
    ]);
    const handleShowPointsChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleShowPointsChange]": (checked)=>{
            setShowPoints(checked);
        }
    }["AppClient.useCallback[handleShowPointsChange]"], []);
    const handleShowSmaChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleShowSmaChange]": (checked)=>{
            setShowSMA(checked);
        }
    }["AppClient.useCallback[handleShowSmaChange]"], []);
    const handleShowEmaChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleShowEmaChange]": (checked)=>{
            setShowEMA(checked);
        }
    }["AppClient.useCallback[handleShowEmaChange]"], []);
    const handleShowRsiChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleShowRsiChange]": (checked)=>{
            setShowRSI(checked);
        }
    }["AppClient.useCallback[handleShowRsiChange]"], []);
    const handleSmaWindowChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleSmaWindowChange]": (value)=>{
            setSmaWindow(Number(value) || 1);
        }
    }["AppClient.useCallback[handleSmaWindowChange]"], []);
    const handleEmaWindowChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleEmaWindowChange]": (value)=>{
            setEmaWindow(Number(value) || 1);
        }
    }["AppClient.useCallback[handleEmaWindowChange]"], []);
    const handleRsiWindowChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleRsiWindowChange]": (value)=>{
            setRsiWindow(Number(value) || 1);
        }
    }["AppClient.useCallback[handleRsiWindowChange]"], []);
    const handleViewChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppClient.useCallback[handleViewChange]": (value)=>{
            setView(value);
        }
    }["AppClient.useCallback[handleViewChange]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 text-slate-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                className: "sr-only focus:not-sr-only",
                href: "#main",
                children: "Skip to content"
            }, void 0, false, {
                fileName: "[project]/app/_components/AppClient.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "main",
                role: "main",
                className: "mx-auto max-w-[980px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "mb-2 flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                alt: "React Stocks logo",
                                width: 40,
                                height: 40,
                                priority: true
                            }, void 0, false, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "site-title",
                                        children: "MarketPulse Analytics"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "site-subtitle",
                                        children: "Live stock visualization"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/_components/AppClient.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$StockControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        tempCompanyId: tempCompanyId,
                        tempDate: tempDate,
                        onTempCompanyIdChange: handleTempCompanyIdChange,
                        onTempDateChange: handleTempDateChange,
                        onSubmit: handleSubmit,
                        enabled: Boolean(companyId && date),
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/app/_components/AppClient.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "last-fetch",
                        children: localLastFetchTime || lastFetchTime ? `Last API call: ${new Date(localLastFetchTime ?? lastFetchTime).toLocaleString()}` : 'No API calls yet'
                    }, void 0, false, {
                        fileName: "[project]/app/_components/AppClient.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 flex flex-wrap items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$ToggleOption$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Show points",
                                checked: showPoints,
                                onChange: handleShowPointsChange
                            }, void 0, false, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$ToggleOption$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Show SMA",
                                checked: showSMA,
                                onChange: handleShowSmaChange
                            }, void 0, false, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$ToggleOption$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Show EMA",
                                checked: showEMA,
                                onChange: handleShowEmaChange
                            }, void 0, false, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$ToggleOption$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Show RSI",
                                checked: showRSI,
                                onChange: handleShowRsiChange
                            }, void 0, false, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "control-label inline-flex items-center gap-2 text-sm text-slate-900",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "View"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        "aria-label": "Data view",
                                        value: view,
                                        onChange: (e)=>handleViewChange(e.target.value),
                                        className: "input-base",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "intraday",
                                                children: "Intraday"
                                            }, void 0, false, {
                                                fileName: "[project]/app/_components/AppClient.tsx",
                                                lineNumber: 175,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "historical",
                                                children: "Historical"
                                            }, void 0, false, {
                                                fileName: "[project]/app/_components/AppClient.tsx",
                                                lineNumber: 176,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            showSMA && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "control-label inline-flex items-center gap-2 text-sm text-slate-900",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Window"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        "aria-label": "SMA window",
                                        type: "number",
                                        min: 1,
                                        value: smaWindow,
                                        onChange: (e)=>handleSmaWindowChange(e.target.value),
                                        className: "small-input"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this),
                            showEMA && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "control-label inline-flex items-center gap-2 text-sm text-slate-900",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "EMA"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        "aria-label": "EMA window",
                                        type: "number",
                                        min: 1,
                                        value: emaWindow,
                                        onChange: (e)=>handleEmaWindowChange(e.target.value),
                                        className: "small-input"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this),
                            showRSI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "control-label inline-flex items-center gap-2 text-sm text-slate-900",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "RSI"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        "aria-label": "RSI window",
                                        type: "number",
                                        min: 1,
                                        value: rsiWindow,
                                        onChange: (e)=>handleRsiWindowChange(e.target.value),
                                        className: "small-input"
                                    }, void 0, false, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 212,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/_components/AppClient.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$StockChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        stockData: stockData,
                        loading: loading,
                        showPoints: showPoints,
                        showSMA: showSMA,
                        showEMA: showEMA,
                        showRSI: showRSI,
                        smaWindow: smaWindow,
                        emaWindow: emaWindow,
                        rsiWindow: rsiWindow,
                        error: error
                    }, void 0, false, {
                        fileName: "[project]/app/_components/AppClient.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mt-3 max-h-[200px] overflow-auto text-sm text-slate-900",
                        "aria-label": "Stock data table",
                        children: stockData && stockData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full border-collapse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "p-2 text-left",
                                                children: "Time (UTC)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/_components/AppClient.tsx",
                                                lineNumber: 247,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "p-2 text-left",
                                                children: "Price"
                                            }, void 0, false, {
                                                fileName: "[project]/app/_components/AppClient.tsx",
                                                lineNumber: 248,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/_components/AppClient.tsx",
                                        lineNumber: 246,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/_components/AppClient.tsx",
                                    lineNumber: 245,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: stockData.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "odd:bg-white even:bg-slate-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-2 align-top",
                                                    children: new Date(s.dateTime).toISOString()
                                                }, void 0, false, {
                                                    fileName: "[project]/app/_components/AppClient.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "p-2 align-top",
                                                    children: Number(s.price).toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/_components/AppClient.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, s.dateTime, true, {
                                            fileName: "[project]/app/_components/AppClient.tsx",
                                            lineNumber: 253,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/_components/AppClient.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/_components/AppClient.tsx",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/_components/AppClient.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "mt-4 text-sm text-slate-500",
                        children: [
                            "This page calls the backend Stocks API at ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                children: "/api/stocks"
                            }, void 0, false, {
                                fileName: "[project]/app/_components/AppClient.tsx",
                                lineNumber: 264,
                                columnNumber: 53
                            }, this),
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/_components/AppClient.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/_components/AppClient.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/_components/AppClient.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_s(AppClient, "6yosI9itxFXSFkq8wJBC/r9an/Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_hooks$2f$useStocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStocks"]
    ];
});
_c = AppClient;
var _c;
__turbopack_context__.k.register(_c, "AppClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_16d7fc8a._.js.map
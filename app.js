/**
 * GMT 320: Geoinformatics Project - Spatial Economic Activity Dashboard
 * Pure Vanilla JavaScript Data Manipulation & Chart.js Visualisation Engine
 */

// Global State
let rawDataset = [];
let chartInstances = {
  lineChart: null,
  barChart: null,
  doughnutChart: null
};

// Province Metadata & Full Names Mapping
const PROVINCE_NAMES = {
  EC: "Eastern Cape",
  FS: "Free State",
  GT: "Gauteng",
  KZN: "KwaZulu-Natal",
  LIM: "Limpopo",
  MP: "Mpumalanga",
  NC: "Northern Cape",
  NW: "North West",
  WC: "Western Cape",
  "Unknown Location - Head Office Anomaly": "Head Office / Other"
};

// Colors for Provinces
const PROVINCE_COLORS = {
  EC: "#38bdf8",
  FS: "#fbbf24",
  GT: "#818cf8",
  KZN: "#34d399",
  LIM: "#f43f5e",
  MP: "#f97316",
  NC: "#a855f7",
  NW: "#06b6d4",
  WC: "#ec4899",
  "Unknown Location - Head Office Anomaly": "#64748b"
};

// Raw Fallback Dataset (ensures dashboard runs when double-clicking locally under file:// without CORS issues)
const EMBEDDED_FALLBACK_DATA = [
  { PROVINCE: "EC", TaxYear: 2014, MedianIncome: 13723.83, FTE: 676049.75 },
  { PROVINCE: "EC", TaxYear: 2015, MedianIncome: 13552.70, FTE: 681157.92 },
  { PROVINCE: "EC", TaxYear: 2016, MedianIncome: 13386.99, FTE: 684309.79 },
  { PROVINCE: "EC", TaxYear: 2017, MedianIncome: 13515.24, FTE: 680495.22 },
  { PROVINCE: "EC", TaxYear: 2018, MedianIncome: 13434.35, FTE: 691461.41 },
  { PROVINCE: "EC", TaxYear: 2019, MedianIncome: 13204.67, FTE: 705215.73 },
  { PROVINCE: "EC", TaxYear: 2020, MedianIncome: 13104.51, FTE: 722554.75 },
  { PROVINCE: "EC", TaxYear: 2021, MedianIncome: 11875.24, FTE: 723361.22 },
  { PROVINCE: "EC", TaxYear: 2022, MedianIncome: 12110.37, FTE: 727342.67 },
  { PROVINCE: "EC", TaxYear: 2023, MedianIncome: 11703.78, FTE: 730695.08 },
  { PROVINCE: "EC", TaxYear: 2024, MedianIncome: 11289.01, FTE: 748224.90 },
  { PROVINCE: "EC", TaxYear: 2025, MedianIncome: 12000.00, FTE: 710285.68 },
  { PROVINCE: "FS", TaxYear: 2014, MedianIncome: 14716.53, FTE: 405459.47 },
  { PROVINCE: "FS", TaxYear: 2015, MedianIncome: 14684.89, FTE: 406080.15 },
  { PROVINCE: "FS", TaxYear: 2016, MedianIncome: 14642.85, FTE: 404924.12 },
  { PROVINCE: "FS", TaxYear: 2017, MedianIncome: 15091.10, FTE: 405157.62 },
  { PROVINCE: "FS", TaxYear: 2018, MedianIncome: 15314.31, FTE: 411306.63 },
  { PROVINCE: "FS", TaxYear: 2019, MedianIncome: 14287.71, FTE: 407533.19 },
  { PROVINCE: "FS", TaxYear: 2020, MedianIncome: 13923.04, FTE: 414551.72 },
  { PROVINCE: "FS", TaxYear: 2021, MedianIncome: 13538.87, FTE: 403047.94 },
  { PROVINCE: "FS", TaxYear: 2022, MedianIncome: 14245.47, FTE: 405919.41 },
  { PROVINCE: "FS", TaxYear: 2023, MedianIncome: 13758.99, FTE: 404550.23 },
  { PROVINCE: "FS", TaxYear: 2024, MedianIncome: 13292.22, FTE: 405570.12 },
  { PROVINCE: "FS", TaxYear: 2025, MedianIncome: 13426.28, FTE: 393922.44 },
  { PROVINCE: "GT", TaxYear: 2014, MedianIncome: 14862.98, FTE: 3613798.98 },
  { PROVINCE: "GT", TaxYear: 2015, MedianIncome: 14568.97, FTE: 3724396.86 },
  { PROVINCE: "GT", TaxYear: 2016, MedianIncome: 14876.10, FTE: 3752561.02 },
  { PROVINCE: "GT", TaxYear: 2017, MedianIncome: 14711.10, FTE: 3834634.51 },
  { PROVINCE: "GT", TaxYear: 2018, MedianIncome: 14952.92, FTE: 3834213.42 },
  { PROVINCE: "GT", TaxYear: 2019, MedianIncome: 14813.40, FTE: 3906169.56 },
  { PROVINCE: "GT", TaxYear: 2020, MedianIncome: 14665.46, FTE: 3982425.61 },
  { PROVINCE: "GT", TaxYear: 2021, MedianIncome: 13408.00, FTE: 3881646.26 },
  { PROVINCE: "GT", TaxYear: 2022, MedianIncome: 14791.12, FTE: 3849806.94 },
  { PROVINCE: "GT", TaxYear: 2023, MedianIncome: 14456.42, FTE: 3940774.16 },
  { PROVINCE: "GT", TaxYear: 2024, MedianIncome: 14527.08, FTE: 4010911.99 },
  { PROVINCE: "GT", TaxYear: 2025, MedianIncome: 14837.92, FTE: 3961547.51 },
  { PROVINCE: "KZN", TaxYear: 2014, MedianIncome: 10550.96, FTE: 1479611.42 },
  { PROVINCE: "KZN", TaxYear: 2015, MedianIncome: 10536.94, FTE: 1503256.97 },
  { PROVINCE: "KZN", TaxYear: 2016, MedianIncome: 10733.61, FTE: 1513144.92 },
  { PROVINCE: "KZN", TaxYear: 2017, MedianIncome: 10679.47, FTE: 1517794.66 },
  { PROVINCE: "KZN", TaxYear: 2018, MedianIncome: 10673.99, FTE: 1538902.99 },
  { PROVINCE: "KZN", TaxYear: 2019, MedianIncome: 10600.55, FTE: 1541945.53 },
  { PROVINCE: "KZN", TaxYear: 2020, MedianIncome: 10399.81, FTE: 1600105.60 },
  { PROVINCE: "KZN", TaxYear: 2021, MedianIncome: 9341.46, FTE: 1577859.03 },
  { PROVINCE: "KZN", TaxYear: 2022, MedianIncome: 9727.45, FTE: 1621729.81 },
  { PROVINCE: "KZN", TaxYear: 2023, MedianIncome: 9267.71, FTE: 1667888.93 },
  { PROVINCE: "KZN", TaxYear: 2024, MedianIncome: 9310.07, FTE: 1688543.83 },
  { PROVINCE: "KZN", TaxYear: 2025, MedianIncome: 9857.67, FTE: 1596840.96 },
  { PROVINCE: "LIM", TaxYear: 2014, MedianIncome: 15426.94, FTE: 496390.56 },
  { PROVINCE: "LIM", TaxYear: 2015, MedianIncome: 15352.23, FTE: 506485.00 },
  { PROVINCE: "LIM", TaxYear: 2016, MedianIncome: 16108.73, FTE: 503709.99 },
  { PROVINCE: "LIM", TaxYear: 2017, MedianIncome: 16105.05, FTE: 501587.02 },
  { PROVINCE: "LIM", TaxYear: 2018, MedianIncome: 15292.25, FTE: 519487.10 },
  { PROVINCE: "LIM", TaxYear: 2019, MedianIncome: 14581.31, FTE: 529751.97 },
  { PROVINCE: "LIM", TaxYear: 2020, MedianIncome: 13665.06, FTE: 542401.56 },
  { PROVINCE: "LIM", TaxYear: 2021, MedianIncome: 12528.84, FTE: 534923.10 },
  { PROVINCE: "LIM", TaxYear: 2022, MedianIncome: 12045.43, FTE: 543614.83 },
  { PROVINCE: "LIM", TaxYear: 2023, MedianIncome: 11637.98, FTE: 551728.68 },
  { PROVINCE: "LIM", TaxYear: 2024, MedianIncome: 11437.33, FTE: 560561.17 },
  { PROVINCE: "LIM", TaxYear: 2025, MedianIncome: 12123.65, FTE: 541437.88 },
  { PROVINCE: "MP", TaxYear: 2014, MedianIncome: 14264.72, FTE: 572105.76 },
  { PROVINCE: "MP", TaxYear: 2015, MedianIncome: 13940.10, FTE: 581769.89 },
  { PROVINCE: "MP", TaxYear: 2016, MedianIncome: 14377.66, FTE: 566507.41 },
  { PROVINCE: "MP", TaxYear: 2017, MedianIncome: 14295.93, FTE: 568530.86 },
  { PROVINCE: "MP", TaxYear: 2018, MedianIncome: 14444.00, FTE: 587198.28 },
  { PROVINCE: "MP", TaxYear: 2019, MedianIncome: 14328.90, FTE: 598411.67 },
  { PROVINCE: "MP", TaxYear: 2020, MedianIncome: 14390.84, FTE: 615739.49 },
  { PROVINCE: "MP", TaxYear: 2021, MedianIncome: 13318.30, FTE: 607295.04 },
  { PROVINCE: "MP", TaxYear: 2022, MedianIncome: 13403.17, FTE: 619031.82 },
  { PROVINCE: "MP", TaxYear: 2023, MedianIncome: 13400.99, FTE: 621261.06 },
  { PROVINCE: "MP", TaxYear: 2024, MedianIncome: 12767.09, FTE: 642642.37 },
  { PROVINCE: "MP", TaxYear: 2025, MedianIncome: 13139.03, FTE: 613357.75 },
  { PROVINCE: "NC", TaxYear: 2014, MedianIncome: 13451.38, FTE: 181586.21 },
  { PROVINCE: "NC", TaxYear: 2015, MedianIncome: 13634.15, FTE: 187880.68 },
  { PROVINCE: "NC", TaxYear: 2016, MedianIncome: 13753.58, FTE: 190400.72 },
  { PROVINCE: "NC", TaxYear: 2017, MedianIncome: 13586.09, FTE: 186581.42 },
  { PROVINCE: "NC", TaxYear: 2018, MedianIncome: 13876.35, FTE: 191974.71 },
  { PROVINCE: "NC", TaxYear: 2019, MedianIncome: 13787.16, FTE: 195634.35 },
  { PROVINCE: "NC", TaxYear: 2020, MedianIncome: 13497.70, FTE: 204967.19 },
  { PROVINCE: "NC", TaxYear: 2021, MedianIncome: 13248.34, FTE: 205971.13 },
  { PROVINCE: "NC", TaxYear: 2022, MedianIncome: 12955.45, FTE: 213446.70 },
  { PROVINCE: "NC", TaxYear: 2023, MedianIncome: 12425.58, FTE: 218766.97 },
  { PROVINCE: "NC", TaxYear: 2024, MedianIncome: 12220.63, FTE: 223746.79 },
  { PROVINCE: "NC", TaxYear: 2025, MedianIncome: 12632.85, FTE: 215604.75 },
  { PROVINCE: "NW", TaxYear: 2014, MedianIncome: 15321.88, FTE: 500771.67 },
  { PROVINCE: "NW", TaxYear: 2015, MedianIncome: 14334.27, FTE: 513103.93 },
  { PROVINCE: "NW", TaxYear: 2016, MedianIncome: 17552.17, FTE: 494868.40 },
  { PROVINCE: "NW", TaxYear: 2017, MedianIncome: 17724.94, FTE: 481056.76 },
  { PROVINCE: "NW", TaxYear: 2018, MedianIncome: 17341.76, FTE: 475465.77 },
  { PROVINCE: "NW", TaxYear: 2019, MedianIncome: 17454.45, FTE: 491500.56 },
  { PROVINCE: "NW", TaxYear: 2020, MedianIncome: 17405.43, FTE: 506886.77 },
  { PROVINCE: "NW", TaxYear: 2021, MedianIncome: 15670.47, FTE: 506179.60 },
  { PROVINCE: "NW", TaxYear: 2022, MedianIncome: 15483.08, FTE: 543457.74 },
  { PROVINCE: "NW", TaxYear: 2023, MedianIncome: 15542.07, FTE: 547270.26 },
  { PROVINCE: "NW", TaxYear: 2024, MedianIncome: 16181.51, FTE: 532506.49 },
  { PROVINCE: "NW", TaxYear: 2025, MedianIncome: 15474.16, FTE: 520680.99 },
  { PROVINCE: "WC", TaxYear: 2014, MedianIncome: 10647.66, FTE: 1488527.40 },
  { PROVINCE: "WC", TaxYear: 2015, MedianIncome: 10631.56, FTE: 1539704.01 },
  { PROVINCE: "WC", TaxYear: 2016, MedianIncome: 10605.70, FTE: 1599842.20 },
  { PROVINCE: "WC", TaxYear: 2017, MedianIncome: 10568.43, FTE: 1647598.33 },
  { PROVINCE: "WC", TaxYear: 2018, MedianIncome: 10699.01, FTE: 1695237.23 },
  { PROVINCE: "WC", TaxYear: 2019, MedianIncome: 10671.06, FTE: 1735681.62 },
  { PROVINCE: "WC", TaxYear: 2020, MedianIncome: 10806.79, FTE: 1807483.90 },
  { PROVINCE: "WC", TaxYear: 2021, MedianIncome: 9887.23, FTE: 1739998.87 },
  { PROVINCE: "WC", TaxYear: 2022, MedianIncome: 10625.29, FTE: 1785888.67 },
  { PROVINCE: "WC", TaxYear: 2023, MedianIncome: 10466.86, FTE: 1844123.51 },
  { PROVINCE: "WC", TaxYear: 2024, MedianIncome: 10397.57, FTE: 1895682.50 },
  { PROVINCE: "WC", TaxYear: 2025, MedianIncome: 10753.42, FTE: 1889885.22 }
];

// Asynchronous Data Loading Engine (Req 3)
async function loadDataset() {
  try {
    const response = await fetch("data/Province_MedianIncome.csv");
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const csvText = await response.text();
    rawDataset = parseCSV(csvText);
    console.log("Successfully loaded dataset from CSV file:", rawDataset.length, "rows");
  } catch (err) {
    console.warn("Falling back to embedded dataset (ensures local file:// execution works):", err);
    rawDataset = EMBEDDED_FALLBACK_DATA;
  }
  
  initDashboard();
}

// Simple RFC-compliant CSV Parser in vanilla JavaScript
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    if (!currentLine) continue;
    const values = currentLine.split(",").map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      const val = values[index];
      if (header === "TaxYear") {
        row[header] = parseInt(val, 10);
      } else if (header === "MedianIncome" || header === "FTE") {
        row[header] = parseFloat(val);
      } else {
        row[header] = val;
      }
    });
    // Filter out head office anomalies from primary analysis for clean visuals
    if (row.PROVINCE !== "Unknown Location - Head Office Anomaly") {
      rows.push(row);
    }
  }
  return rows;
}

// Formatters for presentation
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + "M";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "k";
  }
  return Math.round(number).toLocaleString();
}

// Data Manipulation & Summary Statistics Calculations (Req 3 & 5)
function computeSummaryStats(data, selectedYear, selectedProvince) {
  let filtered = data;
  
  if (selectedProvince !== "ALL") {
    filtered = filtered.filter(d => d.PROVINCE === selectedProvince);
  }
  
  // Year slice
  const yearData = filtered.filter(d => d.TaxYear === selectedYear);
  
  // 1. Total FTE calculation via .reduce()
  const totalFTE = yearData.reduce((acc, curr) => acc + (curr.FTE || 0), 0);
  
  // 2. Weighted average median wage calculation
  const weightedTotal = yearData.reduce((acc, curr) => acc + (curr.MedianIncome * curr.FTE), 0);
  const avgIncome = totalFTE > 0 ? (weightedTotal / totalFTE) : 0;
  
  // 3. Highest Earning Region for this year
  const sortedByIncome = [...yearData].sort((a, b) => b.MedianIncome - a.MedianIncome);
  const topIncomeRow = sortedByIncome[0] || { PROVINCE: "N/A", MedianIncome: 0 };
  
  // 4. Highest FTE Volume Region
  const sortedByFte = [...yearData].sort((a, b) => b.FTE - a.FTE);
  const topFteRow = sortedByFte[0] || { PROVINCE: "N/A", FTE: 0 };
  
  return {
    totalFTE,
    avgIncome,
    topProvince: PROVINCE_NAMES[topIncomeRow.PROVINCE] || topIncomeRow.PROVINCE,
    topIncome: topIncomeRow.MedianIncome,
    topFteProvince: PROVINCE_NAMES[topFteRow.PROVINCE] || topFteRow.PROVINCE,
    topFte: topFteRow.FTE
  };
}

// DOM KPI Updaters
function updateKPIs(stats, selectedProvince, selectedYear) {
  document.getElementById("kpiTotalFte").innerText = formatNumber(stats.totalFTE);
  document.getElementById("kpiTotalFteMeta").innerText = selectedProvince === "ALL" 
    ? `National formal FTE volume (${selectedYear})` 
    : `${PROVINCE_NAMES[selectedProvince]} formal FTE volume (${selectedYear})`;
  
  document.getElementById("kpiAvgIncome").innerText = formatCurrency(stats.avgIncome);
  document.getElementById("kpiAvgIncomeMeta").innerText = selectedProvince === "ALL"
    ? `National weighted average wage`
    : `Provincial median monthly wage`;
  
  document.getElementById("kpiTopProvince").innerText = stats.topProvince;
  document.getElementById("kpiTopProvinceMeta").innerText = `${formatCurrency(stats.topIncome)} / month (${selectedYear})`;
  
  document.getElementById("kpiTopFteProvince").innerText = stats.topFteProvince;
  document.getElementById("kpiTopFteProvinceMeta").innerText = `${formatNumber(stats.topFte)} FTE (${selectedYear})`;
  
  // Update year labels in chart headers
  document.querySelectorAll(".current-year-label").forEach(el => {
    el.innerText = selectedYear;
  });
}

// Chart Initialisation & Updaters (Req 4)
function renderLineChart(data, selectedProvince, selectedMetric) {
  const ctx = document.getElementById("lineChart").getContext("2d");
  
  const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  let datasets = [];
  
  if (selectedProvince === "ALL") {
    // Show top 4 key economic provinces + National Average
    const featured = ["GT", "WC", "KZN", "NW"];
    datasets = featured.map(prov => {
      const provData = data.filter(d => d.PROVINCE === prov);
      const points = years.map(yr => {
        const row = provData.find(d => d.TaxYear === yr);
        return row ? row[selectedMetric] : null;
      });
      return {
        label: PROVINCE_NAMES[prov],
        data: points,
        borderColor: PROVINCE_COLORS[prov],
        backgroundColor: PROVINCE_COLORS[prov] + "22",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });
  } else {
    // Show single selected province trajectory
    const provData = data.filter(d => d.PROVINCE === selectedProvince);
    const points = years.map(yr => {
      const row = provData.find(d => d.TaxYear === yr);
      return row ? row[selectedMetric] : null;
    });
    datasets = [{
      label: `${PROVINCE_NAMES[selectedProvince]} (${selectedMetric === "MedianIncome" ? "ZAR" : "FTE"})`,
      data: points,
      borderColor: PROVINCE_COLORS[selectedProvince] || "#38bdf8",
      backgroundColor: (PROVINCE_COLORS[selectedProvince] || "#38bdf8") + "33",
      tension: 0.35,
      borderWidth: 3,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 8
    }];
  }

  const isCurrency = selectedMetric === "MedianIncome";
  const yAxisTitle = isCurrency ? "Monthly Median Wage (ZAR)" : "Full-Time Equivalent (FTE)";

  if (chartInstances.lineChart) {
    chartInstances.lineChart.data.labels = years;
    chartInstances.lineChart.data.datasets = datasets;
    chartInstances.lineChart.options.scales.y.title.text = yAxisTitle;
    chartInstances.lineChart.options.scales.y.ticks.callback = function(val) {
      return isCurrency ? "R" + val.toLocaleString() : (val / 1000).toFixed(0) + "k";
    };
    chartInstances.lineChart.update();
  } else {
    chartInstances.lineChart = new Chart(ctx, {
      type: "line",
      data: { labels: years, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#94a3b8", font: { weight: "600" } }
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#38bdf8",
            bodyColor: "#f8fafc",
            borderColor: "#334155",
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                return `${context.dataset.label}: ${isCurrency ? formatCurrency(val) : formatNumber(val) + " jobs"}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: "#334155" },
            ticks: { color: "#94a3b8" }
          },
          y: {
            grid: { color: "#334155" },
            ticks: {
              color: "#94a3b8",
              callback: function(val) {
                return isCurrency ? "R" + val.toLocaleString() : (val / 1000).toFixed(0) + "k";
              }
            },
            title: {
              display: true,
              text: yAxisTitle,
              color: "#94a3b8",
              font: { weight: "bold" }
            }
          }
        }
      }
    });
  }
}

function renderBarChart(data, selectedYear, selectedProvince, selectedMetric) {
  const ctx = document.getElementById("barChart").getContext("2d");
  
  const provinces = ["EC", "FS", "GT", "KZN", "LIM", "MP", "NC", "NW", "WC"];
  const yearData = data.filter(d => d.TaxYear === selectedYear);
  
  const values = provinces.map(prov => {
    const row = yearData.find(d => d.PROVINCE === prov);
    return row ? row[selectedMetric] : 0;
  });

  const backgroundColors = provinces.map(prov => {
    if (selectedProvince !== "ALL" && prov !== selectedProvince) {
      return "#334155"; // dimmed
    }
    return PROVINCE_COLORS[prov];
  });

  const isCurrency = selectedMetric === "MedianIncome";
  const label = isCurrency ? "Monthly Median Wage (ZAR)" : "Full-Time Equivalent (FTE)";

  if (chartInstances.barChart) {
    chartInstances.barChart.data.labels = provinces.map(p => PROVINCE_NAMES[p]);
    chartInstances.barChart.data.datasets[0].data = values;
    chartInstances.barChart.data.datasets[0].backgroundColor = backgroundColors;
    chartInstances.barChart.data.datasets[0].label = label;
    chartInstances.barChart.options.scales.y.title.text = label;
    chartInstances.barChart.options.scales.y.ticks.callback = function(val) {
      return isCurrency ? "R" + (val / 1000).toFixed(0) + "k" : (val / 1000).toFixed(0) + "k";
    };
    chartInstances.barChart.update();
  } else {
    chartInstances.barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: provinces.map(p => PROVINCE_NAMES[p]),
        datasets: [{
          label: label,
          data: values,
          backgroundColor: backgroundColors,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#38bdf8",
            bodyColor: "#f8fafc",
            borderColor: "#334155",
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                return `${isCurrency ? formatCurrency(val) : formatNumber(val) + " jobs"}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", maxRotation: 45, minRotation: 30 }
          },
          y: {
            grid: { color: "#334155" },
            ticks: {
              color: "#94a3b8",
              callback: function(val) {
                return isCurrency ? "R" + (val / 1000).toFixed(0) + "k" : (val / 1000).toFixed(0) + "k";
              }
            },
            title: {
              display: true,
              text: label,
              color: "#94a3b8",
              font: { weight: "bold" }
            }
          }
        }
      }
    });
  }
}

function renderDoughnutChart(data, selectedYear) {
  const ctx = document.getElementById("doughnutChart").getContext("2d");
  
  const provinces = ["EC", "FS", "GT", "KZN", "LIM", "MP", "NC", "NW", "WC"];
  const yearData = data.filter(d => d.TaxYear === selectedYear);
  
  const values = provinces.map(prov => {
    const row = yearData.find(d => d.PROVINCE === prov);
    return row ? row.FTE : 0;
  });

  const totalFTE = values.reduce((a, b) => a + b, 0);

  if (chartInstances.doughnutChart) {
    chartInstances.doughnutChart.data.labels = provinces.map(p => PROVINCE_NAMES[p]);
    chartInstances.doughnutChart.data.datasets[0].data = values;
    chartInstances.doughnutChart.data.datasets[0].backgroundColor = provinces.map(p => PROVINCE_COLORS[p]);
    chartInstances.doughnutChart.update();
  } else {
    chartInstances.doughnutChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: provinces.map(p => PROVINCE_NAMES[p]),
        datasets: [{
          data: values,
          backgroundColor: provinces.map(p => PROVINCE_COLORS[p]),
          borderColor: "#1e293b",
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "right",
            labels: { color: "#cbd5e1", boxWidth: 12, padding: 10, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#38bdf8",
            bodyColor: "#f8fafc",
            borderColor: "#334155",
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                const percentage = totalFTE > 0 ? ((val / totalFTE) * 100).toFixed(1) : 0;
                return ` ${formatNumber(val)} FTE (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

// Master Dashboard Controller & Dynamic Filter Handler (Req 6)
function updateDashboard() {
  const provinceSelect = document.getElementById("provinceFilter");
  const yearSelect = document.getElementById("yearFilter");
  const metricSelect = document.getElementById("metricFilter");

  const selectedProvince = provinceSelect.value;
  const selectedYear = parseInt(yearSelect.value, 10);
  const selectedMetric = metricSelect.value;

  // 1. Recalculate Summary Statistics (Req 3 & 5)
  const stats = computeSummaryStats(rawDataset, selectedYear, selectedProvince);
  updateKPIs(stats, selectedProvince, selectedYear);

  // 2. Update Charts Dynamically (Req 4 & 6)
  renderLineChart(rawDataset, selectedProvince, selectedMetric);
  renderBarChart(rawDataset, selectedYear, selectedProvince, selectedMetric);
  renderDoughnutChart(rawDataset, selectedYear);
}

// Initialise Dashboard on DOM Ready
function initDashboard() {
  // Bind Event Listeners for Filters (Req 6)
  document.getElementById("provinceFilter").addEventListener("change", updateDashboard);
  document.getElementById("yearFilter").addEventListener("change", updateDashboard);
  document.getElementById("metricFilter").addEventListener("change", updateDashboard);

  // Reset Filters Button
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("provinceFilter").value = "ALL";
    document.getElementById("yearFilter").value = "2025";
    document.getElementById("metricFilter").value = "MedianIncome";
    updateDashboard();
  });

  // Initial render
  updateDashboard();
}

// Start Application on Load
window.addEventListener("DOMContentLoaded", loadDataset);

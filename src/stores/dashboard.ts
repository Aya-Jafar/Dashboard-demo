import { generateRandomY } from "@/utils/helpers";
import { defineStore } from "pinia";
import { ref } from "vue";

// ==================== TYPE DEFINITIONS ====================
interface Merchant {
  name: string;
  count: number;
  value: number;
  date: string;
  status: "Active" | "Inactive" | "Pending";
}

interface HeatmapDataPoint {
  x: string;
  y: number;
}

interface LineDataPoint {
  x: number; // timestamp
  y: number;
}
interface LineSeries {
  name: string;
  data: LineDataPoint[];
}

interface HeatmapSeries {
  name: string;
  data: HeatmapDataPoint[];
}
export type WebSocketStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

// ==================== STORE DEFINITION ====================
export const useDashboardStore = defineStore("dashboard", () => {
  // Dark theme color palette
  const colors = {
    primary: "#4936FC",
    secondary: "#10B981",
    background: "#0E172B",
    text: "#fff",
    grid: "#364051",
  };

  // Function to generate heatmap row data
  const generateHeatmapRowData = (): HeatmapDataPoint[] => {
    const data: HeatmapDataPoint[] = [];
    const hours = 24;

    for (let hour = 0; hour < hours; hour++) {
      data.push({
        x: `${hour < 10 ? `0${hour}` : hour}`,
        y: Math.floor(Math.random() * 1200),
      });
    }
    return data;
  };

  const generateMerchantData = () => {
    const merchants = [
      "Baghdad Electronics - Online Store",
      "Al-Bayaa Market - Groceries",
      "FedEx Shipping",
      "Zain Iraq - Mobile Payments",
      "Baghdad Electronics - Online Store",
    ];
    const statusOptions = ["Active", "Inactive", "Pending"];

    return merchants.map((name) => ({
      name,
      count: Math.floor(Math.random() * 100), // Random transaction count (0-99)
      value: Math.floor(Math.random() * 10000), // Random transaction amount (0-9999)
      date: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      )
        .toISOString()
        .split("T")[0], // Random date within the last 30 days
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)], // Random status
    }));
  };


  const generateLineData = () => {
    const today = new Date();
    const last7DaysData = Array.from({ length: 8 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 7 + i); // Last 7 days (including today)
      return {
        x: date.getTime(),
        y: generateRandomY(),
      };
    });
    return last7DaysData;
  };

  // Initial data for the line chart
  const lineSeries = ref<LineSeries[]>([
    {
      name: "",
      data: generateLineData(),
    },
  ]);

  // Initial data for the heatmap
  const heatmapSeries = ref<HeatmapSeries[]>([
    { name: "Monday", data: generateHeatmapRowData() },
    { name: "Tuesday", data: generateHeatmapRowData() },
    { name: "Wednesday", data: generateHeatmapRowData() },
    { name: "Thursday", data: generateHeatmapRowData() },
    { name: "Friday", data: generateHeatmapRowData() },
    { name: "Saturday", data: generateHeatmapRowData() },
    { name: "Sunday", data: generateHeatmapRowData() },
  ]);

  // Initial data for the merchant table
  const merchants = ref<Merchant[]>([
    {
      name: "Baghdad Electronics - Online Store",
      count: 456,
      value: 68700,
      date: "2023-10-05",
      status: "Active",
    },
    {
      name: "Al-Noor Pharmacy Chain",
      count: 215,
      value: 32400,
      date: "2023-09-22",
      status: "Inactive",
    },
    {
      name: "Al-Bayaa Market - Groceries",
      count: 342,
      value: 51300,
      date: "2023-09-30",
      status: "Active",
    },
    {
      name: "FedEx Shipping",
      count: 156,
      value: 23400,
      date: "2023-09-18",
      status: "Inactive",
    },
    {
      name: "Zain Iraq - Mobile Payments",
      count: 278,
      value: 41700,
      date: "2023-10-08",
      status: "Pending",
    },
  ]);

  const tableHeaders: string[] = [
    "merchant",
    "transactionCount",
    "transactionAmount",
    "date",
    "status",
  ];
  const tableRows = ref<(string | number)[][]>(
    merchants.value?.map((merchant) => Object.values(merchant))
  );

  // Function to update tableRows when merchants changes
  const updateTableRows = () => {
    tableRows.value = merchants.value?.map((merchant) =>
      Object.values(merchant)
    );
  };

  const heatmapOptions = ref({
    chart: {
      id: "vuechart-heatmap",
      type: "heatmap",
      height: "100%",
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          reset: true,
        },
      },
      background: colors.background,
      foreColor: colors.text,
    },
    colors: [colors.primary, colors.secondary],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "12 AM",
        "1 AM",
        "2 AM",
        "3 AM",
        "4 AM",
        "5 AM",
        "6 AM",
        "7 AM",
        "8 AM",
        "9 AM",
        "10 AM",
        "11 AM",
        "12 PM",
        "1 PM",
        "2 PM",
        "3 PM",
        "4 PM",
        "5 PM",
        "6 PM",
        "7 PM",
        "8 PM",
        "9 PM",
        "10 PM",
        "11 PM",
      ],
      labels: {
        style: {
          colors: colors.text,
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: {
        show: true,
        color: colors.grid,
      },
      axisTicks: {
        color: colors.grid,
      },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: colors.text,
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: {
        show: true,
        color: colors.grid,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `Transactions: ${value}`,
      },
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
        fontWeight: "bold",
        color: colors.text,
      },
      background: colors.background,
    },
    plotOptions: {
      heatmap: {
        distributed: true,
        colorScale: {
          inverse: false,
          ranges: [
            { from: 0, to: 50, name: "Low", color: "#e98383" },
            { from: 76, to: 100, name: "Medium", color: "#10B981" },
            { from: 101, to: 150, name: "High", color: "#00b7ff" },
            { from: 151, to: 1200, name: "Very High", color: "#4936FC" },
          ],
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#FFD700",
      strokeDashArray: 4,
      position: "back",
    },
  });

  const lineChartOptions = ref({
    chart: {
      id: "vuechart-example",
      type: "line",
      height: "100%",
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
        type: "xy",
        zoomedArea: {
          fill: { color: "#90CAF9", opacity: 0.4 },
          stroke: { color: "#42A5F5", width: 1 },
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      background: colors.background,
      foreColor: colors.text,
    },
    colors: [colors.primary],
    stroke: {
      curve: "smooth",
    },
    // title: {
    //   text: "Transaction Volume Over the Last Week",
    //   align: "left",
    //   // margin: 10,
    //   style: {
    //     // fontSize: "16px",
    //     fontWeight: "bold",
    //     fontFamily: "Inter, sans-serif",
    //     color: colors.text,
    //   },
    // },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        gradientToColors: [colors.secondary],
        shadeIntensity: 1,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 6,
      colors: [colors.primary],
      strokeColors: colors.background,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd MMM",
        style: {
          colors: colors.text,
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: {
        show: true,
        color: colors.grid,
      },
      axisTicks: {
        color: colors.grid,
      },
    },
    yaxis: [
      {
        title: {
          text: "Transaction Volume (IQD)",
          style: {
            color: colors.text,
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
        labels: {
          style: {
            colors: colors.text,
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
        axisBorder: {
          show: true,
          color: colors.grid,
        },
      },
      {
        opposite: true,
        title: {
          // text: "Transaction Volume",
          style: {
            color: colors.text,
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
        labels: {
          show: false, // Hide labels for the right y-axis
        },
      },
    ],
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
        fontWeight: "bold",
        color: colors.text,
      },
      fillSeriesColor: true,
      background: colors.background,
      marker: {
        show: true,
      },
    },
    grid: {
      show: true,
      borderColor: colors.grid,
      strokeDashArray: 4,
      position: "back",
    },
  });

  return {
    colors,
    lineSeries,
    heatmapSeries,
    generateHeatmapRowData,
    merchants,
    tableHeaders,
    tableRows,
    updateTableRows,
    heatmapOptions,
    lineChartOptions,
    generateMerchantData,
  };
});

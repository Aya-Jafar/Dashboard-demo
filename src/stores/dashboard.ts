import { defineStore } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export const useDashboardStore = defineStore("dashboard", () => {
  const { t } = useI18n();
  const isSidebarOpen = ref(true);

  // Dark theme color palette
  const colors = {
    primary: "#4936FC",
    secondary: "#10B981",
    background: "#1E2938",
    text: "#fff",
    grid: "#364051",
  };

  // Function to generate heatmap row data
  const generateHeatmapRowData = () => {
    const data = [];
    const hours = 24;

    for (let hour = 0; hour < hours; hour++) {
      data.push({
        x: `${hour < 10 ? `0${hour}` : hour}`,
        y: Math.floor(Math.random() * 200),
      });
    }
    return data;
  };

  // Initial data for the line chart
  const lineSeries = ref([
    {
      name: "",
      data: [
        { x: new Date("2025-03-01").getTime(), y: 1200 },
        { x: new Date("2025-03-02").getTime(), y: 800 },
        { x: new Date("2025-03-03").getTime(), y: 900 },
        { x: new Date("2025-03-04").getTime(), y: 1000 },
        { x: new Date("2025-03-05").getTime(), y: 1100 },
        { x: new Date("2025-03-06").getTime(), y: 1050 },
        { x: new Date("2025-03-07").getTime(), y: 1300 },
        { x: new Date("2025-03-08").getTime(), y: 950 },
        { x: new Date("2025-03-09").getTime(), y: 1400 },
        { x: new Date("2025-03-10").getTime(), y: 1000 },
        { x: new Date("2025-03-11").getTime(), y: 850 },
        { x: new Date("2025-03-12").getTime(), y: 1200 },
        { x: new Date("2025-03-13").getTime(), y: 1100 },
        { x: new Date("2025-03-14").getTime(), y: 1300 },
        { x: new Date("2025-03-15").getTime(), y: 900 },
      ],
    },
  ]);
  // Initial data for the heatmap
  const heatmapSeries = ref([
    { name: "Monday", data: generateHeatmapRowData() },
    { name: "Tuesday", data: generateHeatmapRowData() },
    { name: "Wednesday", data: generateHeatmapRowData() },
    { name: "Thursday", data: generateHeatmapRowData() },
    { name: "Friday", data: generateHeatmapRowData() },
    { name: "Saturday", data: generateHeatmapRowData() },
    { name: "Sunday", data: generateHeatmapRowData() },
  ]);

  // Initial data for the merchant table
  const merchants = ref([
    {
      name: "Merchant A",
      count: 50,
      value: 5000,
      date: "2023-10-01",
      status: "Active",
    },
    {
      name: "Merchant B",
      count: 40,
      value: 4000,
      date: "2023-09-25",
      status: "Inactive",
    },
    {
      name: "Merchant C",
      count: 30,
      value: 3000,
      date: "2023-10-05",
      status: "Active",
    },
    {
      name: "Merchant D",
      count: 20,
      value: 2000,
      date: "2023-09-30",
      status: "Pending",
    },
  ]);

  const tableHeaders = [
    "merchant",
    "transactionCount",
    "transactionAmount",
    "date",
    "status",
  ];
  const tableRows = ref(
    merchants.value.map((merchant) => Object.values(merchant))
  );

  // Function to update tableRows when merchants changes
  const updateTableRows = () => {
    tableRows.value = merchants.value.map((merchant) =>
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
            { from: 0, to: 50, name: "Low", color: "#4936FC" },
            { from: 51, to: 100, name: "Medium", color: "#10B981" },
            { from: 101, to: 200, name: "High", color: "#3189F2" },
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
        format: "dd MMM yyyy",
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
    isSidebarOpen,
  };
});

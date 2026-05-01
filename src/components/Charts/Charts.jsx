import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const Charts = () => {
  const pieRef = useRef(null);
  const lineRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);

  useEffect(() => {
    if (pieChartRef.current) pieChartRef.current.destroy();
    if (lineChartRef.current) lineChartRef.current.destroy();

    pieChartRef.current = new Chart(pieRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [33, 33, 34],
            backgroundColor: ["#3182ce", "#38b2ac", "#805ad5"],
            label: "Dataset 1",
          },
        ],
        labels: ["Appointments", "Services", "reviwes"],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
    lineChartRef.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Organic",
            backgroundColor: "#38b2ac",
            borderColor: "#38b2ac",
            data: [0, 20, 10, 30, 15, 40],
            fill: false,
            tension: 0.3,
          },
          {
            label: "Paid",
            backgroundColor: "#805ad5",
            borderColor: "#805ad5",
            data: [10, 25, 15, 35, 20, 50],
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
    return () => {
      if (pieChartRef.current) pieChartRef.current.destroy();
      if (lineChartRef.current) lineChartRef.current.destroy();
    };
  }, []);

  return (
    <main className="overflow-y-auto bg-white pb-10">
      <div className="w-full">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-3 bg-gray-100 rounded-lg shadow w-full [sm]:max-w-25 mx-auto">
            <h4 className="mb-2 text-base font-medium text-gray-700 text-center">
              Pie Chart
            </h4>
            <div style={{ maxWidth: "180px", margin: "0 auto" }}>
              <canvas
                ref={pieRef}
                style={{ width: "100%", height: "100%" }}
              ></canvas>
            </div>
            <div className="flex justify-center mt-3 space-x-3 text-xs text-gray-600">
              <Legend color="bg-blue-800" label="Appointments" />
              <Legend color="bg-blue-400" label="Services" />
              <Legend color="bg-blue-600" label="Reviews" />
            </div>
          </div>

          <div className="p-3 bg-gray-100 rounded-lg shadow w-full [sm]:max-w-25 mx-auto">
            <h4 className="mb-2 text-base font-medium text-gray-700 text-center">
              Line Chart
            </h4>
            <div className="relative w-full" style={{ height: "250px" }}>
              <canvas
                ref={lineRef}
                style={{ width: "100%", height: "100%" }}
              ></canvas>
            </div>
            <div className="flex justify-center mt-3 space-x-3 text-xs text-gray-600">
              <Legend color="bg-blue-800" label="Organic" />
              <Legend color="bg-blue-400" label="Paid" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center">
    <span className={`inline-block w-3 h-3 mr-2 ${color} rounded-full`}></span>
    <span>{label}</span>
  </div>
);

export default Charts;

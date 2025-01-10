import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react';

export default function ChartBookingByAge({ labelData, data, bgColor }) {
  const chartRef = useRef(null); // Ref for the canvas element
  const chartInstanceRef = useRef(null); // Ref for the chart instance

  useEffect(() => {
    if (data && data.length > 0) {
      const chartData = {
        labels: labelData, // Labels for the legend
        datasets: [
          {
            label: 'Data Set', // General label for the dataset
            data: data,
            backgroundColor: bgColor || [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'left',
            labels: {

              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 10,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const labels = data; // Custom hover labels
                return labels[tooltipItem.dataIndex];
              },
            },
          },
        },
      };

      // Get context from the canvas element
      const ctx = chartRef.current.getContext('2d');

      // Destroy the previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart instance and store it in the ref
      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions,
      });

      // Cleanup function to destroy the chart when the component unmounts
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }
  }, [data, labelData, bgColor]);

  return <canvas style={{ height: "190px", width: "100%" }} ref={chartRef} id="chart_r_1_2" />; // Use chartRef for the canvas element
}

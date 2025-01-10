import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

export default function ChartBookingByDayOfWeek({ labelData, data, labelSet, labelValue }) {
  const chartRef = useRef(null); // Ref for the canvas element
  const chartInstanceRef = useRef(null); // Ref for the chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Define the data for the chart
    const chartData = {
      labels: labelData,
      datasets: [
        {
          label: labelSet[1],
          data: data[1],
          backgroundColor: 'gray', // Color for the last year
          borderColor: 'gray',
          borderWidth: 1,
        },
        {
          label: labelSet[0],
          data: data[0],
          backgroundColor: 'rgba(54, 162, 235, 0.7)', // Color for this year
          borderColor: 'rgba(54, 162, 235, 0.7)',
          borderWidth: 1,
        },
      ],
    };

    // Configure the chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: labelValue[0],
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: labelValue[1],
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Tooltip background color
          titleColor: 'rgba(0, 0, 0, 1)', // Title color
          bodyColor: 'rgba(0, 0, 0, 1)', // Body text color
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
    };

    // Create a new chart instance and store it in the ref
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labelData, data, labelSet, labelValue]);

  return <canvas ref={chartRef} id="chart_r_3" />; // Use ref for the canvas element
}

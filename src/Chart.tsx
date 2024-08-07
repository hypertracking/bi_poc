import React, { useRef, useEffect } from "react";
import { init, getInstanceByDom, registerTransform } from "echarts";
import type { CSSProperties } from "react";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";


export interface Props {
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
  clustering?: boolean;
}

export function Chart({
  option,
  style,
  settings,
  loading,
  theme,
  clustering
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart?.setOption(option, {...settings, notMerge: true });
    }

  }, [option, settings, theme, option.series]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (loading) {
        chart?.showLoading();
      } else {
        chart?.hideLoading();
      }
    }
  }, [loading, theme]);

  return (
    <div ref={chartRef} style={{ width: "auto", height: "500px", ...style }} />
  );
}

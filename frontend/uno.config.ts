// uno.config.ts
import { defineConfig } from "unocss";

export default defineConfig({
  shortcuts: {
    "fx-l": "flex justify-start items-center", // 水平靠左，垂直居中
    "fx-c": "flex justify-center items-center", // 水平靠中，垂直居中
    "fx-r": "flex justify-end items-center", // 水平靠右，垂直居中
    "fx-b": "flex justify-between items-center",
    "fy-l": "flex flex-col justify-start items-start", // 垂直靠顶，水平居左
    "fy-c": "flex flex-col justify-start items-center", // 垂直靠顶，水平居中
    "fy-r": "flex flex-col justify-start items-end", // 垂直靠顶，水平居中
    "sx-1": "space-x-1",
    "sx-2": "space-x-2",
    "sx-4": "space-x-4",
    "sy-1": "space-y-1",
    "sy-2": "space-y-2",
    "sy-4": "space-y-4",
  },
});

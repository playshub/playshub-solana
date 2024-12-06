import { Spin } from "antd";

export default function Loading() {
  return (
    <Spin tip="Loading" size="large">
      <div
        style={{
          height: "calc(100vh - 88px)",
        }}
      ></div>
    </Spin>
  );
}

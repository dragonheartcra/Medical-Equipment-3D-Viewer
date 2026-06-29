import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  exportDevicePositions,
  formatNormal,
  formatPosition,
  setPartSurfacePoint,
} from "../src/debugTools.js";

describe("debug coordinate helpers", () => {
  it("formats hotspot positions with three decimals", () => {
    assert.equal(formatPosition([1, -0.12345, 2.98765]), "[1.000, -0.123, 2.988]");
  });

  it("updates only the selected part position", () => {
    const device = {
      parts: [
        { id: "a", name: "A", position: [0, 0, 0] },
        { id: "b", name: "B", position: [1, 1, 1] },
      ],
    };

    setPartSurfacePoint(device, "b", [2.1234, 3.2345, 4.3456]);

    assert.deepEqual(device.parts[0].position, [0, 0, 0]);
    assert.deepEqual(device.parts[1].position, [2.123, 3.235, 4.346]);
  });

  it("stores a surface normal with the selected part", () => {
    const device = {
      parts: [{ id: "a", name: "A", position: [0, 0, 0] }],
    };

    setPartSurfacePoint(device, "a", [1, 2, 3], [0.1111, 0.2222, 0.3333]);

    assert.deepEqual(device.parts[0].position, [1, 2, 3]);
    assert.deepEqual(device.parts[0].normal, [0.111, 0.222, 0.333]);
    assert.equal(formatNormal(device.parts[0].normal), "[0.111, 0.222, 0.333]");
  });

  it("exports position and normal snippets for copying back into device data", () => {
    const device = {
      parts: [
        { id: "a", name: "A", position: [1, 2, 3], normal: [0, 1, 0] },
      ],
    };

    assert.equal(
      exportDevicePositions(device),
      '  // A\n  id: "a",\n  position: [1.000, 2.000, 3.000],\n  normal: [0.000, 1.000, 0.000],',
    );
  });
});

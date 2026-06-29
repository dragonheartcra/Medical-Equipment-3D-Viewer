import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { devices } from "../src/devices.js";
import { getInitialLayerIndex, getNextLayerIndex } from "../src/detailState.js";

describe("device configuration", () => {
  it("defines the five required imaging devices in display order", () => {
    assert.deepEqual(
      devices.map((device) => device.id),
      ["dr", "ct", "dsa", "mri", "ultrasound"],
    );
  });

  it("uses normalized GLB model paths for all devices", () => {
    assert.deepEqual(
      devices.map((device) => device.model),
      [
        "/models/dr.glb",
        "/models/ct.glb",
        "/models/dsa.glb",
        "/models/mri.glb",
        "/models/ultrasound.glb",
      ],
    );
  });

  it("keeps DR and CT multi-layer part details from the requirements", () => {
    const dr = devices.find((device) => device.id === "dr");
    const ct = devices.find((device) => device.id === "ct");

    const xrayTube = dr.parts.find((part) => part.id === "xray-tube");
    const detector = dr.parts.find((part) => part.id === "flat-panel-detector");
    const gantry = ct.parts.find((part) => part.id === "gantry");

    assert.equal(xrayTube.layers.length, 3);
    assert.equal(detector.layers.length, 3);
    assert.equal(gantry.layers.length, 2);
  });
});

describe("detail layer state", () => {
  it("starts a selected part at the first detail layer", () => {
    assert.equal(getInitialLayerIndex(), 0);
  });

  it("advances through layers and stops at the final layer", () => {
    const part = { layers: [{}, {}, {}] };

    assert.equal(getNextLayerIndex(part, 0), 1);
    assert.equal(getNextLayerIndex(part, 1), 2);
    assert.equal(getNextLayerIndex(part, 2), 2);
  });
});

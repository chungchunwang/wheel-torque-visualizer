import {
  Immutable,
  PanelExtensionContext,
  SettingsTree,
  SettingsTreeAction,
  Topic,
} from "@foxglove/extension";
//import Konva from "konva";
import { useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import TorqueVisualizer from "./TorqueVisualizer";

function ExamplePanel({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();
  const [messages, setMessages] = useState<undefined | Immutable<Record<string, number>>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  const [globalPath, setGlobalPath] = useState<undefined | Immutable<string>>();

  const [frontLeftPath, setFrontLeftPath] = useState<undefined | Immutable<string>>();
  const [frontLeftScale, setFrontLeftScale] = useState<Immutable<number>>(1);
  const [frontRightPath, setFrontRightPath] = useState<undefined | Immutable<string>>();
  const [frontRightScale, setFrontRightScale] = useState<Immutable<number>>(1);
  const [backLeftPath, setBackLeftPath] = useState<undefined | Immutable<string>>();
  const [backLeftScale, setBackLeftScale] = useState<Immutable<number>>(1);
  const [backRightPath, setBackRightPath] = useState<undefined | Immutable<string>>();
  const [backRightScale, setBackRightScale] = useState<Immutable<number>>(1);

  const panelSettings: SettingsTree = {
    nodes: {
      global: {
        label: "Global",
        fields: {
          path: {
            label: "Global Path (All paths relative to this)",
            input: "messagepath",
            // `panelTitle` refers to a value in your extension panel's config
            value: globalPath,
          },
        },
      },
      frontLeftWheel: {
        label: "Front Left Wheel",
        fields: {
          path: {
            label: "Path",
            input: "string",
            // `panelTitle` refers to a value in your extension panel's config
            value: frontLeftPath,
          },
          scale: {
            label: "Scale",
            input: "number",
            value: frontLeftScale,
          },
        },
      },
      frontRightWheel: {
        label: "Front Right Wheel",
        fields: {
          path: {
            label: "Path",
            input: "string",
            // `panelTitle` refers to a value in your extension panel's config
            value: frontRightPath,
          },
          scale: {
            label: "Scale",
            input: "number",
            value: frontRightScale,
          },
        },
      },
      backLeftWheel: {
        label: "Back Left Wheel",
        fields: {
          path: {
            label: "Path",
            input: "string",
            // `panelTitle` refers to a value in your extension panel's config
            value: backLeftPath,
          },
          scale: {
            label: "Scale",
            input: "number",
            value: backLeftScale,
          },
        },
      },
      backRightWheel: {
        label: "Back Right Wheel",
        fields: {
          path: {
            label: "Path",
            input: "string",
            // `panelTitle` refers to a value in your extension panel's config
            value: backRightPath,
          },
          scale: {
            label: "Scale",
            input: "number",
            value: backRightScale,
          },
        },
      },
    },
    actionHandler: (action: SettingsTreeAction) => {
      const setWheel = (
        type: string,
        value: unknown,
        setPath: React.Dispatch<React.SetStateAction<undefined | Immutable<string>>>,
        setScale: React.Dispatch<React.SetStateAction<Immutable<number>>>,
      ) => {
        if (type === "path" && typeof value === "string") {
          setPath(value);
        } else if (type === "scale" && typeof value === "number") {
          setScale(value);
        }
      };
      switch (action.action) {
        case "perform-node-action":
          // Not used, but you could handle user actions here.
          break;
        case "update":
          if (typeof action.payload.path[1] !== "string") {
            break;
          }
          switch (action.payload.path[0]) {
            case "global":
              if (action.payload.path[1] === "path" && typeof action.payload.value === "string") {
                setGlobalPath(action.payload.value);
                context.subscribe([{ topic: action.payload.value }]);
              }
              break;
            case "frontLeftWheel":
              setWheel(
                action.payload.path[1],
                action.payload.value,
                setFrontLeftPath,
                setFrontLeftScale,
              );
              break;
            case "frontRightWheel":
              setWheel(
                action.payload.path[1],
                action.payload.value,
                setFrontRightPath,
                setFrontRightScale,
              );
              break;
            case "backLeftWheel":
              setWheel(
                action.payload.path[1],
                action.payload.value,
                setBackLeftPath,
                setBackLeftScale,
              );
              break;
            case "backRightWheel":
              setWheel(
                action.payload.path[1],
                action.payload.value,
                setBackRightPath,
                setBackRightScale,
              );
              break;
            default:
              break;
          }
          break;
      }
    },
  };

  context.updatePanelSettingsEditor(panelSettings);

  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);
      if (renderState.currentFrame) {
        setMessages(
          renderState.currentFrame[0]?.message as undefined | Immutable<Record<string, number>>,
        );
      }
    };
    context.watch("topics");
    context.watch("currentFrame");
  }, [context]);

  // invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  console.log("topics", topics);
  let frontLeftTorque = 0;
  let frontRightTorque = 0;
  let backLeftTorque = 0;
  let backRightTorque = 0;
  if (messages) {
    if (typeof frontLeftPath !== "string" || messages[frontLeftPath] == undefined) {
      frontLeftTorque = 0;
    } else {
      frontLeftTorque = messages[frontLeftPath];
    }
    if (typeof frontRightPath !== "string" || messages[frontRightPath] == undefined) {
      frontRightTorque = 0;
    } else {
      frontRightTorque = messages[frontRightPath];
    }
    if (typeof backLeftPath !== "string" || messages[backLeftPath] == undefined) {
      backLeftTorque = 0;
    } else {
      backLeftTorque = messages[backLeftPath];
    }
    if (typeof backRightPath !== "string" || messages[backRightPath] == undefined) {
      backRightTorque = 0;
    } else {
      backRightTorque = messages[backRightPath];
    }
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        rowGap: "0.2rem",
      }}
    >
      <div style={{ position: "relative" }}>
        <TorqueVisualizer scale={frontLeftScale} value={frontLeftTorque} name="Front Left Torque" />
      </div>
      <div style={{ position: "relative" }}>
        <TorqueVisualizer
          scale={frontRightScale}
          value={frontRightTorque}
          name="Front Right Torque"
        />
      </div>
      <div style={{ position: "relative" }}>
        <TorqueVisualizer scale={backLeftScale} value={backLeftTorque} name="Back Left Torque" />
      </div>
      <div style={{ position: "relative" }}>
        <TorqueVisualizer scale={backRightScale} value={backRightTorque} name="Back Right Torque" />
      </div>
    </div>
  );
}

export function initExamplePanel(context: PanelExtensionContext): () => void {
  const root = createRoot(context.panelElement);
  root.render(<ExamplePanel context={context} />);
  // Return a function to run when the panel is removed
  return () => {
    root.unmount();
  };
}

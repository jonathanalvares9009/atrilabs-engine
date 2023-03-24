import { useEffect, useState } from "react";
import {
  canvasApi,
  componentStoreApi,
  canvasMachineInterpreter,
} from "../../api";

export function usePropsUpdated(props: { id: string }) {
  const [compProps, setCompProps] = useState<any>();
  useEffect(() => {
    return canvasApi.subscribeComponentEvent(props.id, "props_updated", () => {
      setCompProps(componentStoreApi.getComponentProps(props.id));
    });
  }, []);
  useEffect(() => {
    if (compProps !== undefined)
      canvasMachineInterpreter.send({
        type: "COMPONENT_RENDERED_AFTER_PROPS_UPDATE",
        compId: props.id,
      });
  }, [compProps]);
  return compProps;
}

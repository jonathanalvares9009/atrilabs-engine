import { AnyEvent, createForest, Forest } from "@atrilabs/forest";
import {
  componentTreeDef,
  forestDef,
} from "@atrilabs/atri-app-core/src/api/forestDef";
import { createComponentFromNode } from "@atrilabs/atri-app-core/src/utils/createComponentFromNode";
import postcss from "postcss";
const cssjs = require("postcss-js");

export function createForestFromEvents(events: AnyEvent[]) {
  const forest = createForest(forestDef);
  forest.handleEvents({
    name: "events",
    events,
    meta: { agent: "server-sent" },
  });
  return forest;
}

export function getComponentsFromNodes(forest: Forest) {
  const nodes = forest.tree(componentTreeDef.id)!.nodes!;
  const nodeIds = Object.keys(nodes);
  return nodeIds.map((nodeId) => {
    const component = createComponentFromNode(
      nodes[nodeId]!,
      {
        max: 1200,
        min: 900,
      },
      forest
    )!;
    return { ...component, alias: nodes[nodeId]!.state["alias"] as string };
  });
}

/**
 * mergeWithInitState function is supposed to be run
 * from inside an atri app
 */
export function mergeWithInitState() {}

export function jssToCss(jss: React.CSSProperties) {
  return postcss()
    .process(jss, { parser: cssjs, from: undefined })
    .then((code) => {
      return code.css + ";";
    });
}

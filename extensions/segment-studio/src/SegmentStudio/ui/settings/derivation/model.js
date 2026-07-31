function derivationRuleNameCompare(left, right) {
  return String(left || "").localeCompare(String(right || ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function buildDerivationRuleGraph(rules = [], segmentGroups = []) {
  const membership = new Map();
  [...segmentGroups]
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0)
      || Number(left.id) - Number(right.id))
    .forEach((group, groupIndex) => {
      [...(group.tags || [])]
        .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0)
          || Number(left.tagId) - Number(right.tagId))
        .forEach((tag, tagIndex) => membership.set(Number(tag.tagId), {
          key: `group:${group.id}`,
          id: group.id,
          name: group.name,
          sortOrder: group.sortOrder ?? groupIndex,
          tagSortOrder: tag.sortOrder ?? tagIndex,
        }));
    });

  const nodesById = new Map();
  function ensureNode(tagId, tagName) {
    const numericTagId = Number(tagId);
    if (!nodesById.has(numericTagId)) {
      const group = membership.get(numericTagId);
      nodesById.set(numericTagId, {
        tagId: numericTagId,
        name: tagName || `Tag ${numericTagId}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: group?.key || "ungrouped",
        segmentGroupId: group?.id ?? null,
        segmentGroupName: group?.name || "Ungrouped",
        segmentGroupSortOrder: group?.sortOrder ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: group?.tagSortOrder ?? Number.MAX_SAFE_INTEGER,
      });
    }
    return nodesById.get(numericTagId);
  }

  const connectionMap = new Map();
  rules.forEach((rule) => {
    const source = ensureNode(rule.sourceTagId, rule.sourceTagName);
    const derived = ensureNode(rule.derivedTagId, rule.derivedTagName);
    source.outgoingRuleCount++;
    derived.incomingRuleCount++;
    const key = `${source.tagId}:${derived.tagId}`;
    if (!connectionMap.has(key)) {
      connectionMap.set(key, {
        id: key,
        sourceTagId: source.tagId,
        derivedTagId: derived.tagId,
        rules: [],
        edgeCount: 0,
      });
    }
    const connection = connectionMap.get(key);
    connection.rules.push(rule);
    connection.edgeCount += Number(rule.edgeCount) || 0;
  });

  const nodes = [...nodesById.values()];
  const connections = [...connectionMap.values()];
  const neighbors = new Map(nodes.map((node) => [node.tagId, new Set()]));
  connections.forEach((connection) => {
    neighbors.get(connection.sourceTagId)?.add(connection.derivedTagId);
    neighbors.get(connection.derivedTagId)?.add(connection.sourceTagId);
  });

  const visited = new Set();
  const components = [];
  for (const node of nodes) {
    if (visited.has(node.tagId)) continue;
    const queue = [node.tagId];
    const tagIds = [];
    visited.add(node.tagId);
    while (queue.length > 0) {
      const current = queue.shift();
      tagIds.push(current);
      for (const neighbor of neighbors.get(current) || []) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
    const tagIdSet = new Set(tagIds);
    const componentNodes = tagIds.map((tagId) => nodesById.get(tagId));
    const componentConnections = connections.filter((connection) =>
      tagIdSet.has(connection.sourceTagId) && tagIdSet.has(connection.derivedTagId));
    const componentRules = componentConnections.flatMap((connection) => connection.rules);
    const terminalNodes = componentNodes
      .filter((candidate) => candidate.outgoingRuleCount === 0)
      .sort((left, right) => derivationRuleNameCompare(left.name, right.name));
    const labelNodes = terminalNodes.length > 0
      ? terminalNodes
      : [...componentNodes].sort((left, right) => derivationRuleNameCompare(left.name, right.name));
    components.push({
      id: [...tagIds].sort((left, right) => left - right).join(":"),
      label: labelNodes.length > 1
        ? `${labelNodes[0].name} + ${labelNodes.length - 1}`
        : labelNodes[0]?.name || "Derivation component",
      nodes: componentNodes,
      connections: componentConnections,
      rules: componentRules,
      segmentGroupKeys: [...new Set(componentNodes.map((candidate) => candidate.segmentGroupKey))],
      materializedEdgeCount: componentRules.reduce(
        (total, rule) => total + (Number(rule.edgeCount) || 0),
        0,
      ),
    });
  }
  components.sort((left, right) => right.rules.length - left.rules.length
    || derivationRuleNameCompare(left.label, right.label));

  const groupMap = new Map();
  nodes.forEach((node) => {
    if (!groupMap.has(node.segmentGroupKey)) {
      groupMap.set(node.segmentGroupKey, {
        key: node.segmentGroupKey,
        id: node.segmentGroupId,
        name: node.segmentGroupName,
        sortOrder: node.segmentGroupSortOrder,
        nodes: [],
        ruleIds: new Set(),
        componentIds: new Set(),
      });
    }
    groupMap.get(node.segmentGroupKey).nodes.push(node);
  });
  components.forEach((component) => {
    component.nodes.forEach((node) =>
      groupMap.get(node.segmentGroupKey)?.componentIds.add(component.id));
    component.rules.forEach((rule) => {
      groupMap.get(nodesById.get(Number(rule.sourceTagId)).segmentGroupKey)?.ruleIds.add(rule.id);
      groupMap.get(nodesById.get(Number(rule.derivedTagId)).segmentGroupKey)?.ruleIds.add(rule.id);
    });
  });
  const graphSegmentGroups = [...groupMap.values()]
    .sort((left, right) => left.sortOrder - right.sortOrder
      || derivationRuleNameCompare(left.name, right.name))
    .map((group) => ({
      ...group,
      ruleCount: group.ruleIds.size,
      componentCount: group.componentIds.size,
    }));

  return {
    nodes,
    connections,
    components,
    segmentGroups: graphSegmentGroups,
  };
}

export function layoutDerivationRuleComponent(component, {
  minimumWidth = 720,
  minimumHeight = 420,
} = {}) {
  const NODE_WIDTH = 184;
  const NODE_HEIGHT = 58;
  const COLUMN_GAP = 112;
  const ROW_GAP = 18;
  const CANVAS_PADDING = 28;
  const GROUP_HEADER_HEIGHT = 34;
  const GROUP_PADDING = 18;
  if (!component || component.nodes.length === 0) {
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  }

  const outgoing = new Map(component.nodes.map((node) => [node.tagId, new Set()]));
  const incoming = new Map(component.nodes.map((node) => [node.tagId, new Set()]));
  component.connections.forEach((connection) => {
    outgoing.get(connection.sourceTagId)?.add(connection.derivedTagId);
    incoming.get(connection.derivedTagId)?.add(connection.sourceTagId);
  });
  const indegree = new Map(component.nodes.map((node) => [
    node.tagId,
    incoming.get(node.tagId)?.size || 0,
  ]));
  const rank = new Map(component.nodes.map((node) => [node.tagId, 0]));
  const queue = component.nodes
    .filter((node) => indegree.get(node.tagId) === 0)
    .sort((left, right) => derivationRuleNameCompare(left.name, right.name))
    .map((node) => node.tagId);
  const processed = new Set();
  while (queue.length > 0) {
    const tagId = queue.shift();
    if (processed.has(tagId)) continue;
    processed.add(tagId);
    for (const targetTagId of outgoing.get(tagId) || []) {
      rank.set(targetTagId, Math.max(rank.get(targetTagId) || 0, (rank.get(tagId) || 0) + 1));
      indegree.set(targetTagId, indegree.get(targetTagId) - 1);
      if (indegree.get(targetTagId) === 0) queue.push(targetTagId);
    }
  }
  if (processed.size !== component.nodes.length) {
    component.nodes
      .filter((node) => !processed.has(node.tagId))
      .sort((left, right) => derivationRuleNameCompare(left.name, right.name))
      .forEach((node) => rank.set(node.tagId, 0));
  }

  const maxRank = Math.max(0, ...rank.values());
  const width = Math.max(
    minimumWidth,
    CANVAS_PADDING * 2 + NODE_WIDTH + maxRank * (NODE_WIDTH + COLUMN_GAP),
  );
  const groupMap = new Map();
  component.nodes.forEach((node) => {
    if (!groupMap.has(node.segmentGroupKey)) {
      groupMap.set(node.segmentGroupKey, {
        key: node.segmentGroupKey,
        id: node.segmentGroupId,
        name: node.segmentGroupName,
        sortOrder: node.segmentGroupSortOrder,
        nodes: [],
      });
    }
    groupMap.get(node.segmentGroupKey).nodes.push(node);
  });
  const groups = [...groupMap.values()].sort((left, right) =>
    left.sortOrder - right.sortOrder || derivationRuleNameCompare(left.name, right.name));

  let nextY = CANVAS_PADDING;
  const positionedNodes = [];
  const positionedGroups = groups.map((group) => {
    const nodesByRank = new Map();
    group.nodes.forEach((node) => {
      const nodeRank = rank.get(node.tagId) || 0;
      if (!nodesByRank.has(nodeRank)) nodesByRank.set(nodeRank, []);
      nodesByRank.get(nodeRank).push(node);
    });
    for (const layer of nodesByRank.values()) {
      layer.sort((left, right) =>
        left.segmentGroupTagSortOrder - right.segmentGroupTagSortOrder
        || derivationRuleNameCompare(left.name, right.name));
    }
    const maxRows = Math.max(1, ...[...nodesByRank.values()].map((layer) => layer.length));
    const contentHeight = maxRows * NODE_HEIGHT + (maxRows - 1) * ROW_GAP;
    const groupHeight = GROUP_HEADER_HEIGHT + GROUP_PADDING * 2 + contentHeight;
    const positionedGroup = {
      ...group,
      x: 12,
      y: nextY,
      width: width - 24,
      height: groupHeight,
    };
    for (const [nodeRank, layer] of nodesByRank.entries()) {
      const layerHeight = layer.length * NODE_HEIGHT + Math.max(0, layer.length - 1) * ROW_GAP;
      const layerOffset = (contentHeight - layerHeight) / 2;
      layer.forEach((node, index) => positionedNodes.push({
        ...node,
        rank: nodeRank,
        x: CANVAS_PADDING + nodeRank * (NODE_WIDTH + COLUMN_GAP),
        y: nextY + GROUP_HEADER_HEIGHT + GROUP_PADDING + layerOffset
          + index * (NODE_HEIGHT + ROW_GAP),
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }));
    }
    nextY += groupHeight + 16;
    return positionedGroup;
  });
  const positions = new Map(positionedNodes.map((node) => [node.tagId, node]));
  const positionedConnections = component.connections.map((connection) => {
    const source = positions.get(connection.sourceTagId);
    const derived = positions.get(connection.derivedTagId);
    const x1 = source.x + source.width;
    const y1 = source.y + source.height / 2;
    const x2 = derived.x;
    const y2 = derived.y + derived.height / 2;
    const bend = Math.max(48, (x2 - x1) * 0.48);
    return {
      ...connection,
      path: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
    };
  });
  return {
    width,
    height: Math.max(minimumHeight, nextY - 16 + CANVAS_PADDING),
    nodes: positionedNodes,
    connections: positionedConnections,
    groups: positionedGroups,
  };
}

export function layoutDerivationRuleComponents(components) {
  const CANVAS_PADDING = 20;
  const COMPONENT_GAP = 32;
  if (!components || components.length === 0) {
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  }

  let nextY = CANVAS_PADDING;
  let contentWidth = 0;
  const nodes = [];
  const connections = [];
  const groups = [];

  components.forEach((component) => {
    const componentLayout = layoutDerivationRuleComponent(component, {
      minimumWidth: 0,
      minimumHeight: 0,
    });
    const offsetX = CANVAS_PADDING;
    const offsetY = nextY;
    const positionedNodes = componentLayout.nodes.map((node) => ({
      ...node,
      x: node.x + offsetX,
      y: node.y + offsetY,
    }));
    const positions = new Map(positionedNodes.map((node) => [node.tagId, node]));

    nodes.push(...positionedNodes);
    groups.push(...componentLayout.groups.map((group) => ({
      ...group,
      componentId: component.id,
      x: group.x + offsetX,
      y: group.y + offsetY,
    })));
    connections.push(...componentLayout.connections.map((connection) => {
      const source = positions.get(connection.sourceTagId);
      const derived = positions.get(connection.derivedTagId);
      const x1 = source.x + source.width;
      const y1 = source.y + source.height / 2;
      const x2 = derived.x;
      const y2 = derived.y + derived.height / 2;
      const bend = Math.max(48, (x2 - x1) * 0.48);
      return {
        ...connection,
        componentId: component.id,
        path: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
      };
    }));

    contentWidth = Math.max(contentWidth, componentLayout.width);
    nextY += componentLayout.height + COMPONENT_GAP;
  });

  return {
    width: Math.max(720, contentWidth + CANVAS_PADDING * 2),
    height: Math.max(420, nextY - COMPONENT_GAP + CANVAS_PADDING),
    nodes,
    connections,
    groups,
  };
}

export function validateDerivationRuleDraft(draft, rules = []) {
  if (!draft?.sourceTagId || !draft?.derivedTagId) return null;
  const sourceTagId = Number(draft.sourceTagId);
  const derivedTagId = Number(draft.derivedTagId);
  if (sourceTagId === derivedTagId) {
    return {
      code: "LINEAGE_CYCLE",
      message: "A tag cannot derive itself because that would create a cycle.",
    };
  }
  const activeRules = rules.filter((rule) => rule.id !== draft.ruleId);
  if (activeRules.some((rule) =>
      Number(rule.sourceTagId) === sourceTagId
      && Number(rule.derivedTagId) === derivedTagId)) {
    return {
      code: "LINEAGE_RULE_DUPLICATE",
      message: "A rule already maps this source tag to this derived tag.",
    };
  }
  const adjacency = new Map();
  activeRules.forEach((rule) => {
    const source = Number(rule.sourceTagId);
    if (!adjacency.has(source)) adjacency.set(source, new Set());
    adjacency.get(source).add(Number(rule.derivedTagId));
  });
  const pending = [derivedTagId];
  const visited = new Set();
  while (pending.length > 0) {
    const tagId = pending.shift();
    if (visited.has(tagId)) continue;
    visited.add(tagId);
    if (tagId === sourceTagId) {
      return {
        code: "LINEAGE_CYCLE",
        message: "This relationship would create a derivation cycle.",
      };
    }
    for (const next of adjacency.get(tagId) || []) pending.push(next);
  }
  return null;
}

export function resolveSelectedDerivationRule(selection, visibleRules, hasQuery) {
  if (selection?.type === "rule")
    return visibleRules.find((rule) => rule.id === selection.id) || null;
  return selection == null && !hasQuery ? visibleRules[0] || null : null;
}

export { derivationRuleNameCompare };

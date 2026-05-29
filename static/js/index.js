document.addEventListener('DOMContentLoaded', function () {
  var burgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  burgers.forEach(function (burger) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-active');
      document.querySelectorAll('.navbar-menu').forEach(function (menu) {
        menu.classList.toggle('is-active');
      });
    });
  });

  var hierarchyVideo = document.getElementById('hierarchy-video');
  var hierarchyLabel = document.getElementById('hierarchy-label');
  var layerTabs = Array.prototype.slice.call(document.querySelectorAll('.layer-tab'), 0);
  var latentTreeSvg = document.getElementById('latent-tree-svg');
  var svgNamespace = 'http://www.w3.org/2000/svg';
  var treeLayers = [
    { layer: '1', count: 1, y: 42, span: 0 },
    { layer: '2', count: 2, y: 132, span: 170 },
    { layer: '3', count: 4, y: 222, span: 270 },
    { layer: '4', count: 8, y: 312, span: 370 },
    { layer: '5', count: 16, y: 402, span: 470 },
    { layer: '6', count: 21, y: 500, span: 540 }
  ];
  var treeNodes = [];
  var treeEdges = [];

  function createSvgElement(tagName, attributes) {
    var element = document.createElementNS(svgNamespace, tagName);
    Object.keys(attributes).forEach(function (name) {
      element.setAttribute(name, attributes[name]);
    });
    return element;
  }

  function layerXPositions(count, span) {
    if (count === 1) {
      return [320];
    }

    var start = 320 - span / 2;
    var step = span / (count - 1);
    return Array.from({ length: count }, function (_, index) {
      return start + index * step;
    });
  }

  function buildLatentTree() {
    if (!latentTreeSvg) {
      return;
    }

    var edgeGroup = createSvgElement('g', { class: 'tree-edge-layer' });
    var haloGroup = createSvgElement('g', { class: 'tree-halo-layer' });
    var nodeGroup = createSvgElement('g', { class: 'tree-node-layer' });
    var layerCoordinates = treeLayers.map(function (layerSpec) {
      return layerXPositions(layerSpec.count, layerSpec.span).map(function (x) {
        return { x: x, y: layerSpec.y, layer: layerSpec.layer };
      });
    });

    treeEdges = [];
    treeNodes = [];
    latentTreeSvg.innerHTML = '';

    layerCoordinates.forEach(function (nodes, levelIndex) {
      var childNodes = layerCoordinates[levelIndex + 1];
      if (!childNodes) {
        return;
      }

      nodes.forEach(function (node, nodeIndex) {
        childNodes.forEach(function (child, childIndex) {
          var parentIndex = levelIndex === 4
            ? Math.floor(childIndex * nodes.length / childNodes.length)
            : Math.floor(childIndex / 2);

          if (parentIndex !== nodeIndex) {
            return;
          }

          var edge = createSvgElement('line', {
            class: 'tree-edge',
            x1: node.x,
            y1: node.y,
            x2: child.x,
            y2: child.y
          });
          edge.dataset.parentLayer = node.layer;
          edge.dataset.childLayer = child.layer;
          treeEdges.push(edge);
          edgeGroup.appendChild(edge);
        });
      });
    });

    layerCoordinates.forEach(function (nodes) {
      nodes.forEach(function (node) {
        var halo = createSvgElement('circle', {
          class: 'tree-node-halo',
          cx: node.x,
          cy: node.y,
          r: 17
        });
        var circle = createSvgElement('circle', {
          class: 'tree-node',
          cx: node.x,
          cy: node.y,
          r: node.layer === '6' ? 8 : 10
        });
        halo.dataset.layer = node.layer;
        circle.dataset.layer = node.layer;
        treeNodes.push(halo, circle);
        haloGroup.appendChild(halo);
        nodeGroup.appendChild(circle);
      });
    });

    latentTreeSvg.appendChild(edgeGroup);
    latentTreeSvg.appendChild(haloGroup);
    latentTreeSvg.appendChild(nodeGroup);
  }

  function updateLatentTree(activeLayer) {
    treeNodes.forEach(function (node) {
      node.classList.toggle('is-active', node.dataset.layer === activeLayer);
    });

    treeEdges.forEach(function (edge) {
      edge.classList.toggle('is-active', edge.dataset.parentLayer === activeLayer || edge.dataset.childLayer === activeLayer);
    });
  }

  buildLatentTree();
  updateLatentTree('1');

  layerTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var layer = tab.dataset.layer;
      var source = tab.dataset.src;

      layerTabs.forEach(function (item) {
        item.classList.toggle('is-active', item === tab);
      });

      updateLatentTree(layer);

      if (hierarchyVideo && source) {
        var sourceNode = hierarchyVideo.querySelector('source');
        sourceNode.src = source;
        hierarchyVideo.load();
        hierarchyVideo.play().catch(function () {});
      }

      if (hierarchyLabel) {
        hierarchyLabel.textContent = tab.dataset.label || tab.textContent;
      }
    });
  });
});

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
  var treeLevels = Array.prototype.slice.call(document.querySelectorAll('.tree-level[data-layer]'), 0);
  var treeDiagram = document.querySelector('.tree-diagram');
  var treeEdges = document.querySelector('.tree-edges');

  function drawTreeEdges(activeLayer) {
    if (!treeDiagram || !treeEdges) {
      return;
    }

    treeEdges.innerHTML = '';

    var diagramRect = treeDiagram.getBoundingClientRect();
    var scrollLeft = treeDiagram.scrollLeft;
    var scrollTop = treeDiagram.scrollTop;
    var levelNodes = treeLevels.map(function (level) {
      return Array.prototype.slice.call(level.querySelectorAll('span'), 0);
    });

    treeEdges.setAttribute('width', Math.max(treeDiagram.scrollWidth, diagramRect.width));
    treeEdges.setAttribute('height', Math.max(treeDiagram.scrollHeight, diagramRect.height));
    treeEdges.setAttribute('viewBox', '0 0 ' + Math.max(treeDiagram.scrollWidth, diagramRect.width) + ' ' + Math.max(treeDiagram.scrollHeight, diagramRect.height));

    levelNodes.forEach(function (nodes, levelIndex) {
      var childNodes = levelNodes[levelIndex + 1];
      if (!childNodes) {
        return;
      }

      nodes.forEach(function (node, nodeIndex) {
        var children = childNodes.filter(function (_, childIndex) {
          if (levelIndex === 4) {
            return Math.floor(childIndex * nodes.length / childNodes.length) === nodeIndex;
          }
          return Math.floor(childIndex / 2) === nodeIndex;
        });

        children.forEach(function (child) {
          var parentRect = node.getBoundingClientRect();
          var childRect = child.getBoundingClientRect();
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', parentRect.left + parentRect.width / 2 - diagramRect.left + scrollLeft);
          line.setAttribute('y1', parentRect.top + parentRect.height / 2 - diagramRect.top + scrollTop);
          line.setAttribute('x2', childRect.left + childRect.width / 2 - diagramRect.left + scrollLeft);
          line.setAttribute('y2', childRect.top + childRect.height / 2 - diagramRect.top + scrollTop);
          line.classList.toggle('is-active', String(levelIndex + 1) === activeLayer || String(levelIndex + 2) === activeLayer);
          treeEdges.appendChild(line);
        });
      });
    });
  }

  drawTreeEdges('1');

  window.addEventListener('resize', function () {
    var activeTab = document.querySelector('.layer-tab.is-active');
    drawTreeEdges(activeTab ? activeTab.dataset.layer : '1');
  });

  if (treeDiagram) {
    treeDiagram.addEventListener('scroll', function () {
      var activeTab = document.querySelector('.layer-tab.is-active');
      drawTreeEdges(activeTab ? activeTab.dataset.layer : '1');
    });
  }

  layerTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var layer = tab.dataset.layer;
      var source = tab.dataset.src;

      layerTabs.forEach(function (item) {
        item.classList.toggle('is-active', item === tab);
      });

      treeLevels.forEach(function (levelNode) {
        levelNode.classList.toggle('is-active', levelNode.dataset.layer === layer);
      });
      drawTreeEdges(layer);

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

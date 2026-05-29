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

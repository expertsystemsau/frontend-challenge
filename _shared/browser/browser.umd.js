function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _bryntum$scheduler = bryntum.schedulerpro,
    Store = _bryntum$scheduler.Store,
    AjaxHelper = _bryntum$scheduler.AjaxHelper,
    BrowserHelper = _bryntum$scheduler.BrowserHelper,
    DomHelper = _bryntum$scheduler.DomHelper,
    DomSync = _bryntum$scheduler.DomSync,
    EventHelper = _bryntum$scheduler.EventHelper,
    WidgetHelper = _bryntum$scheduler.WidgetHelper,
    Popup = _bryntum$scheduler.Popup,
    Widget = _bryntum$scheduler.Widget,
    GlobalEvents = _bryntum$scheduler.GlobalEvents,
    VersionHelper = _bryntum$scheduler.VersionHelper;
/* eslint-disable no-new */

var ExamplesApp = /*#__PURE__*/function () {
  function ExamplesApp() {
    var _this = this;

    _classCallCheck(this, ExamplesApp);

    var me = this,
        version = VersionHelper.getVersion(shared.productName),
        groupOrder = window.groupOrder || {
      Pro: 0,
      'Integration/Pro': 1,
      Basic: 2,
      Intermediate: 3,
      Advanced: 4,
      Integration: 5,
      'Integration/Angular': 6,
      'Integration/Ionic': 7,
      'Integration/React': 8,
      'Integration/Vue': 9
    },
        examples = (window.examples || []).map(function (example) {
      return Object.assign({
        fullFolder: _this.exampleFolder(example)
      }, example);
    }),
        storageName = function storageName(name) {
      return "bryntum-".concat(shared.productName, "-demo-").concat(name);
    },
        saveToStorage = function saveToStorage(name, value) {
      return BrowserHelper.setLocalStorageItem(storageName(name), value);
    },
        loadFromStorage = function loadFromStorage(name) {
      return BrowserHelper.getLocalStorageItem(storageName(name));
    },
        store = me.examplesStore = new Store({
      data: examples,
      fields: ['folder', 'rootFolder', 'fullFolder', 'group', 'title', 'version', 'build', 'since', 'offline', 'ie', 'edge', {
        name: 'id',
        dataSource: 'fullFolder'
      }],
      groupers: [{
        field: 'group',
        fn: function fn(a, b) {
          return groupOrder[a.group] - groupOrder[b.group];
        }
      }],
      listeners: {
        change: function change() {
          if (me.rendered) {
            me.refresh();
          }
        },
        thisObj: me
      }
    });

    me.exampleStore = store;
    me.currentTipLoadPromiseByURL = {};
    me.developmentMode = BrowserHelper.queryString.develop != null; // remove prerendered examples

    me.examplesContainerEl = document.getElementById('scroller');
    me.examplesContainerEl.innerHTML = '';
    EventHelper.on({
      scroll: function scroll() {
        var _topElement$dataset;

        var topElement = document.elementFromPoint(100, 150);

        if (topElement === null || topElement === void 0 ? void 0 : (_topElement$dataset = topElement.dataset) === null || _topElement$dataset === void 0 ? void 0 : _topElement$dataset.group) {
          jumpTo.value = topElement.dataset.group;
        }
      },
      element: document.getElementById('browser'),
      throttled: 250,
      thisObj: me
    });
    document.body.classList.add(shared.theme); // Add style for IE11

    if (BrowserHelper.isIE11) {
      document.body.classList.add('b-ie');
    }

    document.getElementById('title').innerHTML = "".concat(shared.productFullName, " ").concat(version);
    GlobalEvents.on({
      theme: function theme() {
        document.body.classList.remove(shared.prevTheme);
        document.body.classList.add(shared.theme);

        if (me.rendered) {
          me.refresh();
        }
      }
    });
    me.isOnline = /^(www\.)?bryntum\.com/.test(location.host) || location.search.includes('online');
    me.buildTip = me.isOnline ? 'This demo is not viewable online, but included when you download the trial. ' : 'This demo needs to be built before it can be viewed. ';

    var _WidgetHelper$append = WidgetHelper.append({
      type: 'toolbar',
      items: {
        jumpTo: {
          type: 'combo',
          width: '15em',
          triggers: {
            list: {
              cls: 'b-fa b-fa-list',
              align: 'start'
            }
          },
          editable: false,
          placeholder: 'Jump to',
          items: store.groupRecords.map(function (r) {
            return {
              id: r.id,
              text: r.meta.groupRowFor
            };
          }),
          highlightExternalChange: false,
          onSelect: function onSelect(_ref) {
            var record = _ref.record,
                userAction = _ref.userAction;

            if (userAction) {
              saveToStorage('group', record.text);
              me.scrollToGroup(record.text);
            }
          }
        },
        filterField: {
          type: 'filterfield',
          store: store,
          filterFunction: function filterFunction(record, value) {
            // Check if all words in value exist in example title
            return value === null || value === void 0 ? void 0 : value.toLowerCase().split(' ').every(function (word) {
              return record.title.toLowerCase().includes(word);
            });
          },
          placeholder: 'Type to filter',
          triggers: {
            filter: {
              cls: 'b-fa b-fa-filter',
              align: 'start'
            }
          },
          listeners: {
            change: function change(_ref2) {
              var value = _ref2.value;
              saveToStorage('filter', value);
            }
          }
        },
        separator: '->',
        upgradeButton: {
          id: 'upgrade-button',
          type: 'button',
          text: 'Upgrade guide',
          icon: 'b-fa-book',
          href: me.isOnline ? "/docs/".concat(shared.productName === 'schedulerpro' ? 'schedulerpro-pro' : shared.productName, "#upgrade-guide") : '../docs#upgrade-guide'
        },
        docsButton: {
          id: 'docs-button',
          type: 'button',
          text: 'Documentation',
          icon: 'b-fa-book-open',
          href: me.isOnline ? "/docs/".concat(shared.productName === 'schedulerpro' ? 'schedulerpro-pro' : shared.productName) : '../docs'
        },
        trialButton: me.isOnline ? {
          type: 'button',
          id: 'downloadtrial',
          text: 'Download Trial',
          icon: 'b-fa-download',
          menu: {
            type: 'trialpanel',
            productId: shared.productName,
            align: {
              align: 't-b',
              constrainPadding: 20
            }
          }
        } : null
      }
    }, {
      insertBefore: document.getElementById('browser')
    }),
        _WidgetHelper$append2 = _slicedToArray(_WidgetHelper$append, 1),
        toolbar = _WidgetHelper$append2[0];

    var _toolbar$widgetMap = toolbar.widgetMap,
        filterField = _toolbar$widgetMap.filterField,
        jumpTo = _toolbar$widgetMap.jumpTo;

    if (location.search.match('prerender')) {
      me.embedDescriptions().then(me.render.bind(me));
    } else {
      me.render();
    }

    if (!me.developmentMode) {
      var storedGroup = loadFromStorage('group');

      if (storedGroup) {
        jumpTo.value = storedGroup;
        me.scrollToGroup(storedGroup);
      }

      var storedFilter = loadFromStorage('filter');
      storedFilter && (filterField.value = storedFilter);
    }

    window.addEventListener('DOMContentLoaded', me.setInitialScroll.bind(me));
  }

  _createClass(ExamplesApp, [{
    key: "onCloseClick",
    value: function onCloseClick() {
      document.getElementById('intro').style.maxHeight = '0';
    }
  }, {
    key: "setInitialScroll",
    value: function setInitialScroll() {
      if (window.location.hash) {
        // To prevent browser built-in scroll by location hash we use example and header id with `b-` prefix
        var demoId = window.location.hash.split('#example-')[1];
        this.scrollToDemo(this.examplesStore.getById(demoId), null);
      }
    }
  }, {
    key: "scrollToDemo",
    value: function scrollToDemo(demo) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        behavior: 'smooth'
      };

      // Group/demo might be filtered out
      if (demo) {
        var element = document.getElementById('b-example-' + demo.folder.replace(/\//g, '-'));

        if (BrowserHelper.isIE11) {
          element.scrollIntoView();
        } else {
          element.scrollIntoView(options);
        }
      }
    }
  }, {
    key: "scrollToGroup",
    value: function scrollToGroup(group) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        behavior: 'smooth'
      };
      this.scrollToDemo(this.exampleStore.find(function (example) {
        return example.group === group;
      }), options);
    }
  }, {
    key: "getDomConfig",
    value: function getDomConfig() {
      var _this2 = this;

      var _shared = shared,
          theme = _shared.theme,
          version = VersionHelper.getVersion(shared.productName),
          isNew = function isNew(example) {
        return version && example.since && version.startsWith(example.since);
      },
          isUpdated = function isUpdated(example) {
        return version && example.updated && version.startsWith(example.updated);
      },
          configs = [];

      this.examplesStore.records.forEach(function (example) {
        if (example.isSpecialRow) {
          var group = example.meta.groupRowFor;
          configs.push({
            tag: 'h2',
            id: "b-".concat(group),
            className: _defineProperty({
              'group-header': 1
            }, group, 1),
            dataset: {
              syncId: "header-".concat(group),
              group: group
            },
            html: group
          });
        } else {
          // Show build popup for examples marked as offline and for those who need building when demo browser is offline
          var hasPopup = example.build && !_this2.isOnline || example.offline,
              id = _this2.exampleId(example);

          configs.push({
            tag: 'a',
            className: {
              example: 1,
              new: isNew(example),
              updated: isUpdated(example),
              offline: example.offline
            },
            id: id,
            draggable: false,
            href: example.fullFolder,
            dataset: {
              linkText: hasPopup && _this2.exampleLinkText(example),
              linkUrl: hasPopup && example.fullFolder,
              syncId: id,
              group: example.group
            },
            children: [{
              className: 'image',
              children: [{
                tag: 'img',
                draggable: false,
                src: _this2.exampleThumbnail(example, theme),
                alt: example.tooltip || example.title || '',
                dataset: {
                  group: example.group
                }
              }, {
                tag: 'i',
                className: _defineProperty({
                  tooltip: 1,
                  'b-fa': 1
                }, hasPopup ? 'b-fa-cog build' : 'b-fa-info', 1)
              }, example.version ? {
                className: 'version',
                html: example.version
              } : null]
            }, {
              tag: 'label',
              className: 'title',
              html: example.title,
              dataset: {
                group: example.group
              }
            }]
          });
        }
      });
      return configs;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      DomSync.sync({
        targetElement: this.examplesContainerEl,
        domConfig: {
          onlyChildren: true,
          children: this.getDomConfig()
        },
        syncIdField: 'syncId'
      });
    }
  }, {
    key: "render",
    value: function render() {
      var me = this;
      me.refresh(); // A singleton tooltip which displays example info on hover of (i) icons.

      Widget.attachTooltip(me.examplesContainerEl, {
        forSelector: 'i.tooltip',
        header: true,
        scrollAction: 'realign',
        textContent: true,
        getHtml: function () {
          var _getHtml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
            var tip, activeTarget, linkNode, url, u, requestPromise, response, json, html;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    tip = _ref3.tip;
                    activeTarget = tip.activeTarget;

                    if (!activeTarget.dataset.tooltip) {
                      _context.next = 5;
                      break;
                    }

                    tip.titleElement.innerHTML = activeTarget.dataset.tooltipTitle;
                    return _context.abrupt("return", activeTarget.dataset.tooltip);

                  case 5:
                    linkNode = activeTarget.closest('a');
                    url = "".concat(linkNode.getAttribute('href') || linkNode.dataset.linkUrl, "/app.config.json"); // Cancel all ongoing ajax loads (except for the URL we are interested in)
                    // before fetching tip content

                    for (u in me.currentTipLoadPromiseByURL) {
                      if (u !== url) {
                        me.currentTipLoadPromiseByURL[u].abort();
                      }
                    } // if we don't have ongoing requests to the URL


                    if (me.currentTipLoadPromiseByURL[url]) {
                      _context.next = 18;
                      break;
                    }

                    requestPromise = me.currentTipLoadPromiseByURL[url] = AjaxHelper.get(url, {
                      parseJson: true
                    });
                    _context.next = 12;
                    return requestPromise;

                  case 12:
                    response = _context.sent;
                    json = response.parsedJson;
                    html = activeTarget.dataset.tooltip = json.description.replace(/[\n\r]/g, '') + (/build/.test(activeTarget.className) ? "<br><b>".concat(me.buildTip, "</b>") : '');
                    activeTarget.dataset.tooltipTitle = tip.titleElement.innerHTML = json.title.replace(/[\n\r]/g, '');
                    delete me.currentTipLoadPromiseByURL[url];
                    return _context.abrupt("return", html);

                  case 18:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function getHtml(_x) {
            return _getHtml.apply(this, arguments);
          }

          return getHtml;
        }()
      });
      document.getElementById('intro').style.display = 'block';
      document.getElementById('close-button').addEventListener('click', me.onCloseClick.bind(me));
      document.body.addEventListener('error', me.onThumbError.bind(me), true);
      EventHelper.on({
        element: me.examplesContainerEl,
        click: function click(event) {
          var el = DomHelper.up(event.target, '[data-link-url]');
          new Popup({
            forElement: el,
            cls: 'b-demo-unavailable',
            header: '<i class="b-fa b-fa-cog"></i> ' + (me.isOnline ? 'Download needed' : 'Needs building'),
            html: me.buildTip + "The demo can be found in distribution folder: <i class=\"b-fa b-fa-folder-open\"> <b>" + (!me.isOnline ? "<a href=\"".concat(el.dataset.linkUrl, "\">").concat(el.dataset.linkText, "</a>") : el.dataset.linkText) + '</b>',
            closeAction: 'destroy',
            textContent: false,
            width: el.getBoundingClientRect().width,
            anchor: true,
            scrollAction: 'realign'
          });
          event.preventDefault();
        },
        delegate: '[data-link-url]'
      });
      EventHelper.on({
        element: me.examplesContainerEl,
        click: function click(event) {
          // To be able to select example name, need to make the text do not work as a link
          if (window.getSelection().toString().length) {
            event.preventDefault();
          }
        },
        delegate: 'a.example label'
      });
      var demoDiv = document.getElementById('live-example'),
          widgetConfig = window.introWidget; // taken from `examples/_shared/data/widget.js`

      if (demoDiv && widgetConfig) {
        var createIntro = function createIntro() {
          // Use "appendTo" instead of "adopt" to insert Grid into the sized container, so IE11 can measure height for grid body
          widgetConfig.appendTo = demoDiv;
          widgetConfig.requireSize = true;
          Widget.create(widgetConfig);
        }; // Only create the widget when the CSS decides that the host div becomes visible.


        if (DomHelper.getStyleValue(demoDiv, 'display') !== 'none') {
          createIntro();
        } else {
          var remover = EventHelper.on({
            element: window,
            resize: function resize() {
              if (DomHelper.isVisible(demoDiv)) {
                createIntro();
                remover();
              }
            }
          });
        }
      }

      me.rendered = true;
    }
  }, {
    key: "embedDescriptions",
    value: function embedDescriptions() {
      var _this3 = this;

      return new Promise(function (resolve) {
        var promises = [];

        _this3.examplesStore.forEach(function (example) {
          promises.push(AjaxHelper.get(_this3.exampleConfig(example), {
            parseJson: true
          }).then(function (response) {
            var json = response.parsedJson;

            if (json) {
              example.tooltip = json.title + ' - ' + json.description.replace(/[\n\r]/g, ' ').replace(/"/g, '\'');
            }
          }));
        });

        Promise.all(promises).then(resolve);
      });
    }
  }, {
    key: "onThumbError",
    value: function onThumbError(e) {
      var _e$target, _e$target$src;

      if ((_e$target = e.target) === null || _e$target === void 0 ? void 0 : (_e$target$src = _e$target.src) === null || _e$target$src === void 0 ? void 0 : _e$target$src.includes('thumb')) {
        e.target.style.display = 'none';
      }
    }
  }, {
    key: "exampleFolder",
    value: function exampleFolder(example) {
      var defaultRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return "".concat(example.rootFolder || defaultRoot).concat(example.folder);
    }
  }, {
    key: "exampleConfig",
    value: function exampleConfig(example) {
      return "".concat(example.fullFolder, "/app.config.json");
    }
  }, {
    key: "exampleId",
    value: function exampleId(example) {
      return "b-example-".concat(example.fullFolder.replace(/\.\.\//gm, '').replace(/\//gm, '-'));
    }
  }, {
    key: "exampleLinkText",
    value: function exampleLinkText(example) {
      return this.exampleFolder(example, 'examples/').replace(/\.\.\//gm, '').replace(/\//gm, '/<wbr>');
    }
  }, {
    key: "exampleThumbnail",
    value: function exampleThumbnail(example, theme) {
      return "".concat(example.fullFolder, "/meta/thumb.").concat(theme.toLowerCase(), ".png");
    }
  }]);

  return ExamplesApp;
}();

window.demoBrowser = new ExamplesApp();
/* eslint-disable no-new */
import shared from '../shared.js';
import Store from '../../../lib/Core/data/Store.js';
import AjaxHelper from '../../../lib/Core/helper/AjaxHelper.js';
import BrowserHelper from '../../../lib/Core/helper/BrowserHelper.js';
import DomHelper from '../../../lib/Core/helper/DomHelper.js';
import DomSync from '../../../lib/Core/helper/DomSync.js';
import EventHelper from '../../../lib/Core/helper/EventHelper.js';
import WidgetHelper from '../../../lib/Core/helper/WidgetHelper.js';
import '../../../lib/Grid/view/Grid.js';
import '../../../lib/Grid/column/CheckColumn.js';
import '../../../lib/Core/widget/FilterField.js';
import Popup from '../../../lib/Core/widget/Popup.js';
import Widget from '../../../lib/Core/widget/Widget.js';
import GlobalEvents from '../../../lib/Core/GlobalEvents.js';
import VersionHelper from '../../../lib/Core/helper/VersionHelper.js';
import './lib/TrialPanel.js';

class ExamplesApp {
    constructor() {
        const
            me         = this,
            version    = VersionHelper.getVersion(shared.productName),
            groupOrder      = window.groupOrder || {
                Pro                   : 0,
                'Integration/Pro'     : 1,
                Basic                 : 2,
                Intermediate          : 3,
                Advanced              : 4,
                Integration           : 5,
                'Integration/Angular' : 6,
                'Integration/Ionic'   : 7,
                'Integration/React'   : 8,
                'Integration/Vue'     : 9
            },
            examples        = (window.examples || []).map(example => Object.assign(
                { fullFolder : this.exampleFolder(example) }, example)
            ),
            storageName     = (name) => `bryntum-${shared.productName}-demo-${name}`,
            saveToStorage   = (name, value) => BrowserHelper.setLocalStorageItem(storageName(name), value),
            loadFromStorage = (name) => BrowserHelper.getLocalStorageItem(storageName(name)),
            store           = me.examplesStore = new Store({
                data   : examples,
                fields : [
                    'folder',
                    'rootFolder',
                    'fullFolder',
                    'group',
                    'title',
                    'version',
                    'build',
                    'since',
                    'offline',
                    'ie',
                    'edge',
                    { name : 'id', dataSource : 'fullFolder' }
                ],
                groupers : [
                    {
                        field : 'group',
                        fn    : (a, b) => groupOrder[a.group] - groupOrder[b.group]
                    }
                ],
                listeners : {
                    change() {
                        if (me.rendered) {
                            me.refresh();
                        }
                    },
                    thisObj : me
                }
            });

        me.exampleStore = store;
        me.currentTipLoadPromiseByURL = {};
        me.developmentMode = BrowserHelper.queryString.develop != null;

        // remove prerendered examples
        me.examplesContainerEl = document.getElementById('scroller');
        me.examplesContainerEl.innerHTML = '';

        EventHelper.on({
            scroll() {
                const topElement = document.elementFromPoint(100, 150);
                if (topElement?.dataset?.group) {
                    jumpTo.value = topElement.dataset.group;
                }
            },
            element   : document.getElementById('browser'),
            throttled : 250,
            thisObj   : me
        });

        document.body.classList.add(shared.theme);

        // Add style for IE11
        if (BrowserHelper.isIE11) {
            document.body.classList.add('b-ie');
        }

        document.getElementById('title').innerHTML = `${shared.productFullName} ${version}`;

        GlobalEvents.on({
            theme() {
                document.body.classList.remove(shared.prevTheme);
                document.body.classList.add(shared.theme);

                if (me.rendered) {
                    me.refresh();
                }
            }
        });

        me.isOnline = /^(www\.)?bryntum\.com/.test(location.host) || location.search.includes('online');
        me.buildTip = me.isOnline ? 'This demo is not viewable online, but included when you download the trial. ' : 'This demo needs to be built before it can be viewed. ';

        const [toolbar] = WidgetHelper.append(
            {
                type  : 'toolbar',
                items : {
                    jumpTo : {
                        type     : 'combo',
                        width    : '15em',
                        triggers : {
                            list : {
                                cls   : 'b-fa b-fa-list',
                                align : 'start'
                            }
                        },
                        editable                : false,
                        placeholder             : 'Jump to',
                        items                   : store.groupRecords.map(r => ({ id : r.id, text : r.meta.groupRowFor })),
                        highlightExternalChange : false,
                        onSelect({ record, userAction }) {
                            if (userAction) {
                                saveToStorage('group', record.text);
                                me.scrollToGroup(record.text);
                            }
                        }
                    },
                    filterField : {
                        type : 'filterfield',
                        store,
                        filterFunction(record, value) {
                            // Check if all words in value exist in example title
                            return value?.toLowerCase().split(' ').every(word => record.title.toLowerCase().includes(word));
                        },
                        placeholder : 'Type to filter',
                        triggers    : {
                            filter : {
                                cls   : 'b-fa b-fa-filter',
                                align : 'start'
                            }
                        },
                        listeners : {
                            change({ value }) {
                                saveToStorage('filter', value);
                            }
                        }
                    },
                    separator     : '->',
                    upgradeButton : {
                        id   : 'upgrade-button',
                        type : 'button',
                        text : 'Upgrade guide',
                        icon : 'b-fa-book',
                        href : me.isOnline ? `/docs/${shared.productName === 'schedulerpro' ? 'schedulerpro-pro' : shared.productName}#upgrade-guide` : '../docs#upgrade-guide'
                    },
                    docsButton : {
                        id   : 'docs-button',
                        type : 'button',
                        text : 'Documentation',
                        icon : 'b-fa-book-open',
                        href : me.isOnline ? `/docs/${shared.productName === 'schedulerpro' ? 'schedulerpro-pro' : shared.productName}` : '../docs'
                    },
                    trialButton : me.isOnline ? {
                        type : 'button',
                        id   : 'downloadtrial',
                        text : 'Download Trial',
                        icon : 'b-fa-download',
                        menu : {
                            type      : 'trialpanel',
                            productId : shared.productName,
                            align     : {
                                align            : 't-b',
                                constrainPadding : 20
                            }
                        }
                    } : null
                }
            },
            { insertBefore : document.getElementById('browser') }
        );

        const { filterField, jumpTo } = toolbar.widgetMap;

        if (location.search.match('prerender')) {
            me.embedDescriptions().then(me.render.bind(me));
        }
        else {
            me.render();
        }

        if (!me.developmentMode) {
            const storedGroup = loadFromStorage('group');
            if (storedGroup) {
                jumpTo.value = storedGroup;
                me.scrollToGroup(storedGroup);
            }

            const storedFilter = loadFromStorage('filter');
            storedFilter && (filterField.value = storedFilter);
        }

        window.addEventListener('DOMContentLoaded', me.setInitialScroll.bind(me));
    }

    onCloseClick() {
        document.getElementById('intro').style.maxHeight = '0';
    }

    setInitialScroll() {
        if (window.location.hash) {
            // To prevent browser built-in scroll by location hash we use example and header id with `b-` prefix
            const demoId = window.location.hash.split('#example-')[1];
            this.scrollToDemo(this.examplesStore.getById(demoId), null);
        }
    }

    scrollToDemo(demo, options = { behavior : 'smooth' }) {
        // Group/demo might be filtered out
        if (demo) {
            const element = document.getElementById('b-example-' + demo.folder.replace(/\//g, '-'));
            if (BrowserHelper.isIE11) {
                element.scrollIntoView();
            }
            else {
                element.scrollIntoView(options);
            }
        }
    }

    scrollToGroup(group, options = { behavior : 'smooth' }) {
        this.scrollToDemo(this.exampleStore.find(example => example.group === group), options);
    }

    getDomConfig() {
        const
            { theme } = shared,
            version   = VersionHelper.getVersion(shared.productName),
            isNew     = example => (version && example.since && version.startsWith(example.since)),
            isUpdated = example => (version && example.updated && version.startsWith(example.updated)),
            configs   = [];

        this.examplesStore.records.forEach(example => {
            if (example.isSpecialRow) {
                const group = example.meta.groupRowFor;

                configs.push(
                    {
                        tag       : 'h2',
                        id        : `b-${group}`,
                        className : {
                            'group-header' : 1,
                            [group]        : 1
                        },
                        dataset : {
                            syncId : `header-${group}`,
                            group
                        },
                        html : group
                    });
            }
            else {
                // Show build popup for examples marked as offline and for those who need building when demo browser is offline
                const
                    hasPopup = (example.build && !this.isOnline) || example.offline,
                    id       = this.exampleId(example);

                configs.push({
                    tag       : 'a',
                    className : {
                        example : 1,
                        new     : isNew(example),
                        updated : isUpdated(example),
                        offline : example.offline
                    },
                    id,
                    draggable : false,
                    href      : example.fullFolder,
                    dataset   : {
                        linkText : hasPopup && this.exampleLinkText(example),
                        linkUrl  : hasPopup && example.fullFolder,
                        syncId   : id,
                        group    : example.group
                    },
                    children : [
                        {
                            className : 'image',
                            children  : [
                                {
                                    tag       : 'img',
                                    draggable : false,
                                    src       : this.exampleThumbnail(example, theme),
                                    alt       : example.tooltip || example.title || '',
                                    dataset   : {
                                        group : example.group
                                    }
                                },
                                {
                                    tag       : 'i',
                                    className : {
                                        tooltip                                     : 1,
                                        'b-fa'                                      : 1,
                                        [hasPopup ? 'b-fa-cog build' : 'b-fa-info'] : 1
                                    }
                                },
                                example.version ? {
                                    className : 'version',
                                    html      : example.version
                                } : null
                            ]
                        },
                        {
                            tag       : 'label',
                            className : 'title',
                            html      : example.title,
                            dataset   : {
                                group : example.group
                            }
                        }
                    ]
                });
            }
        });

        return configs;
    }

    refresh() {
        DomSync.sync({
            targetElement : this.examplesContainerEl,
            domConfig     : {
                onlyChildren : true,
                children     : this.getDomConfig()
            },
            syncIdField : 'syncId'
        });
    }

    render() {
        const me = this;

        me.refresh();

        // A singleton tooltip which displays example info on hover of (i) icons.
        Widget.attachTooltip(me.examplesContainerEl, {
            forSelector  : 'i.tooltip',
            header       : true,
            scrollAction : 'realign',
            textContent  : true,
            getHtml      : async({ tip }) => {
                const activeTarget = tip.activeTarget;

                if (activeTarget.dataset.tooltip) {
                    tip.titleElement.innerHTML = activeTarget.dataset.tooltipTitle;
                    return activeTarget.dataset.tooltip;
                }

                const linkNode = activeTarget.closest('a');

                const url = `${linkNode.getAttribute('href') || linkNode.dataset.linkUrl}/app.config.json`;

                // Cancel all ongoing ajax loads (except for the URL we are interested in)
                // before fetching tip content
                for (const u in me.currentTipLoadPromiseByURL) {
                    if (u !== url) {
                        me.currentTipLoadPromiseByURL[u].abort();
                    }
                }

                // if we don't have ongoing requests to the URL
                if (!me.currentTipLoadPromiseByURL[url]) {
                    const
                        requestPromise = me.currentTipLoadPromiseByURL[url] = AjaxHelper.get(url, { parseJson : true }),
                        response       = await requestPromise,
                        json           = response.parsedJson,
                        html           = activeTarget.dataset.tooltip = json.description.replace(/[\n\r]/g, '') +
                            ((/build/.test(activeTarget.className)) ? `<br><b>${me.buildTip}</b>` : '');

                    activeTarget.dataset.tooltipTitle = tip.titleElement.innerHTML = json.title.replace(/[\n\r]/g, '');

                    delete me.currentTipLoadPromiseByURL[url];

                    return html;
                }
            }
        });

        document.getElementById('intro').style.display = 'block';
        document.getElementById('close-button').addEventListener('click', me.onCloseClick.bind(me));
        document.body.addEventListener('error', me.onThumbError.bind(me), true);

        EventHelper.on({
            element : me.examplesContainerEl,
            click(event) {
                const el = DomHelper.up(event.target, '[data-link-url]');
                new Popup({
                    forElement : el,
                    cls        : 'b-demo-unavailable',
                    header     : '<i class="b-fa b-fa-cog"></i> ' + (me.isOnline ? 'Download needed' : 'Needs building'),
                    html       : me.buildTip + `The demo can be found in distribution folder: <i class="b-fa b-fa-folder-open"> <b>` +
                        (!me.isOnline ? `<a href="${el.dataset.linkUrl}">${el.dataset.linkText}</a>` : el.dataset.linkText) + '</b>',
                    closeAction  : 'destroy',
                    textContent  : false,
                    width        : el.getBoundingClientRect().width,
                    anchor       : true,
                    scrollAction : 'realign'
                });
                event.preventDefault();
            },
            delegate : '[data-link-url]'
        });

        EventHelper.on({
            element : me.examplesContainerEl,
            click(event) {
                // To be able to select example name, need to make the text do not work as a link
                if (window.getSelection().toString().length) {
                    event.preventDefault();
                }
            },
            delegate : 'a.example label'
        });

        const
            demoDiv      = document.getElementById('live-example'),
            widgetConfig = window.introWidget; // taken from `examples/_shared/data/widget.js`

        if (demoDiv && widgetConfig) {
            const createIntro = () => {
                // Use "appendTo" instead of "adopt" to insert Grid into the sized container, so IE11 can measure height for grid body
                widgetConfig.appendTo = demoDiv;
                widgetConfig.requireSize = true;
                Widget.create(widgetConfig);
            };

            // Only create the widget when the CSS decides that the host div becomes visible.
            if (DomHelper.getStyleValue(demoDiv, 'display') !== 'none') {
                createIntro();
            }
            else {
                const remover = EventHelper.on({
                    element : window,
                    resize() {
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

    embedDescriptions() {
        return new Promise((resolve) => {
            const promises = [];
            this.examplesStore.forEach(example => {
                promises.push(
                    AjaxHelper.get(this.exampleConfig(example), { parseJson : true }).then(response => {
                        const json = response.parsedJson;
                        if (json) {
                            example.tooltip = json.title + ' - ' +
                                json.description.replace(/[\n\r]/g, ' ').replace(/"/g, '\'');
                        }
                    })
                );
            });
            Promise.all(promises).then(resolve);
        });
    }

    onThumbError(e) {
        if (e.target?.src?.includes('thumb')) {
            e.target.style.display = 'none';
        }
    }

    exampleFolder(example, defaultRoot = '') {
        return `${example.rootFolder || defaultRoot}${example.folder}`;
    };

    exampleConfig(example) {
        return `${example.fullFolder}/app.config.json`;
    }

    exampleId(example) {
        return `b-example-${example.fullFolder.replace(/\.\.\//gm, '').replace(/\//gm, '-')}`;
    }

    exampleLinkText(example) {
        return this.exampleFolder(example, 'examples/').replace(/\.\.\//gm, '').replace(/\//gm, '/<wbr>');
    }

    exampleThumbnail(example, theme) {
        return `${example.fullFolder}/meta/thumb.${theme.toLowerCase()}.png`;
    }

}

window.demoBrowser = new ExamplesApp();

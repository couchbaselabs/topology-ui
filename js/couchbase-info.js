const classPrefixHelpers = typeof require === "function" ? require("../lib/class-prefix") : (() => {
    const renderRootClassName = "cb-topology-renderer";
    const rendererUtilityPrefix = "cb-tu-";

    function isFontAwesomeClass(token) {
        return /^fa([bdrslt])?$/.test(token) || /^fa-[A-Za-z0-9-]+$/.test(token);
    }

    function isLibraryOwnedClass(token) {
        return !!token && (
            token === renderRootClassName ||
            token.indexOf(rendererUtilityPrefix) === 0 ||
            token.indexOf("cb-tr-") === 0
        );
    }

    function prefixUtilityClassName(token) {
        return token && !isLibraryOwnedClass(token) && !isFontAwesomeClass(token) ?
            rendererUtilityPrefix + token :
            token;
    }

    function prefixClassList(classList) {
        return classList
            .split(/\s+/)
            .filter(Boolean)
            .map(prefixUtilityClassName)
            .join(" ");
    }

    function prefixHtmlClassAttributes(html) {
        return html.replace(/\bclass=(["'])(.*?)\1/g, (match, quote, classList) => (
            "class=" + quote + prefixClassList(classList) + quote
        ));
    }

    return {
        prefixHtmlClassAttributes,
        renderRootClass: renderRootClassName
    };
})();

const prefix_html_class_attributes = classPrefixHelpers.prefixHtmlClassAttributes;

const defaultTheme = {
    mobile: {
        groups: [{border: "border-blue-400", color: "bg-blue-400"},
            {border: "border-green-500", color: "bg-green-500"},
            {border: "border-yellow-500", color: "bg-yellow-500"}],
        databases: {icon: "fas fa-signal", color: "bg-orange-400"},
        network: {
            urlColor: "text-orange-400",
            icon: "fas fa-network-wired",
            color: "bg-blue-500",
            textColor: "text-white",
            displayText: "Load Balancer"
        },
        version: {
            color: "bg-red-700",
            lineColor: "border-red-200",
            textColor: "text-white"
        }
    },
    cluster: {
        groups: [{border: "border-blue-400 bg-blue-50", color: "bg-blue-400"},
            {border: "border-green-500 bg-green-50", color: "bg-green-500"},
            {border: "border-yellow-500 bg-yellow-50", color: "bg-yellow-500"}],
        buckets: {
            ephemeral: {
                color: "bg-orange-400",
                icon: "fas fa-database",
                scopes: {
                    color: "bg-orange-300",
                    textColor: "text-white",
                    iconFold: "fas fa-caret-right",
                    iconExtend: "fas fa-caret-down"
                },
                collections: {color: "bg-gray-300", textColor: "text-white", icon: "fas fa-ellipsis-v"}
            },
            couchbase: {
                color: "bg-blue-400",
                icon: "fas fa-database",
                scopes: {
                    color: "bg-blue-200",
                    textColor: "text-white",
                    iconFold: "fas fa-caret-right",
                    iconExtend: "fas fa-caret-down"
                },
                collections: {color: "bg-gray-300", textColor: "text-white", icon: "fas fa-ellipsis-v"}
            },
            magma: {
                color: "bg-green-500",
                icon: "fas fa-database",
                scopes: {
                    color: "bg-green-300",
                    textColor: "text-white",
                    iconFold: "fas fa-caret-right",
                    iconExtend: "fas fa-caret-down"
                },
                collections: {color: "bg-gray-300", textColor: "text-white", icon: "fas fa-ellipsis-v"}
            },
            total: {color: "bg-gray-800", icon: "fas fa-plus-square"},
            default: {
                color: "bg-blue-400",
                icon: "fas fa-database",
                scopes: {
                    color: "bg-blue-200",
                    textColor: "text-white",
                    iconFold: "fas fa-caret-right",
                    iconExtend: "fas fa-caret-down"
                },
                collections: {color: "bg-gray-300", textColor: "text-white", icon: "fas fa-ellipsis-v"}
            }
        },
        version: {
            color: "bg-red-400",
            textColor: "text-white"
        }
    },
    resources: {
        color: "bg-gray-700",
        textColor: "text-white"
    }
}

const defaultRenderOptions = {
    assetRoot: "images"
}

const renderRootClass = classPrefixHelpers.renderRootClass;

let activeRenderOptions = defaultRenderOptions;

function has_items(data) {
    return Array.isArray(data) && data.length > 0;
}

function has_server_topology(data) {
    return !!(data && (
        has_items(data.serverGroups) ||
        data.name ||
        data.version ||
        data.resources
    ));
}

function has_mobile_topology(data) {
    return !!(data && (
        has_items(data.groups) ||
        has_items(data.databases) ||
        has_items(data.clients) ||
        data.publicAddress ||
        data.version
    ));
}

function normalize_asset_root(root) {
    if (!root) {
        return defaultRenderOptions.assetRoot;
    }
    return root.replace(/\/+$/, "");
}

function with_render_options(options, render) {
    const previousOptions = activeRenderOptions;
    activeRenderOptions = {
        assetRoot: normalize_asset_root(options && options.assetRoot)
    };
    try {
        return render();
    } finally {
        activeRenderOptions = previousOptions;
    }
}

function get_asset_root() {
    return normalize_asset_root(activeRenderOptions && activeRenderOptions.assetRoot);
}

function set_asset_root(root) {
    defaultRenderOptions.assetRoot = normalize_asset_root(root);
}

function get_asset_path(assetName) {
    return get_asset_root() + "/" + assetName;
}


function add_cluster_name(clusterName) {
    // set cluster name
    return "<div class=\"flex w-full -my-3 \">" +
        "     <span class=\"bg-black rounded-xl text-xs text-white font-bold mx-2 px-4\">" + clusterName + "</span>" +
        "</div>"
}

function create_server_group_displayName(sgName, groupsVisible, color) {
    return sgName ? "<div class=\"-my-4 flex-row align-center\">" +
        "    <span class=\"" + color + " z-10 rounded-xl text-xs text-white font-bold mx-4 px-4 my-0 py-0\">" + sgName + "</span>" +
        "</div>" : "";

}

function normalize(name, maxLength) {
    if (name && name.length > maxLength) {
        return name.substr(0, 2) + " ... " + name.substr(-4, 6)
    }
    return name
}

function add_node_name(name) {
    let hidden = name ? "" : "hidden";
    const displayName = normalize(name, 9);
    return "   <p class=\"flex-row text-xs text-gray-400 font-bold " + hidden + " \">" + displayName + "</p>"
}

function create_resources(resources) {
    let hidden = "hidden";
    let memory = 1;
    let cpus = 0.5;
    let cfg = defaultTheme.resources.color + " " + defaultTheme.resources.textColor;
    if (resources) {
        memory = resources.memory
        cpus = resources.cpus
        hidden = "";
    }
    return "                                        <div class=\"align-center " + hidden + " \">\n" +
        "                                            <div class=\" " + cfg + " rounded-lg text-xs font-bold mx-2 px-2 \">\n" +
        "                                                <p>" + memory + " GB</p>" +
        "                                                <p> " + cpus + " CPUs</p>" +
        "                                            </div>\n" +
        "                                        </div>\n";
    /* return " <div class=\"-my-6 align-center " + hidden + "\">" +
         "             <div class=\"bg-gray-700 z-50 rounded-lg text-xs text-white font-bold mx-2 px-2 py-0 my-4 \">" +
         "               <p>" + memory + " GB</p>" +
         "               <p> " + cpus + " CPUs</p>" +
         "             </div>" +
         "         </div>"*/
}

function add_node_image(resources) {
    let height = resources ? 50 : 60;
    return "<svg id=\"svg-node1\" y=\"10\" width=\"90\" height=\"" + height + "\">" +
        "    <image x=\"0\" y=\"-10\" width=\"90\" height=\"80\" preserveAspectRatio=\"none\" xlink:href=\"" + get_asset_path("nodebg.png") + "\"/>" +
        "</svg>";
}

function create_node_service(service) {
    return "<p>" + service + "</p>"
}

function add_node_services(services) {
    if (!has_items(services)) {
        return "";
    }
    let servicesDisplay = ""
    services.forEach(serv => servicesDisplay += create_node_service(serv))
    return "<div class=\"flex-row text-xs font-bold \">" +
        servicesDisplay +
        "</div>"
}

function create_node(node) {
    return "<div class=\"flex-row max-w-100 py-2 my-0 space-y-0\">" +
        add_node_name(node.name) +
        add_node_image(node.resources) +
        create_resources(node.resources) +
        add_node_services(node.services) +
        "</div>"
}

function create_server_group_nodes(sgNodes) {
    let nodes = "";
    if (sgNodes)
        sgNodes.forEach(n => nodes += create_node(n));
    return "<div class=\"my-2 flex flex-wrap\">" + nodes + "</div>"
}

function create_server_group(sg, groupsVisible, position) {
    let cfg = defaultTheme.cluster.groups[position % defaultTheme.cluster.groups.length];
    // server group name
    if (sg && groupsVisible) {
        return "<div class=\"rounded-xl border-2 " + cfg.border + " border-dashed mb-1\">" +
            create_server_group_displayName(sg.name, groupsVisible, cfg.color) +
            create_server_group_nodes(sg.nodes) +
            "</div>";
    } else {
        return "<div class='-mt-8 -mb-4'>" +
            create_server_group_nodes(sg.nodes) +
            "</div>";
    }
}

function create_server_groups(serverGroups) {
    if (!has_items(serverGroups)) {
        return "";
    }

    let groupsVisible = serverGroups.length > 1;
    let serverGroupsDiv = "";
    let position = 0;
    serverGroups.forEach(sg => {
        serverGroupsDiv += create_server_group(sg, groupsVisible, position);
        position++;
    });
    // server groups
    return "<div class=\"px-4 mt-8 flex flex-wrap rounded-lg font-bold gap-x-4 gap-y-3 font-bold text-red-700 text-center align-center\">" +
        serverGroupsDiv +
        "</div>";

}

function create_cluster_version(version) {
    return version ? "<div class=\"flex flex-row-reverse -mt-1 \">" +
        "    <span class=\"bg-red-700 border-white border-4 rounded-xl text-xs text-white font-bold mx-2 px-2 mt-0 -mb-3 py-0\">v" + version + "</span>" +
        "</div>" : "";
}

function format_mb(mbytes, decimals) {
    return format_number(mbytes, 1024, ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], decimals)
}

function format_docs(docs, decimals) {
    return format_number(docs, 1000, ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'], decimals)
}

function format_number(size, base, sizes, decimals = 2) {
    if (size === 0)
        return '0 ' + sizes[0];

    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(size) / Math.log(base));

    return parseFloat((size / Math.pow(base, i)).toFixed(dm)) + ' ' + sizes[i];
}

function get_bucket_config(type) {
    return defaultTheme.cluster.buckets[type] ? defaultTheme.cluster.buckets[type] : defaultTheme.cluster.buckets.default;
}

function create_grid_header() {
    return "<div class=\"grid grid-cols-8 border-b-2 border-orange-400 text-xs text-gray-500 text-center font-bold p-1 mb-1 grid-nowrap\"> \n " +
        "   <div class='col-span-2'><p>Buckets</p></div> \n " +
        "   <div><p>Quota</p></div> \n " +
        "   <div><p>#docs</p></div> \n " +
        "   <div><p>%Resident</p></div> \n " +
        "   <div><p>Replicas</p></div> \n " +
        "   <div><p>Connectors</p></div> \n " +
        "   <div><p>TTL</p></div> \n " +
        "</div> \n ";
}

function create_collection(data, cfg = defaultTheme.cluster.buckets.default) {
    let ndocs = data && data.documents ? format_docs(data.documents, 2) : "--";
    let ttl = data.ttl ? "" + data.ttl : "";
    let connectors = data.connectors ? get_connectors(data.connectors) : "";
    return (data && data.name) ?
        "   <div class=\"grid col-start-1 col-span-2 grid-nowrap mb-1 content-center justify-self-stretch justify-items-start px-2 text-xs text-white font-bold " + cfg.collections.color + " rounded-xl shadow-400\">" +
        "      <div class=\"flex flex-row flex-nowrap justify-self-stretch items-center\">" +
        "        " + create_fontawesome_label("pl-1 " + cfg.collections.icon, data.name + "   ") +
        "      </div>\n" +
        "   </div>" +
        "   <div class=\"grid col-start-4 grid-nowrap content-center justify-items-center px-2 text-center text-xs text-gray-300 \">" +
        "       <p> " + ndocs + "</p>" +
        "   </div>" +
        "   <div class=\"grid col-start-7 grid-nowrap content-center justify-self-stretch justify-items-center px-2 text-center text-xs text-gray-400 font-bold\">" +
        connectors +
        "   </div>" +
        "   <div class=\"grid col-start-8 grid-nowrap content-center justify-self-stretch justify-items-center px-2 text-center text-xs text-gray-400 font-bold\">" +
        "       <p> " + ttl + "</p>" +
        "   </div>"
        : "";
}

function create_grid_scope_body(data, cfg = defaultTheme.cluster.buckets.default) {
    let collections = "";
    let ndocs = data.documents ? format_docs(data.documents, 2) : "--";
    let marginBottom = "mb-1";
    let total = "";
    let scopeIcon = cfg.scopes.iconFold;
    if (data.collections && data.collections.length > 0) {
        collections = "<div class=\"grid grid-cols-8 text-xs text-gray-200 text-center font-bold p-1 ml-1\">";
        data.collections.forEach(c => collections += create_collection(c, cfg));
        collections += "</div>";
        marginBottom = "";
        scopeIcon = cfg.scopes.iconExtend;
        // TODO add total collections per scope
        total = "<p class=\" px-1 bg-white rounded-full text-blue-400 \">" + data.collections.length + " </p>";
    }

    return "<div class='grid grid-cols-8 " + cfg.scopes.color + " rounded-md shadow-xs ml-1 " + marginBottom + "'>" +
        "   <div class=\"grid col-start-1 col-span-2 grid-nowrap content-center justify-self-stretch justify-items-start px-2 text-xs text-white font-bold \">" +
        "        " + create_fontawesome_label("pl-1 " + scopeIcon, data.name + "   ") +
        "   </div>" +
        "   <div class=\"grid col-start-4 grid-nowrap content-center justify-self-stretch justify-items-center px-2 text-center text-xs text-gray-400 font-bold\">" +
        "       <p> " + ndocs + "</p>" +
        "   </div>" +
        "</div>"
        + collections;
}

function create_grid_scope(data, cfg = defaultTheme.cluster.buckets.default) {
    return data ? create_grid_scope_body(data, cfg) : "";
}

function create_grid_scopes(data, cfg = defaultTheme.cluster.buckets.default) {
    let scopes = "";
    if (data && data.length > 0) {
        scopes = "<div class = \"grid grid-cols-8 \"> " +
            "   <div class='grid col-span-8'>";
        data.forEach(scope => scopes += create_grid_scope(scope, cfg) + "\n ")
        scopes += "    </div> " +
            "</div>";
    }
    return scopes;
}

function get_ratio_value(data) {
    let ratio = data.ratio ? data.ratio : 0;
    let statusLevelColor;
    switch (Math.round(ratio / 10)) {
        case 0:
        case 1:
        case 2:
            statusLevelColor = "bg-red-400";
            break;
        case 3:
            statusLevelColor = "bg-red-300";
            break;
        case 4:
            statusLevelColor = "bg-red-200";
            break;
        case 5:
            statusLevelColor = "bg-orange-400";
            break;
        case 6:
            statusLevelColor = "bg-orange-300";
            break;
        case 7:
            statusLevelColor = "bg-orange-200";
            break;
        case 8:
            statusLevelColor = "bg-green-200";
            break;
        case 9:
            statusLevelColor = "bg-green-300";
            break;
        case 10:
            statusLevelColor = "bg-green-400";
            break;
        default:
            statusLevelColor = " bg-green-400 ";
            break;
    }

    return (data.ratio ?
        "        <span class=\"px-2 py-1 text-xs font-bold " + statusLevelColor + " rounded-xl shadow-400\">" + data.ratio + " %</span>\n" :
        "        <div class=\"text-xs text-gray-900 font-bold text-center\">\n" +
        "          --\n" +
        "        </div>\n")
}

function create_svg_icon(src) {
    return " <svg width=\"14\" height=\"14\">\n" +
        "       <image width=\"14\" height=\"14\" preserveAspectRatio=\"none\" xlink:href=\"" + src + "\" />\n" +
        " </svg> ";
}

function create_fontawesome_label(iconClass, label, wrapperClass = "flex flex-row flex-nowrap items-center") {
    return "<span class=\"" + wrapperClass + "\">" +
        "<i class=\"" + iconClass + "\"></i>" +
        "<span class=\"px-2\">" + label + "</span>" +
        "</span>";
}

function create_connector_icon(data) {
    return create_svg_icon(get_asset_path("connector-" + data + ".svg"));
}

function get_connectors(data) {
    let connectors = "";
    if (data && data.length > 0) {
        connectors = "<div class='flex flex-row space-x-1'>";
        data.forEach(c => connectors += create_connector_icon(c));
        connectors += "</div>";
    }
    return connectors;
}

function create_grid_body_row(data) {
    let type = data.type ? data.type : "default";
    let cfg = get_bucket_config(type);
    let others = [data.type === "total" ? "bg-gray-800" : "bg-gray-400", data.type === "total" ? "bg-gray-800" : "bg-amber-400", "bg-orange-400", "bg-yellow-800"];
    let replicas = data.replicas ? data.replicas : "--";
    let total = "";
    let scopes = "";
    let ttl = data.ttl ? "" + data.ttl : "0";
    let connectors = get_connectors(data.connectors);

    if (data.scopes) {
        total = "<div class=\" px-2 bg-white rounded-full text-blue-400 \">" + data.scopes.length + " </div>";
        // Adding number of buckets =>  data.total ? "<span class=\"px-2 bg-white rounded-full text-blue-400\">"+data.total+" </span>": "");
        scopes = create_grid_scopes(data.scopes, cfg);
    }

    return "<div class=\"grid grid-cols-8 gap-0 text-xs text-gray-500 text-center font-bold pb-1 break-normal justify-items-center\"> \n " +
        "    <div class=\"col-span-2 grid grid-nowrap content-center justify-self-stretch justify-items-start px-2 text-xs text-white font-bold " + cfg.color + " rounded-xl shadow-400\">" +
        "      <div class=\"flex flex-row flex-nowrap justify-self-stretch items-center\">" +
        "        " + create_fontawesome_label(cfg.icon + " pl-1", data.name + "   ") + total +
        "      </div>\n" +
        "    </div>" +
        "    <div class=\"grid grid-nowrap text-xs text-gray-900 break-normal\">\n" +
        "        <span class=\"px-2 py-1 text-xs text-white font-bold " + others[0] + " rounded-xl shadow-400\">" + format_mb(data.quota) + "</span>\n" +
        "    </div>\n" +
        "    <div class=\"grid grid-nowrap text-xs text-gray-900\">\n" +
        "        <span class=\"px-2 py-1 text-xs text-white font-bold " + others[1] + " rounded-xl shadow-400\">" + format_docs(data.documents) + "</span>\n" +
        "    </div>\n" +
        "    <div class=\"grid grid-nowrap text-xs text-gray-900\">\n" +
        get_ratio_value(data) +
        "    </div>\n" +
        "    <div class=\"grid grid-nowrap  text-xs text-gray-900 font-bold\">\n" +
        replicas +
        "    </div>\n" +
        "    <div class=\"grid grid-nowrap  text-xs text-gray-900 font-bold text-center\">\n" +
        "         " + connectors + "\n" +
        "    </div>\n" +
        "    <div class=\"grid grid-nowrap text-xs text-gray-900 font-bold text-center\">\n" +
        "         " + ttl + "\n" +
        "    </div>\n" +
        "</div> \n "
        + scopes
        ;
}

function create_grid_body(data) {
    if (!has_items(data)) {
        return "";
    }
    let body = "";
    data.forEach(b => body += create_grid_body_row(b));
    return body;
}

function create_grid_summary(data) {
    let body = "";
    if (data && data.length > 1) {
        body = "<div class=\"border-t border-gray-200 bg-gray-100 \">"
        let bucket = data.reduce((b1, b2) => {
            return {
                name: "Total",
                quota: b1.quota + b2.quota,
                documents: b1.documents + b2.documents,
                type: "total",
                total: data.length
            }
        });
        body += create_grid_body_row(bucket);
        body += "</div>";
    }
    return body;
}

function create_buckets_grid_table(data) {
    return has_items(data) ?
        "<div class=\"grid grid-cols-1 shadow-sm m-4 \">" +
        create_grid_header() +
        create_grid_body(data) +
        create_grid_summary(data) +
        "</div>"
        : "";
}

function create_buckets(buckets) {
    return has_items(buckets) ?
        "     <div class=\"flex flex-col flex-nowrap\">\n " +
        create_buckets_grid_table(buckets) +
        "     </div> "
        : "";
}

function create_sgwGroup(sgwGroupInstances, visibleGroups, position) {
    let sgws = "";
    let cfg = defaultTheme.mobile.groups[position % defaultTheme.mobile.groups.length];
    let sgName = sgwGroupInstances.name;

    if (has_items(sgwGroupInstances.instances)) {
        sgwGroupInstances.instances.forEach(n => sgws += create_sgwInstance(n));
    }

    return visibleGroups ? "<div  class=\"my-2 border-2 " + cfg.border + "  border-dotted \">" +
        "          <div class=\"-my-2 flex-row align-center\">" +
        "             <span class=\"" + cfg.color + " z-5 rounded-xl text-xs text-white font-bold mx-4 px-4 my-0 py-0\">" + sgName + "</span>" +
        "          </div>" +
        "          <div class=\"flex flex-wrap \">" +
        sgws +
        //  create_resources(sgwGroupInstances.resources)+
        "          </div>" +
        "</div>" : "<div  class=\"-mt-4 mb-0 \">" +
        "          <div class=\"flex flex-wrap \">" +
        sgws +
        //  create_resources(sgwGroupInstances.resources)+
        "          </div>" +
        "</div>";
}

function create_svg(src, height = 50, width = 90) {
    return "                                    <svg y=\"10\" width=\"" + width + "\" height=\"" + height + "\">\n" +
        "                                        <image x=\"17\" y=\"-5\" width=\"55\" height=\"55\" preserveAspectRatio=\"none\" xlink:href=\"" + src + "\" />\n" +
        "                                    </svg>\n";
}

function create_instance(data, svg) {
    return "                          <div class=\"flex-row max-w-100 py-2 my-0\">\n" +
        "                                    <p class=\"flex-row text-xs text-gray-400 font-bold\">" + data.nodeIp + "</p>\n" +
        svg +
        create_resources(data.resources) +
        "                                    <div class=\"flex-row\">\n" +
        "                                        <p>" + data.name + "</p>\n" +
        "                                    </div>\n" +
        "                                </div>\n";
}

function create_sgwInstance(sgwData) {
    let height = sgwData.resources ? 35 : 50;
    return create_instance(sgwData, create_svg(get_asset_path("syncgateway.svg"), height));
}

function create_sgwGroups(data) {
    if (!data) {
        return "";
    }
    let versionBorder = data.version ? "border-b-2 " + defaultTheme.mobile.version.lineColor : "";
    let sgwGroups = "";
    let position = 0;
    const groups = has_items(data.groups) ? data.groups : [];
    const visibleGroups = groups.length > 1;
    groups.forEach(g => {
        sgwGroups += create_sgwGroup(g, visibleGroups, position);
        position++;
    });

    return "<div class=\"flow-column  \">" +
        "<div class=\"mx-8 mb-2 mt-8 flex flex-wrap font-bold lg:space-x-4 font-bold text-red-700 text-center align-center " + versionBorder + " \">" +
        sgwGroups +
        "</div>" +
        // create_resources(data.mobile.resources)+
        create_version(data.version) +
        "</div>";
}


function create_database_header() {
    return "                            <div class=\"cb-tr-mobile-databases-header border-b-2 border-orange-400 px-2 py-1 text-xs text-gray-500 font-bold\">\n" +
        "                                <span>Databases</span>\n" +
        "                            </div>\n";
}


function create_database_table_body_row(database) {
    const cfg = defaultTheme.mobile.databases;

    return "                            <div class=\"cb-tr-mobile-database-row whitespace-nowrap px-2 py-1 text-xs text-gray-500\">\n" +
        "                                <div class=\"cb-tr-mobile-database-pill flex flex-row flex-nowrap items-center px-6 py-1 text-xs text-white font-bold " + cfg.color + " rounded-xl shadow-400\">" + create_fontawesome_label(cfg.icon, database.name) + "</div>\n" +
        "                            </div>\n";
}

function create_database_table_body(databases) {
    if (!has_items(databases)) {
        return "                            <div class=\"cb-tr-mobile-databases-body bg-white\"></div>\n";
    }
    let body = "";
    databases.forEach(b => body += create_database_table_body_row(b));
    return "                            <div class=\"cb-tr-mobile-databases-body bg-white\">\n" +
        body +
        "                            </div>\n";
}

function create_mobile_databases(databases) {

    return has_items(databases) ? "  <div class=\"cb-tr-mobile-databases mt-4\" >\n" +
        "                    <div class=\"cb-tr-mobile-databases-card inline-block\">\n" +
        create_database_header() +
        create_database_table_body(databases) +
        "                    </div>\n" +
        "                </div>" : "";
}

function create_os_icon(os) {
    return create_svg_icon(get_asset_path("os-" + os + ".svg"));
}

function create_os_icons(data) {
    let output = "";
    if (data && data.length > 0) {
        let icons = "";
        data.forEach(i => icons += create_os_icon(i));
        output = "   <div class=\"flex flex-row space-x-1\">" +
            icons +
            "      </div>";
    }
    return output;
}

function create_mobile_client(data) {
    let showResources = data.languages || data.versions ? "" : "hidden";
    return "                          <div class=\"flex-column max-w-100 py-2 my-0 space-y-0\">\n" +
        "                                    <p class=\"text-xs text-gray-400 font-bold text-center\">" + (data.name ? data.name : "") + "</p>\n" +
        "                                    <div class=\"px-2 flex flex-row\">" +
        "                                            <div class=\"m-1 " + (data.total ? "" : "hidden") + "\"><span class=\"p-1 rounded-full bg-black text-white font-bold text-xs\">" + data.total + "x</span></div>" +
        "                                            <svg width=\"30\" height=\"40\">\n" +
        "                                                <image width=\"30\" height=\"40\" preserveAspectRatio=\"none\" xlink:href=\"" + get_asset_path("couchbaselite.svg") + "\" />\n" +
        "                                            </svg>\n" +
        create_os_icons(data.os) +
        "                                    </div>" +
        "                                    <div class=\"align-center -top-4 " + showResources + " \">\n" +
        "                                            <div class=\"-top-16 bg-red-600 z-10 rounded-lg text-xs text-white font-bold mx-2 px-2 my-0 py-0 text-center\">\n" +
        "                                                <p>lite " + data.language + ":" + data.versions + "</p>" +
        "                                            </div>\n" +
        "                                    </div>\n" +
        "                                </div>\n";
}

function create_mobile_clients(data) {
    let output = "";
    if (data && data.length > 0) {
        let clients = "";
        data.forEach(c => clients += create_mobile_client(c));
        output = "<div class=\"mx-2 mb-2 flex justify-center\">" +
            clients +
            "</div>";
    }
    return output;
}

function create_load_balancer(data) {
    const cfg = defaultTheme.mobile.network;
    const publicAddress = data && data.publicAddress ? data.publicAddress : "";

    return "<div class=\"cb-tr-mobile-network mx-2 flex-column\">" +
        "<div class=\"cb-tr-mobile-network-address text-xs " + cfg.urlColor + " text-right \"><span>" + publicAddress + "</span></div>" +
        "<div class=\"cb-tr-mobile-network-line z-10 border-b-2 border-black-400 border-dashed\"></div>" +
        "<div class=\"cb-tr-mobile-network-pill-wrap grid justify-items-center \">" +
        "   <div class=\"cb-tr-mobile-network-pill -my-3 mx-10 px-6 py-1 text-xs " + cfg.textColor + " font-bold " + cfg.color + " rounded-xl shadow-400\">" + create_fontawesome_label(cfg.icon, cfg.displayText) + "</div>\n" +
        "</div>" +
        "</div>";
}

function create_version(version) {
    return version ? "<div class=\"flex flex-row-reverse \">" +
        "    <span class=\"" + defaultTheme.mobile.version.color + " border-white border-4 rounded-xl text-xs text-white font-bold mx-2 px-2 mb-0 -mt-4 py-0\">v" + version + "</span>" +
        "</div>" : "";
}

function create_mobile(data) {
    return has_mobile_topology(data) ? "<div class=\"flex-column mb-2 -pb-2\">" +
        create_mobile_clients(data.clients) +
        create_load_balancer(data) +
        "<div class=\"mx-2 -my-2 flex flex-row font-bold font-bold text-red-700 text-center text-xs \">" +
        create_sgwGroups(data) +
        create_mobile_databases(data.databases) +
        "</div>" +
        "</div>" : "";
}

function create_apps(data) {
    return data ? "<div class=\"flex flex-row justify-content-center align-center\">" +
        "</div>" : "";
}

function create_server_topology(data) {
    return has_server_topology(data) ? "   <div class=\"m-4 inline-block flex-row border-4 rounded-xl border-red-700 font-bold font-bold text-red-700 text-center shadow-xl align-left\">" +
        add_cluster_name(data.name) +
        create_server_groups(data.serverGroups) +
        create_resources(data.resources) +
        create_cluster_version(data.version) +
        "      </div>" : "";
}

function render_cluster_html(data, options) {
    const topology = data || {};
    return with_render_options(options, () => prefix_html_class_attributes("<div class=\"" + renderRootClass + "\">" +
        "<div class=\"flex flex-col justify-content-center\">" +
        "<div class=\"flex flex-row justify-content-center items-center \">" +
        create_mobile(topology.mobile) +
        create_apps(topology.applications) +
        "</div>" +
        "<div class=\"flex flex-row auto-rows-auto\">" +
        "  <div class=\"flex-col align-center shrink-0 \">" +
        create_server_topology(topology) +
        "  </div>" +
        "  <div class=\"flex flex-col flex-nowrap  shrink-0 \">" +
        "   <div class=\"flex flex-row flex-nowrap  \">" +
        create_buckets(topology.buckets) +
        "      </div>" +
        "  </div>" +
        "</div>" +
        "</div>" +
        "</div>"));
}

function create_cluster(content, data, options) {
    content.innerHTML = render_cluster_html(data, options);
    return content;
}

const topologyUi = {
    create_cluster,
    createCluster: create_cluster,
    defaultTheme,
    get_asset_root,
    getAssetRoot: get_asset_root,
    renderRootClass,
    render_cluster_html,
    renderClusterHtml: render_cluster_html,
    set_asset_root,
    setAssetRoot: set_asset_root
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = topologyUi;
}

if (typeof window !== "undefined") {
    window.couchbaseTopologyUi = topologyUi;
    window.create_cluster = create_cluster;
    window.render_cluster_html = render_cluster_html;
}

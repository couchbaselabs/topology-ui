const defaultSyncGatewayGroupColors = ["border-blue-400 ", "border-green-500 ", "border-yellow-500 "]
const defaultSyncGatewayGroupDisplayColors = ["bg-blue-400 ", "bg-green-500 ", "bg-yellow-500 "]
const defaultServerGroupColors = ["border-blue-400 bg-blue-50", "border-green-500 bg-green-50", "border-yellow-500 bg-yellow-50"]
const defaultServerGroupDisplayColor = ["bg-blue-400", "bg-green-500", "bg-yellow-500"]

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

function add_node_image(resources) {
    let height = 60;
    let hidden = "hidden";
    let memory = 1;
    let cpus = 0.5;
    if (resources) {
        height = 50
        hidden = ""
        memory = resources.memory
        cpus = resources.cpus
    }

    return "<svg id=\"svg-node1\" y=\"10\" width=\"90\" height=\"" + height + "\">" +
        "    <image x=\"0\" y=\"-10\" width=\"90\" height=\"80\" preserveAspectRatio=\"none\" xlink:href=\"images/nodebg.png\"/>" +
        "        <div class=\"align-center top-0 " + hidden + "\">" +
        "             <div class=\"-top-16 bg-gray-700 z-10 rounded-lg text-xs text-white font-bold mx-2 px-2 my-0 py-0\">" +
        "               <p>" + memory + " GB</p>" +
        "               <p> " + cpus + " CPUs</p>" +
        "             </div>" +
        "         </div>" +
        "</svg>"
}

function create_node_service(service) {
    return "<p>" + service + "</p>"
}

function add_node_services(services) {
    let servicesDisplay = ""
    services.forEach(serv => servicesDisplay += create_node_service(serv))
    return "<div class=\"flex-row text-xs font-bold \">" +
        servicesDisplay +
        "</div>"
}

function create_node(node) {
    return "<div class=\"isolate-auto static flex-row max-w-100 py-2 my-0 space-y-0\">" +
        add_node_name(node.name) +
        add_node_image(node.resources) +
        add_node_services(node.services) +
        "</div>"
}

function create_server_group_nodes(sgNodes) {
    let nodes = "";
    if(sgNodes)
        sgNodes.forEach(n => nodes += create_node(n));
    return "<div class=\"my-2 flex flex-wrap\">" + nodes + "</div>"
}

function create_server_group(sg, groupsVisible, position) {
    let color = defaultServerGroupColors[position % defaultServerGroupColors.length]
    let colorDisplay = defaultServerGroupDisplayColor[position % defaultServerGroupDisplayColor.length]
    // server group name
    if (sg && groupsVisible) {
        return "<div class=\"rounded-xl border-2 " + color + " border-dashed\">" +
            create_server_group_displayName(sg.name, groupsVisible, colorDisplay) +
            create_server_group_nodes(sg.nodes) +
            "</div>";
    } else {
        return "<div class='-mt-8 -mb-4'>" +
            create_server_group_nodes(sg.nodes) +
            "</div>";
    }
}

function create_server_groups(serverGroups) {

    let groupsVisible = serverGroups.length > 1;
    let serverGroupsDiv = "";
    let position = 0;
    serverGroups.forEach(sg => {
        serverGroupsDiv += create_server_group(sg, groupsVisible, position);
        position++;
    });
    // server groups
    return "<div class=\"m-8 flex flex-wrap rounded-lg font-bold lg:space-x-4 font-bold text-red-700 text-center align-center\">" +
        serverGroupsDiv +
        "</div>";

}

function create_cluster_version(version) {
    return "<div class=\"flex flex-row-reverse -my-3\">" +
        "    <span class=\"bg-red-700 border-white border-4 rounded-xl text-xs text-white font-bold mx-2 px-2 my-0 py-0\">v" + version + "</span>" +
        "</div>";
}

function create_server_resources(resources) {
    //todo
    let hidden = "hidden";
    let cpus = 0.5;
    let memory = 1;
    if (resources) {
        hidden = ""
        if (resources.cpus)
            cpus = resources.cpus
        if (resources.memory)
            memory = resources.memory
    }
    return " <div class=\"-my-6 align-center " + hidden + "\">" +
        "             <div class=\"bg-gray-700 z-50 rounded-lg text-xs text-white font-bold mx-2 px-2 py-0 my-4 \">" +
        "               <p>" + memory + " GB</p>" +
        "               <p> " + cpus + " CPUs</p>" +
        "             </div>" +
        "         </div>"
}

function create_bucket_header_table() {
    return "                                    <thead class=\"border-b-2 border-yellow-400\">\n" +
        "                                    <tr>\n" +
        "                                        <th class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            Buckets\n" +
        "                                        </th>\n" +
        "                                        <th class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            Quota\n" +
        "                                        </th>\n" +
        "                                        <th class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            #docs\n" +
        "                                        </th>\n" +
        "                                        <th class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            %Resident\n" +
        "                                        </th>\n" +
        "                                        <th class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            Replicas\n" +
        "                                        </th>\n" +
        "                                        <th class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            Connectors\n" +
        "                                        </th>\n" +
        "                                        <th class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            TTL\n" +
        "                                        </th>\n" +
        "                                    </tr>\n" +
        "                                    </thead>\n";
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

function create_buckets_table_body_row(bucket) {
    let cfg = {};
    switch (bucket.type) {
        case 'couchbase':
            cfg = {
                icon: "fas fa-database",
                colors: ["bg-blue-400", "bg-gray-400", "bg-yellow-300", "bg-yellow-500", "bg-yellow-800"]
            };
            break;
        case 'ephemeral':
            cfg = {
                icon: "fas fa-database",
                colors: ["bg-yellow-500", "bg-gray-400", "bg-yellow-300", "bg-yellow-500", "bg-yellow-800"]
            };
            break;
        case 'magma':
            cfg = {
                icon: "fas fa-database",
                colors: ["bg-green-500", "bg-gray-400", "bg-yellow-300", "bg-yellow-500", "bg-yellow-800"]
            };
            break;
        case 'total':
            cfg = {
                icon: "fas fa-plus-square",
                colors: ["bg-gray-800", "bg-gray-800", "bg-gray-800", "bg-gray-800", "bg-gray-800"]
            };
            break;
        default:
            cfg = {
                icon: "fas fa-database",
                colors: ["bg-blue-400", "bg-gray-400", "bg-yellow-300", "bg-yellow-500", "bg-yellow-800"]
            };
            break;
    }

    return "                                    <tr class=\"whitespace-nowrap\">\n" +
        "                                        <td class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            <div class=\"flex flex-row px-6 py-1 text-xs text-white font-bold " + cfg.colors[0] + " rounded-xl shadow-400 w-full\"><i class=\"" + cfg.icon + "\"><span class='px-2'>" + bucket.name + "</span></i></div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2\">\n" +
        "                                            <div class=\"text-xs text-gray-900\">\n" +
        "                                                <span class=\"px-2 py-1 text-xs text-white font-bold " + cfg.colors[1] + " rounded-xl shadow-400\">" + format_mb(bucket.quota) + "</span>\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2\">\n" +
        "                                            <div class=\"text-xs text-gray-900\">\n" +
        "                                                <span class=\"px-2 py-1 text-xs text-white font-bold " + cfg.colors[2] + " rounded-xl shadow-400\">" + format_docs(bucket.documents) + "</span>\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            <div class=\"text-xs text-gray-900\">\n" + (bucket.ratio ?
            "                                                <span class=\"px-2 py-1 text-xs text-white font-bold " + cfg.colors[3] + " rounded-xl shadow-400\">" + bucket.ratio + " %</span>\n" :
            "                                            <div class=\"text-xs text-gray-900 font-bold\">\n" +
            "                                                --\n" +
            "                                            </div>\n") +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            <div class=\"text-xs text-gray-900\">\n" + (bucket.replicas ?
            "                                                <span class=\"px-2 py-1 text-xs text-white font-bold " + cfg.colors[4] + " rounded-xl shadow-400\">" + bucket.replicas + "</span>\n" :
            "                                            <div class=\"text-xs text-gray-900 font-bold\">\n" +
            "                                                --\n" +
            "                                            </div>\n") +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2\">\n" +
        "                                            <div class=\"text-xs text-gray-900 font-bold\">\n" +
        "                                                --\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2\">\n" +
        "                                            <div class=\"text-xs text-gray-900 font-bold\">\n" +
        "                                                --\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                    </tr>\n";
}

function create_buckets_table_body(buckets) {
    let body = "";
    buckets.forEach(b => body += create_buckets_table_body_row(b));
    return "                                    <tbody class=\"bg-white\">\n" +
        body +

        "                                    </tbody>\n";
}

function create_buckets_table_total(buckets) {
    var body = "<thead class=\"border-t border-gray-200\">"
    let bucket = buckets.reduce((b1, b2) => {
        return {
            name: "Total",
            quota: b1.quota + b2.quota,
            documents: b1.documents + b2.documents,
            type: "total"
        }
    });
    body += create_buckets_table_body_row(bucket);
    body += "</thead>"
    return body;
}

function create_buckets(buckets) {
    return buckets ? "  <div id=\"buckets\" class=\"mt-1\" >\n" +
        "                    <div class=\"flex flex-col\">\n" +
        "                        <div class=\"w-full\">\n" +
        "                            <div>\n" +
        "                                <table>\n" +
        create_bucket_header_table() +
        create_buckets_table_body(buckets) +
        create_buckets_table_total(buckets) +
        "                                </table>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>": "";
}

function create_sgwGroup(sgwGroupInstances, visibleGroups, position) {
    let sgws = "";
    let color = defaultSyncGatewayGroupColors[position % defaultSyncGatewayGroupColors.length];
    let displayColor = defaultSyncGatewayGroupDisplayColors[position % defaultSyncGatewayGroupDisplayColors.length];
    let sgName = sgwGroupInstances.name;

    sgwGroupInstances.instances.forEach(n => sgws += create_sgwInstance(n));

    return visibleGroups ? "<div  class=\"my-2 border-2 " + color + "  border-dotted \">" +
        "          <div class=\"-my-2 flex-row align-center\">" +
        "             <span class=\"" + displayColor + " z-5 rounded-xl text-xs text-white font-bold mx-4 px-4 my-0 py-0\">" + sgName + "</span>" +
        "          </div>" +
        "          <div class=\"flex flex-wrap \">" +
        sgws +
        //  create_server_resources(sgwGroupInstances.resources)+
        "          </div>" +
        "</div>" :  "<div  class=\"-mt-4 mb-0 \">" +
        "          <div class=\"flex flex-wrap \">" +
        sgws +
        //  create_server_resources(sgwGroupInstances.resources)+
        "          </div>" +
        "</div>";
}

function create_sgwInstance(sgwData) {
    let showResources = "hidden";
    var cpus = 0.5
    var memory = 1
    let height = 50;
    if (sgwData.resources) {
        showResources ="";
        height = 35;
        if (sgwData.resources.cpus)
            cpus = sgwData.resources.cpus
        if (sgwData.resources.memory)
            memory = sgwData.resources.memory
    }

    return "                          <div class=\"flex-row max-w-100 py-2 my-0\">\n" +
        "                                    <p class=\"flex-row text-xs text-gray-400 font-bold\">" + sgwData.nodeIp + "</p>\n" +
        "                                    <svg y=\"10\" width=\"90\" height=\""+height+"\">\n" +
        "                                        <image x=\"17\" y=\"-5\" width=\"55\" height=\"55\" preserveAspectRatio=\"none\" xlink:href=\"images/syncgateway.svg\" />\n" +
        "                                    </svg>\n" +
        "                                        <div class=\"align-center " + showResources + " \">\n" +
        "                                            <div class=\" bg-gray-700 rounded-lg text-xs text-white font-bold mx-2 px-2 \">\n" +
        "                                                <p>" + memory + " GB</p>" +
        "                                                <p> " + cpus + " CPUs</p>" +
        "                                            </div>\n" +
        "                                        </div>\n" +
        "                                    <div class=\"flex-row\">\n" +
        "                                        <p>" + sgwData.name + "</p>\n" +
        "                                    </div>\n" +
        "                                </div>\n";
}

function create_sgwGroups(data) {
    let sgwGroups = "";
    let position = 0;
    const visibleGroups = data.groups.length > 1;
    data.groups.forEach(g => {
        sgwGroups += create_sgwGroup(g, visibleGroups, position);
        position++;
    });

    return "<div class=\"mx-8 mb-2 mt-8 flex flex-wrap rounded-lg font-bold lg:space-x-4 font-bold text-red-700 text-center align-center\">" +
        sgwGroups +
        // create_server_resources(data.mobile.resources)+
        "</div>";
}


function create_database_header_table() {
    return "                               <thead class=\"border-b-2 border-yellow-400\">\n" +
        "                                    <tr>\n" +
        "                                        <th class=\"px-2 py-1 text-xs text-gray-500\">\n" +
        "                                            Databases\n" +
        "                                        </th>\n" +
        "                                    </tr>\n" +
        "                                    </thead>\n";
}


function create_database_table_body_row(database) {
    const cfg = {
        icon: "fas fa-signal",
        color: "bg-yellow-500"
    };

    return "                                    <tr class=\"whitespace-nowrap \">\n" +
        "                                        <td class=\"px-2 py-1 text-xs text-gray-500\">\n" +
        "                                            <div class=\"flex flex-row px-6 py-1 text-xs text-white font-bold " + cfg.color + " rounded-xl shadow-400 w-full\"><i class=\"" + cfg.icon + "\"><span class='px-2'>" + database.name + "</span></i></div>\n" +
        "                                        </td>\n" +
        "                                    </tr>\n";
}

function create_database_table_body(databases) {
    let body = "";
    databases.forEach(b => body += create_database_table_body_row(b));
    return "                                    <tbody class=\"bg-white\">\n" +
        body +

        "                                    </tbody>\n";
}

function create_mobile_databases(databases) {

    return databases ? "  <div class=\"mt-4\" >\n" +
        "                    <div class=\"flex flex-col\">\n" +
        "                        <div class=\"w-full\">\n" +
        "                            <div>\n" +
        "                                <table>\n" +
        create_database_header_table() +
        create_database_table_body(databases) +
        "                                </table>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>" : "";
}

function create_os_icon(os) {
    console.log("os:",os);
    return  " <svg width=\"14\" height=\"14\">\n" +
        "       <image width=\"14\" height=\"14\" preserveAspectRatio=\"none\" xlink:href=\"images/os-"+os+".svg\" />\n" +
        " </svg> ";
}

function create_os_icons(data) {
    let output = "";
    if(data && data.length > 0) {
        let icons = "";
        data.forEach(i => icons += create_os_icon(i));
        output = "   <div class=\"flex flex-row space-x-1\">"+
           icons +
            "      </div>";
    }
    console.log('salida: ',output);
    return output;
}

function create_mobile_client(data) {
    let showResources = data.languages || data.versions ? "": "hidden";
    return "                          <div class=\"flex-column max-w-100 py-2 my-0 space-y-0\">\n" +
        "                                    <p class=\"text-xs text-gray-400 font-bold text-center\">"+(data.name?data.name:"")+"</p>\n" +
        "                                    <div class=\"px-2 flex flex-row\">"+
        "                                            <div class=\"m-1 "+(data.total?"":"hidden")+"\"><span class=\"p-1 rounded-full bg-black text-white font-bold text-xs\">"+data.total+"x</span></div>" +
        "                                            <svg width=\"30\" height=\"40\">\n" +
        "                                                <image width=\"30\" height=\"40\" preserveAspectRatio=\"none\" xlink:href=\"images/couchbaselite.svg\" />\n" +
        "                                            </svg>\n" +
        create_os_icons(data.os) +
        "                                    </div>"+
        "                                    <div class=\"align-center -top-4 " + showResources + " \">\n" +
        "                                            <div class=\"-top-16 bg-red-600 z-10 rounded-lg text-xs text-white font-bold mx-2 px-2 my-0 py-0 text-center\">\n" +
        "                                                <p>lite " + data.language + ":"+data.versions+"</p>" +
        "                                            </div>\n" +
        "                                    </div>\n" +
        "                                </div>\n";
}

function create_mobile_clients(data){
    let output = "";
    if (data && data.length > 0 ) {
        let clients = "";
        data.forEach(c => clients += create_mobile_client(c));
        output = "<div class=\"mx-2 mb-2 flex justify-center\">" +
            clients+
        "</div>";
    }
    return output;
}

function create_load_balancer(data) {
    const cfg = {
        icon: "fas fa-network-wired",
        color: "bg-blue-500"
    };

    return "<div class=\"mx-2 flex-column\">" +
        "<div class=\"text-xs text-yellow-600 text-right\"><p>"+data.publicAddress+"</p></div>"+
        "<div class=\"z-10 border-b-2 border-black-400 border-dashed\"></div>"+
        "<div class=\"grid justify-items-center \">"+
        "   <div class=\"-my-3 mx-10 px-6 py-1 text-xs text-white font-bold " + cfg.color + " rounded-xl shadow-400\"><i class=\"" + cfg.icon + "\"><span class='px-2'>Load Balancer</span></i></div>\n"+
        "</div>"+
    "</div>";
}

function create_mobile(data) {
    return data ? "<div class=\"flex-column\">" +
        create_mobile_clients(data.clients)+
        create_load_balancer(data)+
          "<div class=\"mx-2 flex flex-row font-bold font-bold text-red-700 text-center text-xs\">" +
              create_sgwGroups(data) +
              create_mobile_databases(data.databases) +
          "</div>" +
        "</div>" : "";
}

function create_apps(data) {
    return data? "<div class=\"flex flex-row justify-content-center align-center\">" +
        "</div>": "";
}

function create_cluster(content, data) {
    content.innerHTML = "<div class=\"flex flex-col justify-content-center\">" +
        "<div class=\"flex flex-row justify-content-center items-center\">" +
        create_mobile(data.mobile) +
        create_apps(data.applications) +
        "</div>" +
        "<div class=\"flex flex-row\">" +
        "<div id=\"cluster-info\" class=\"mx-4 mb-4 flex-row border-4 rounded-xl border-red-700 font-bold font-bold text-red-700 text-center shadow-xl align-left\">" +
        add_cluster_name(data.name) +
        create_server_groups(data.serverGroups) +
        create_server_resources(data.resources) +
        create_cluster_version(data.version) +
        "</div>" +
        create_buckets(data.buckets) +
        "</div>" +
        "</div>";
}

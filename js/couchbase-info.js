const defaultTheme = {
    mobile: {
        groups: [{ border: "border-blue-400", color: "bg-blue-400"},
            { border: "border-green-500", color: "bg-green-500"},
            { border: "border-yellow-500", color: "bg-yellow-500"}],
        databases: { icon: "fas fa-signal", color: "bg-orange-400"},
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
        groups: [ { border: "border-blue-400 bg-blue-50", color: "bg-blue-400"},
            { border: "border-green-500 bg-green-50", color: "bg-green-500"},
            { border: "border-yellow-500 bg-yellow-50", color: "bg-yellow-500"}] ,
        buckets: {
            ephemeral: {color: "bg-orange-400", icon: "fas fa-database"},
            couchbase: {color: "bg-blue-400", icon: "fas fa-database"},
            magma: {color: "bg-green-500", icon: "fas fa-database"},
            total: {color: "bg-gray-800", icon: "fas fa-plus-square"},
            default: {color: "bg-blue-400", icon: "fas fa-database"}
        },
        scope: { color: "bg-gray-300", textColor: "text-white", iconFold: "fas fa-book-medical", iconExtend:"fas fa-minus" },
        collections: { color: "bg-blue-200", textColor: "text-white", icon: "fas fa-ellipsis-v"},
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
    let cfg = defaultTheme.resources.color+" "+defaultTheme.resources.textColor;
    if (resources) {
        memory = resources.memory
        cpus = resources.cpus
        hidden = "";
    }
    return "                                        <div class=\"align-center " + hidden + " \">\n" +
           "                                            <div class=\" "+cfg+" rounded-lg text-xs font-bold mx-2 px-2 \">\n" +
           "                                                <p>" + memory + " GB</p>" +
           "                                                <p> " + cpus + " CPUs</p>" +
           "                                            </div>\n" +
           "                                        </div>\n" ;
   /* return " <div class=\"-my-6 align-center " + hidden + "\">" +
        "             <div class=\"bg-gray-700 z-50 rounded-lg text-xs text-white font-bold mx-2 px-2 py-0 my-4 \">" +
        "               <p>" + memory + " GB</p>" +
        "               <p> " + cpus + " CPUs</p>" +
        "             </div>" +
        "         </div>"*/
}

function add_node_image(resources) {
    let height = resources? 50 : 60;
    return "<svg id=\"svg-node1\" y=\"10\" width=\"90\" height=\"" + height + "\">" +
        "    <image x=\"0\" y=\"-10\" width=\"90\" height=\"80\" preserveAspectRatio=\"none\" xlink:href=\"images/nodebg.png\"/>" +
        "</svg>";
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
    return "<div class=\"flex-row max-w-100 py-2 my-0 space-y-0\">" +
        add_node_name(node.name) +
        add_node_image(node.resources) +
        create_resources(node.resources)+
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

    let groupsVisible = serverGroups.length > 1;
    let serverGroupsDiv = "";
    let position = 0;
    serverGroups.forEach(sg => {
        serverGroupsDiv += create_server_group(sg, groupsVisible, position);
        position++;
    });
    // server groups
    return "<div class=\"mx-8 mt-8 flex flex-wrap rounded-lg font-bold lg:space-x-4 font-bold text-red-700 text-center align-center\">" +
        serverGroupsDiv +
        "</div>";

}

function create_cluster_version(version) {
    return version ?  "<div class=\"flex flex-row-reverse -mt-1 \">" +
        "    <span class=\"bg-red-700 border-white border-4 rounded-xl text-xs text-white font-bold mx-2 px-2 mt-0 -mb-3 py-0\">v" + version + "</span>" +
        "</div>": "";
}

function create_bucket_header_table() {
    return "                                    <thead class=\"border-b-2 border-orange-400\">\n" +
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

function get_bucket_config(type) {
    return defaultTheme.cluster.buckets[type]? defaultTheme.cluster.buckets[type] : defaultTheme.cluster.buckets.default;
}

function create_buckets_table_body_row(bucket) {
    let type = bucket.type ? bucket.type : "default";
    let cfg = get_bucket_config(type);
    let others = [bucket.type==="total"?"bg-gray-800":"bg-gray-400", bucket.type==="total"?"bg-gray-800":"bg-amber-400", "bg-orange-400", "bg-yellow-800"];
    console.log("bucket config: ",type,JSON.stringify(cfg));
    let replicas = bucket.replicas ? bucket.replicas : "--";

    return "                                    <tr class=\"whitespace-nowrap\">\n" +
        "                                        <td class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            <div class=\"flex flex-row px-6 py-1 text-xs text-white font-bold " + cfg.color + " rounded-xl shadow-400 w-full\"><i class=\"" + cfg.icon + "\"><span class='px-2'>" + bucket.name + "</span></i></div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2\">\n" +
        "                                            <div class=\"text-xs text-gray-900\">\n" +
        "                                                <span class=\"px-2 py-1 text-xs text-white font-bold " + others[0] + " rounded-xl shadow-400\">" + format_mb(bucket.quota) + "</span>\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2\">\n" +
        "                                            <div class=\"text-xs text-gray-900\">\n" +
        "                                                <span class=\"px-2 py-1 text-xs text-white font-bold " + others[1] + " rounded-xl shadow-400\">" + format_docs(bucket.documents) + "</span>\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            <div class=\"text-xs text-gray-900\">\n" + (bucket.ratio ?
            "                                                <span class=\"px-2 py-1 text-xs text-white font-bold " + others[2] + " rounded-xl shadow-400\">" + bucket.ratio + " %</span>\n" :
            "                                            <div class=\"text-xs text-gray-900 font-bold text-center\">\n" +
            "                                                --\n" +
            "                                            </div>\n") +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2 text-xs text-gray-500 text-center\">\n" +
        "                                            <div class=\"text-xs text-gray-900\">\n" +
            "                                            <div class=\"text-xs text-gray-900 font-bold\">\n" +
                                                            replicas +
            "                                            </div>\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2\">\n" +
        "                                            <div class=\"text-xs text-gray-900 font-bold text-center\">\n" +
        "                                                --\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                        <td class=\"px-2 py-2\">\n" +
        "                                            <div class=\"text-xs text-gray-900 font-bold text-center\">\n" +
        "                                                --\n" +
        "                                            </div>\n" +
        "                                        </td>\n" +
        "                                    </tr>\n"+



        "                                    <tr class=\"whitespace-nowrap\">\n" +
        "                                        <td class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            <div class=\"mx-4 flex flex-row px-6 py-1 text-xs text-white font-bold " + defaultTheme.cluster.scope.color + " rounded-xl shadow-400 w-100\"><i class=\"" + defaultTheme.cluster.scope.iconFold + "\"><span class='px-2'>scope1</span></i></div>\n" +
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

function create_grid_header(data) {
    return "<div class=\"grid grid-cols-7 border-b-2 border-orange-400 text-xs text-gray-500 text-center font-bold p-2\"> \n " +
            "   <div><p>Buckets</p></div> \n " +
            "   <div><p>Quota</p></div> \n " +
            "   <div><p>#docs</p></div> \n " +
            "   <div><p>%Resident</p></div> \n " +
            "   <div><p>Replicas</p></div> \n " +
            "   <div><p>Connectors</p></div> \n " +
            "   <div><p>TTL</p></div> \n " +
            "</div> \n ";
}

function create_grid_scope(data) {
    return data?
        "<div>" +
        create_grid_scope_header(data)+
        create_grid_scope_body(data)+
        "</div>"
        :"";
}

function create_grid_body_row(data) {
    let type = data.type ? data.type : "default";
    let cfg = get_bucket_config(type);
    let others = [data.type==="total"?"bg-gray-800":"bg-gray-400", data.type==="total"?"bg-gray-800":"bg-amber-400", "bg-orange-400", "bg-yellow-800"];
    console.log("bucket config: ",type,JSON.stringify(cfg));
    let replicas = data.replicas ? data.replicas : "--";
    let total = (data.scopes ? "<span class=\"px-2 bg-white rounded-full text-blue-400\">"+data.scopes.length+" </span>" :
               "");
               // Adding number of buckets =>  data.total ? "<span class=\"px-2 bg-white rounded-full text-blue-400\">"+data.total+" </span>": "");

    return  "<div class=\"grid grid-cols-7 text-xs text-gray-500 text-center font-bold p-2\"> \n " +
        "    <div class=\"flex flex-row px-6 py-1 text-xs text-white font-bold " + cfg.color + " rounded-xl shadow-400 w-full\">" +
        "        <i class=\"" + cfg.icon + "\"><span class=\"px-2\">" + data.name + "   </span>" + total + "</i>" +
        "    </div>\n" +
        "    <div class=\"text-xs text-gray-900\">\n" +
        "        <span class=\"px-2 py-1 text-xs text-white font-bold " + others[0] + " rounded-xl shadow-400\">" + format_mb(data.quota) + "</span>\n" +
        "    </div>\n" +
        "    <div class=\"text-xs text-gray-900\">\n" +
        "        <span class=\"px-2 py-1 text-xs text-white font-bold " + others[1] + " rounded-xl shadow-400\">" + format_docs(data.documents) + "</span>\n" +
        "    </div>\n" +
        "    <div class=\"text-xs text-gray-900\">\n" + (data.ratio ?
        "        <span class=\"px-2 py-1 text-xs text-white font-bold " + others[2] + " rounded-xl shadow-400\">" + data.ratio + " %</span>\n" :
        "        <div class=\"text-xs text-gray-900 font-bold text-center\">\n" +
        "          --\n" +
        "        </div>\n") +
        "    </div>\n" +
        "    <div class=\"text-xs text-gray-900 font-bold\">\n" +
        replicas +
        "    </div>\n" +
        "    <div class=\"text-xs text-gray-900 font-bold text-center\">\n" +
        "         --\n" +
        "    </div>\n" +
        "    <div class=\"text-xs text-gray-900 font-bold text-center\">\n" +
        "         --\n" +
        "    </div>\n" +
        "</div> \n "//+
      //  create_grid_scopes(data.scopes)
        ;

    /*
        "                                    <tr class=\"whitespace-nowrap\">\n" +
        "                                        <td class=\"px-2 py-2 text-xs text-gray-500\">\n" +
        "                                            <div class=\"mx-4 flex flex-row px-6 py-1 text-xs text-white font-bold " + defaultTheme.cluster.scope.color + " rounded-xl shadow-400 w-100\"><i class=\"" + defaultTheme.cluster.scope.iconFold + "\"><span class='px-2'>scope1</span></i></div>\n" +
        "                                        </td>\n" +
        "                                    </tr>\n";

     */
}

function create_grid_body(data) {
    let body ="";
    data.forEach( b => body += create_grid_body_row(b));
    return body;
}

function create_grid_summary(data) {
    let body = "";
    if (data && data.length > 1) {
        body = "<div class=\"border-t border-gray-200 bg-gray-100\">"
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
    return data?
        "<div class=\"grid grid-cols-1\">" +
        create_grid_header(data)+
        create_grid_body(data)+
        create_grid_summary(data)+
        "</div>"
        :"";
}

function create_buckets(buckets) {

    return buckets ?
        "<div class=\"mt-1 flex flex-row \" >\n " +
        "     <div class=\"flex flex-col\">\n " +
       // "       <div class=\"w-full\">\n " +
        create_buckets_grid_table(buckets)+
    //    "       </div>    " +
        "     </div> "+
        "</div> "
     /*   "  <div class=\"mt-1\" >\n" +
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
        "                </div>"*/

        : "";
    /*
    return buckets ? "  <div class=\"mt-1\" >\n" +
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
     */
}

function create_sgwGroup(sgwGroupInstances, visibleGroups, position) {
    let sgws = "";
    let cfg = defaultTheme.mobile.groups[position % defaultTheme.mobile.groups.length];
    let sgName = sgwGroupInstances.name;

    sgwGroupInstances.instances.forEach(n => sgws += create_sgwInstance(n));

    return visibleGroups ? "<div  class=\"my-2 border-2 " + cfg.border + "  border-dotted \">" +
        "          <div class=\"-my-2 flex-row align-center\">" +
        "             <span class=\"" + cfg.color + " z-5 rounded-xl text-xs text-white font-bold mx-4 px-4 my-0 py-0\">" + sgName + "</span>" +
        "          </div>" +
        "          <div class=\"flex flex-wrap \">" +
        sgws +
        //  create_resources(sgwGroupInstances.resources)+
        "          </div>" +
        "</div>" :  "<div  class=\"-mt-4 mb-0 \">" +
        "          <div class=\"flex flex-wrap \">" +
        sgws +
        //  create_resources(sgwGroupInstances.resources)+
        "          </div>" +
        "</div>";
}

function create_svg(src, height=50, width=90) {
   return "                                    <svg y=\"10\" width=\""+width+"\" height=\""+height+"\">\n" +
          "                                        <image x=\"17\" y=\"-5\" width=\"55\" height=\"55\" preserveAspectRatio=\"none\" xlink:href=\""+src+"\" />\n" +
          "                                    </svg>\n";
}

function create_instance(data,svg) {
    return "                          <div class=\"flex-row max-w-100 py-2 my-0\">\n" +
        "                                    <p class=\"flex-row text-xs text-gray-400 font-bold\">" + data.nodeIp + "</p>\n" +
        svg+
        create_resources(data.resources)+
        "                                    <div class=\"flex-row\">\n" +
        "                                        <p>" + data.name + "</p>\n" +
        "                                    </div>\n" +
        "                                </div>\n";
}

function create_sgwInstance(sgwData) {
    let height = sgwData.resources? 35: 50;
    return create_instance(sgwData, create_svg("images/syncgateway.svg",height));
    /*
    "                          <div class=\"flex-row max-w-100 py-2 my-0\">\n" +
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
        "                                </div>\n";*/
}

function create_sgwGroups(data) {
    let versionBorder = data.version ? "border-b-2 "+defaultTheme.mobile.version.lineColor: "";
    let sgwGroups = "";
    let position = 0;
    const visibleGroups = data.groups.length > 1;
    data.groups.forEach(g => {
        sgwGroups += create_sgwGroup(g, visibleGroups, position);
        position++;
    });

    return "<div class=\"flow-column  \">" +
        "<div class=\"mx-8 mb-2 mt-8 flex flex-wrap font-bold lg:space-x-4 font-bold text-red-700 text-center align-center "+versionBorder+" \">" +
        sgwGroups+
        "</div>"+
    // create_resources(data.mobile.resources)+
        create_version(data.version)+
        "</div>";
}


function create_database_header_table() {
    return "                               <thead class=\"border-b-2 border-orange-400\">\n" +
        "                                    <tr>\n" +
        "                                        <th class=\"px-2 py-1 text-xs text-gray-500\">\n" +
        "                                            Databases\n" +
        "                                        </th>\n" +
        "                                    </tr>\n" +
        "                                    </thead>\n";
}


function create_database_table_body_row(database) {
    const cfg = defaultTheme.mobile.databases;

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
    const cfg = defaultTheme.mobile.network;


    return "<div class=\"mx-2 flex-column\">" +
        "<div class=\"text-xs "+cfg.urlColor+" text-right \"><p>"+data.publicAddress+"</p></div>"+
        "<div class=\"z-10 border-b-2 border-black-400 border-dashed\"></div>"+
        "<div class=\"grid justify-items-center \">"+
        "   <div class=\"-my-3 mx-10 px-6 py-1 text-xs "+cfg.textColor+" font-bold " + cfg.color + " rounded-xl shadow-400\"><i class=\"" + cfg.icon + "\"><span class='px-2'>"+cfg.displayText+"</span></i></div>\n"+
        "</div>"+
    "</div>";
}

function create_version(version) {
    return version ?  "<div class=\"flex flex-row-reverse \">" +
        "    <span class=\""+defaultTheme.mobile.version.color+" border-white border-4 rounded-xl text-xs text-white font-bold mx-2 px-2 mb-0 -mt-4 py-0\">v" + version + "</span>" +
        "</div>": "";
}

function create_mobile(data) {
    return data ? "<div class=\"flex-column mb-2 -pb-2\">" +
        create_mobile_clients(data.clients)+
        create_load_balancer(data)+
          "<div class=\"mx-2 -my-2 flex flex-row font-bold font-bold text-red-700 text-center text-xs \">" +
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
        "  <div class=\"flex-column align-center \">"+
        "   <div class=\"m-4 flex-row border-4 rounded-xl border-red-700 font-bold font-bold text-red-700 text-center shadow-xl align-left\">" +
        add_cluster_name(data.name) +
        create_server_groups(data.serverGroups) +
        create_resources(data.resources) +
        create_cluster_version(data.version) +
        "      </div>" +
        "  </div>"+
        "  <div class=\"flex-column \">"+
        "   <div class=\"m-4 flex-row shadow-sm \">" +
        create_buckets(data.buckets) +
        "      </div>" +
        "  </div>" +
        "</div>" +
        "</div>";
}

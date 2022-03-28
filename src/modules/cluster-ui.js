import {create_resources, normalize} from "./utils.js"
import {defaultTheme} from "./theme.js"

export function create_server_topology(data) {
    return   data ?      "   <div class=\"m-4 flex-row border-4 rounded-xl border-red-700 font-bold font-bold text-red-700 text-center shadow-xl align-left\">" +
        add_cluster_name(data.name) +
        create_server_groups(data.serverGroups) +
        create_resources(data.resources) +
        create_cluster_version(data.version) +
        "      </div>" : "" ;
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

function add_node_name(name) {
    let hidden = name ? "" : "hidden";
    const displayName = normalize(name, 9);
    return "   <p class=\"flex-row text-xs text-gray-400 font-bold " + hidden + " \">" + displayName + "</p>"
}




function add_node_image(resources) {
    let height = resources ? 50 : 60;
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

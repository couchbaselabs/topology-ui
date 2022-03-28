import {defaultTheme} from "./theme.js";
import {create_svg_icon, create_instance, create_svg} from "./utils.js";


export function create_mobile(data) {
    return data ? "<div class=\"flex-column mb-2 -pb-2\">" +
        create_mobile_clients(data.clients) +
        create_load_balancer(data) +
        "<div class=\"mx-2 -my-2 flex flex-row font-bold font-bold text-red-700 text-center text-xs \">" +
        create_sgwGroups(data) +
        create_mobile_databases(data.databases) +
        "</div>" +
        "</div>" : "";
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

function create_mobile_client(data) {
    let showResources = data.languages || data.versions ? "" : "hidden";
    return "                          <div class=\"flex-column max-w-100 py-2 my-0 space-y-0\">\n" +
        "                                    <p class=\"text-xs text-gray-400 font-bold text-center\">" + (data.name ? data.name : "") + "</p>\n" +
        "                                    <div class=\"px-2 flex flex-row\">" +
        "                                            <div class=\"m-1 " + (data.total ? "" : "hidden") + "\"><span class=\"p-1 rounded-full bg-black text-white font-bold text-xs\">" + data.total + "x</span></div>" +
        "                                            <svg width=\"30\" height=\"40\">\n" +
        "                                                <image width=\"30\" height=\"40\" preserveAspectRatio=\"none\" xlink:href=\"images/couchbaselite.svg\" />\n" +
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

function create_os_icon(os) {
    return create_svg_icon("images/os-" + os + ".svg");
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



function create_load_balancer(data) {
    const cfg = defaultTheme.mobile.network;

    return "<div class=\"mx-2 flex-column\">" +
        "<div class=\"text-xs " + cfg.urlColor + " text-right \"><p>" + data.publicAddress + "</p></div>" +
        "<div class=\"z-10 border-b-2 border-black-400 border-dashed\"></div>" +
        "<div class=\"grid justify-items-center \">" +
        "   <div class=\"-my-3 mx-10 px-6 py-1 text-xs " + cfg.textColor + " font-bold " + cfg.color + " rounded-xl shadow-400\"><i class=\"" + cfg.icon + "\"><span class='px-2'>" + cfg.displayText + "</span></i></div>\n" +
        "</div>" +
        "</div>";
}


function create_sgwInstance(sgwData) {
    let height = sgwData.resources ? 35 : 50;
    return create_instance(sgwData, create_svg("images/syncgateway.svg", height));
}

function create_sgwGroups(data) {
    let versionBorder = data.version ? "border-b-2 " + defaultTheme.mobile.version.lineColor : "";
    let sgwGroups = "";
    let position = 0;
    const visibleGroups = data.groups.length > 1;
    data.groups.forEach(g => {
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


function create_sgwGroup(sgwGroupInstances, visibleGroups, position) {
    let syncGatewayInstances = "";
    let cfg = defaultTheme.mobile.groups[position % defaultTheme.mobile.groups.length];
    let sgName = sgwGroupInstances.name;

    sgwGroupInstances.instances.forEach(n => syncGatewayInstances += create_sgwInstance(n));

    return visibleGroups ? "<div  class=\"my-2 border-2 " + cfg.border + "  border-dotted \">" +
        "          <div class=\"-my-2 flex-row align-center\">" +
        "             <span class=\"" + cfg.color + " z-5 rounded-xl text-xs text-white font-bold mx-4 px-4 my-0 py-0\">" + sgName + "</span>" +
        "          </div>" +
        "          <div class=\"flex flex-wrap \">" +
        syncGatewayInstances +
        //  create_resources(sgwGroupInstances.resources)+
        "          </div>" +
        "</div>" : "<div  class=\"-mt-4 mb-0 \">" +
        "          <div class=\"flex flex-wrap \">" +
        syncGatewayInstances +
        //  create_resources(sgwGroupInstances.resources)+
        "          </div>" +
        "</div>";
}



function create_version(version) {
    return version ? "<div class=\"flex flex-row-reverse \">" +
        "    <span class=\"" + defaultTheme.mobile.version.color + " border-white border-4 rounded-xl text-xs text-white font-bold mx-2 px-2 mb-0 -mt-4 py-0\">v" + version + "</span>" +
        "</div>" : "";
}

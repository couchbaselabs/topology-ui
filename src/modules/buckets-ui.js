import { create_svg_icon, format_mb, format_docs } from "./utils.js"
import { defaultTheme } from "./theme.js"


function create_buckets(buckets) {
    return buckets ?
        "     <div class=\"flex flex-col flex-nowrap\">\n " +
        create_buckets_grid_table(buckets) +
        "     </div> "
        : "";
}

function create_connector_icon(data) {
    return create_svg_icon("/images/connector-" + data + ".svg");
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

function create_cell_span(value, color) {
    return value? "        <span class=\"px-2 py-1 text-xs text-white font-bold " + color + " rounded-xl shadow-400\">" + value + "</span>\n" : "--";
}

function format_ratio(data) {
    return data ? data+" % ":data;
}

function create_grid_body_row(data) {
    let type = data.type ? data.type : "default";
    let cfg = get_bucket_config(type);
    let columnColors = [data.type === "total" ? "bg-gray-800" : "bg-gray-400", data.type === "total" ? "bg-gray-800" : "bg-amber-400", "bg-orange-400", "bg-yellow-800"];

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
        "        <i class=\"" + cfg.icon + "  pl-1\"><span class=\"px-2\">" + data.name + "   </span>" + "</i>" + total +
        "      </div>\n" +
        "    </div>" +
        "    <div class=\"grid grid-nowrap text-xs text-gray-900 break-normal\">\n" +
        // "        <span class=\"px-2 py-1 text-xs text-white font-bold " + columnColors[0] + " rounded-xl shadow-400\">" + format_mb(data.quota) + "</span>\n" +
        create_cell_span(format_mb(data.quota), columnColors[0])+
        "    </div>\n" +
        "    <div class=\"grid grid-nowrap text-xs text-gray-900\">\n" +
       //  "        <span class=\"px-2 py-1 text-xs text-white font-bold " + columnColors[1] + " rounded-xl shadow-400\">" + format_docs(data.documents) + "</span>\n" +
        create_cell_span(format_docs(data.documents), columnColors[1])+
        "    </div>\n" +
        "    <div class=\"grid grid-nowrap text-xs text-gray-900\">\n" +
        // get_ratio_value(data) +
        create_cell_span(format_ratio(data.ratio), get_ratio_value(data))+
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
    return data ?
        "<div class=\"grid grid-cols-1 shadow-sm m-4 \">" +
        create_grid_header() +
        create_grid_body(data) +
        create_grid_summary(data) +
        "</div>"
        : "";
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
    let numDocs = data && data.documents ? format_docs(data.documents, 2) : "--";
    let ttl = data.ttl ? "" + data.ttl : "";
    let connectors = data.connectors ? get_connectors(data.connectors) : "";
    return (data && data.name) ?
        "   <div class=\"grid col-start-1 col-span-2 grid-nowrap mb-1 content-center justify-self-stretch justify-items-start px-2 text-xs text-white font-bold " + cfg.collections.color + " rounded-xl shadow-400\">" +
        "      <div class=\"flex flex-row flex-nowrap justify-self-stretch items-center\">" +
        "        <i class=\"pl-1 " + cfg.collections.icon + "\"><span class=\"px-2\">" + data.name + "   </span>" + "</i>" +
        "      </div>\n" +
        "   </div>" +
        "   <div class=\"grid col-start-4 grid-nowrap content-center justify-items-center px-2 text-center text-xs text-gray-300 \">" +
        "       <p> " + numDocs + "</p>" +
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
    let numDocs = data.documents ? format_docs(data.documents, 2) : "--";
    let marginBottom = "mb-1";
    let scopeIcon = cfg.scopes.iconFold;
    if (data.collections && data.collections.length > 0) {
        collections = "<div class=\"grid grid-cols-8 text-xs text-gray-200 text-center font-bold p-1 ml-1\">";
        data.collections.forEach(c => collections += create_collection(c, cfg));
        collections += "</div>";
        marginBottom = "";
        scopeIcon = cfg.scopes.iconExtend;
        // TODO add total collections per scope: total = "<p class=\" px-1 bg-white rounded-full text-blue-400 \">" + data.collections.length + " </p>";
    }

    return "<div class='grid grid-cols-8 " + cfg.scopes.color + " rounded-md shadow-xs ml-1 " + marginBottom + "'>" +
        "   <div class=\"grid col-start-1 col-span-2 grid-nowrap content-center justify-self-stretch justify-items-start px-2 text-xs text-white font-bold \">" +
        "        <i class=\"pl-1 " + scopeIcon + "\"><span class=\"px-2\">" + data.name + "   </span>" + "</i>" +
        "   </div>" +
        "   <div class=\"grid col-start-4 grid-nowrap content-center justify-self-stretch justify-items-center px-2 text-center text-xs text-gray-400 font-bold\">" +
        "       <p> " + numDocs + "</p>" +
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
    if (data.type === "magma") {
        // Magma buckets works with a minimum of 2% of Memory Resident Ratio
        statusLevelColor = ratio < 2 ? "bg-red-200" : "bg-green-400";
    } else {
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
    }

    //TODO replace per create_cell_span
    return statusLevelColor;
      /* (data.ratio ?
        "        <span class=\"px-2 py-1 text-xs font-bold " + statusLevelColor + " rounded-xl shadow-400\">" + data.ratio + " %</span>\n" :
        "        <div class=\"text-xs text-gray-900 font-bold text-center\">\n" +
        "          --\n" +
        "        </div>\n")*/
}

export { create_buckets }

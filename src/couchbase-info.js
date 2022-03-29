import { create_buckets } from './modules/buckets-ui.js'
import {create_server_topology} from './modules/cluster-ui.js'
import {create_mobile} from './modules/mobile-ui.js'
import {create_apps} from './modules/sdkapps-ui.js'

 export function create_cluster(content, data) {
    content.innerHTML = "<div class=\"flex flex-col justify-content-center\">" +
        "<div class=\"flex flex-row justify-content-center items-center \">" +
        create_mobile(data.mobile) +
        create_apps(data.applications) +
        "</div>" +
        "<div class=\"flex flex-row auto-rows-auto\">" +
        "  <div class=\"flex-col align-center grow \">" +
        create_server_topology(data)+
        "  </div>" +
        "  <div class=\"flex flex-col flex-nowrap  shrink-0 \">" +
        "   <div class=\"flex flex-row flex-nowrap  \">" +
        create_buckets(data.buckets) +
        "      </div>" +
        "  </div>" +
        "</div>" +
        "</div>";
}


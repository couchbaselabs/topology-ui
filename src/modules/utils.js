import { defaultTheme } from "./theme.js";

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
}

function create_svg_icon(src) {
    return " <svg width=\"14\" height=\"14\">\n" +
        "       <image width=\"14\" height=\"14\" preserveAspectRatio=\"none\" xlink:href=\"" + src + "\" />\n" +
        " </svg> ";
}

function normalize(name, maxLength) {
    if (name && name.length > maxLength) {
        return name.substr(0, 2) + " ... " + name.substr(-4, 6)
    }
    return name
}

function format_mb(megabytes, decimals) {
    return format_number(megabytes, 1024, ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], decimals)
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

export { create_svg, create_instance, create_resources, create_svg_icon, normalize, format_mb, format_docs }
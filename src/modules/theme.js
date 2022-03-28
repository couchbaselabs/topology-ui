export const defaultTheme = {
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


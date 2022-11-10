let data =
        {
            name: "cb-demo",
            version: "6.6.5",
            serverGroups: [
                {
                    name: "serverGroup1",
                    nodes: [
                        {
                            name: "cb-demo0000",
                            services: [
                                "Data",
                                "Query",
                                "Index"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0001",
                            services: [
                                "Data",
                                "Query",
                                "Index"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0002",
                            services: [
                                "Data",
                                "Query",
                                "Index"
                            ],
                            status: "HEALTHY"
                        }
                    ],
                    status: "HEALTHY"
                }
            ],
            buckets: [{ name: "mybucket", type: "couchbase", documents: 39000000, replicas:1, ratio: 70},
                { name: "target", type: "magma", replicas:1, ratio: 1},
                { name: "meta", type: "couchbase", documents: 2000, ratio: 50, replicas:1}
                ],
            status: "HEALTHY"
        }


export { data };
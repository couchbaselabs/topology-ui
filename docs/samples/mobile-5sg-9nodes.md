# **mobile** - 2 Clients Couchbase Lite languages, 2 groups of 5 Sync Gateways and 3 server groups.

![Cluster overview](../assets/5sgw_3sg.png)

```javascript
    let data =
        {
            name: "cb-demo",
            version: "6.6.3",
            resources: {
                memory: "128",
                cpus: "8"
            },
            serverGroups: [
                {
                    name: "serverGroup1",
                    nodes: [
                        {
                            name: "cb-demo0000",
                            resources: {
                                memory: "256",
                                cpus: "16"
                            },
                            services: [
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
                                "Index",
                                "Analytics"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0002",
                            services: [
                                "Data",
                                "Query",
                                "Index",
                                "Analytics"
                            ],
                            status: "HEALTHY"
                        }
                    ],
                    status: "HEALTHY"
                },
                {
                    name: "serverGroup2",
                    nodes: [
                        {
                            name: "cb-demo0003",
                            resources: {
                                memory: "256",
                                cpus: "16"
                            },
                            services: [
                                "Data",
                                "Query",
                                "Index",
                                "Analytics"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0004",
                            services: [
                                "Data",
                                "Query",
                                "Index",
                                "Analytics"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0005",
                            services: [
                                "Data",
                                "Query",
                                "Index",
                                "Analytics"
                            ],
                            status: "HEALTHY"
                        }
                    ],
                    status: "HEALTHY"
                },
                {
                    name: "serverGroup3",
                    nodes: [
                        {
                            name: "cb-demo0006",
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0007",
                            services: [
                                "Data",
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0008",
                            services: [
                                "Query",
                                "Index"
                            ],
                            resources: {
                                memory: "256",
                                cpus: "16"
                            },
                            status: "HEALTHY"
                        }
                    ],
                    status: "HEALTHY"
                }
            ],
            buckets: [{ name: "mybucket", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
                { name: "mybucket2", quota: 5590, type: "ephemeral", documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
                { name: "mybucket3", quota: 5590, type: "magma", documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]}],
            status: "HEALTHY",
            mobile: {
                resources: {
                    memory: 32,
                    cpus: 8
                },
                groups : [{
                    name:"Group1 - Import=true",
                    instances: [
                        {
                            nodeIp: "10.0.0.9",
                            name: "SG 1",
                            resources: {
                                memory: 32,
                                cpus: 8
                            }
                        },
                        {
                            nodeIp: "10.0.0.10",
                            name: "SG 2",
                            resources: {
                                memory: 32,
                                cpus: 8
                            }
                        }]
                },
                    {
                        name:"Group2 - Import=false",
                        instances: [
                            {
                                nodeIp: "10.0.0.11",
                                name: "SG 3",
                                resources: {
                                    memory: 32,
                                    cpus: 8
                                }
                            },
                            {
                                nodeIp: "10.0.0.12",
                                name: "SG 4",
                                resources: {
                                    memory: 32,
                                    cpus: 8
                                }
                            },
                            {
                                nodeIp: "10.0.0.13",
                                name: "SG 5",
                                resources: {
                                    memory: 32,
                                    cpus: 8
                                }
                            }]
                    }],
                databases: [{name: "mobileDatabase" },{name: "db2" }],
                publicAddress: "https://mypublicdns.com",
                clients: [{ name:"front-end App", versions: ["3.0"], os:["windows","ios","android"], language: "Java", roles:[""], total:50},{ name:"front-end App2", versions: ["3.0"], os:["windows","ios","android"], language: ".Net"}]
            },
            applications: {},
            connectors: {}
        }
```
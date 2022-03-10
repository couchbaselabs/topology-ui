# JavaScript Couchbase Topology UI Viewer using Tailwind CSS
Couchbase Topology UI Viewer is a JavaScript Library to display Couchbase Cluster Topology, Services and Buckets details in your preferrable html browser: 

![overview](./assets/overview-mobile.png)

## Get Started 

### Dependencies

**Tailwind CSS** helps you to rapidly build modern websites without ever leaving your HTML. A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.


```
<!DOCTYPE html>
<html lang="en">
<head>
    ...
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
    ...
</head>
```

* **[Optional]Fontawesome** The easiest way to get icons on your website is with a Kit. It's your very own custom version of Font Awesome, all bundled up with only the icons, tools, and settings you need. [https://fontawesome.com](https://fontawesome.com/start)



* **[Optional]JsonEditor** is a web-based tool to view, edit, format, and validate JSON. It has various modes such as a tree editor, a code editor, and a plain text editor.

The editor can be used as a component in your own web application. The library can be loaded as CommonJS module, AMD module, or as a regular javascript file.

* [https://github.com/josdejong/jsoneditor](https://github.com/josdejong/jsoneditor)


### Topology Viewer

```
<head>
    <meta charset="UTF-8">
    <title>Couchbase Info CSS</title>
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet">
    <script src="js/couchbase-info.js"></script>
    ...
</head>
<body>
<div class="container">
    <main class="container-fluid">
        <div class="row justify-content-center">
            <div id="display" class="flex justify-content-center">
                <!-- cluster topology display would be here -->
            </div>
        </div>
          ....
    </main>
</div>
<script>
    var data =
        {
				... topology data here ...
        }
    let content = document.getElementById("display");
    create_cluster(content, data);
</script>
</body>
```

## Data Structure

```
let data = {
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
                clients: [{ name:"front-end App", versions: ["3.0"], os:["windows","ios","android"], language: "Java", total:50},{ name:"front-end App2", versions: ["3.0"], os:["windows","ios","android"], language: ".Net"}]
            },
            applications: {},
            connectors: {}
        };
```

### Data Structure Properties

* **name**: display name of the cluster 
* **version**: cluster version
* **resources**: If all/majority of nodes have the same hardware (cpu/memory) you can fill the resources at the cluster level instead of individual nodes.  

```
{
  memory: "128",
  cpus: "8"
}
            
```
            
* **serverGroups**: Array of Server Groups. Each Server Group contains the information of the Server Group name, list of nodes and status. 

```
[
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
                        ...
                    ],
                    status: "HEALTHY"
                },
                {
                    name: "serverGroup2",
                    ...
                } 
            ]
```

* **buckets**: Array of Buckets.     

```   
 buckets: [{ name: "mybucket", type: "couchbase" , quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic", "spark"]},
           { name: "mybucket2", type: "ephemeral", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic", "spark"]},
           { name: "mybucket3", type: "magma"    , quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic", "spark"]}]     
```

*Note: Information at the scope/collections level is not supported yet.* 

* **status**: Status of the cluster. 

* **mobile**: Sync Gateway and Couchbase Lite topology information

```json
 mobile: {
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
                        ...]
                   },
                   {
                        name:"Group2 - Import=false",
                        instances: [
                            {
                                nodeIp: "10.0.0.11",
                                name: "SG 3"
                            },
                            ... ]
                   }],
                databases: [{name: "mobileDatabase" },
                            {name: "db2" }],
                publicAddress: "https://mypublicdns.com",
                clients: [{ name:"front-end App", versions: ["3.0"], os:["windows","ios","android"], language: "Java", total:50}, 
                          { name:"front-end App2", versions: ["3.0"], os:["windows","ios","android"], language: ".Net"}]
            }
```

* **Applications**: TBD

* **Connectors**: TBD



## Topologies Samples:



* **3 Nodes with Data, Query and Index Services with homogenous cpu/memory resources**:

![Server Groups Sample](./assets/simpleTopology.png)

```
    let data = {
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
            buckets: [{ name: "mybucket", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
        { name: "mybucket2", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
        { name: "mybucket3", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]}],
        status: "HEALTHY"
    }
```


* **3 Data Nodes, 2 Query/Index Nodes**:


![Cluster Overview](./assets/3Data2Query.png)

```
    var data =
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
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0001",
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0002",
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0003",
                            services: [
                                "Query",
                                "Index"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0004",
                            services: [
                                "Query",
                                "Index"
                            ],
                            status: "HEALTHY"
                        }
                    ],
                    status: "HEALTHY"
                }
            ],
            buckets: [{ name: "mybucket", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
                { name: "mybucket2", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
                { name: "mybucket3", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]}],
            status: "HEALTHY"
        }
```

* **3 Data Nodes, 2 Query/Index Nodes, 2 FTS/Eventing Nodes**:

![Cluster Overview](./assets/3Data2Query2Eventing.png)

```
    var data =
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
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0001",
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0002",
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0003",
                            services: [
                                "Query",
                                "Index"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0004",
                            services: [
                                "Query",
                                "Index"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0005",
                            services: [
                                "FTS",
                                "Eventing"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0006",
                            services: [
                                "FTS",
                                "Eventing"
                            ],
                            status: "HEALTHY"
                        }
                    ],
                    status: "HEALTHY"
                }
            ],
            buckets: [{ name: "mybucket", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
                { name: "mybucket2", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
                { name: "mybucket3", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]}],
            status: "HEALTHY"
        }
```

* **9 Nodes distributed accross 3 Server Group And non homogenous cpu/memory resources**: 

![Server Groups Sample](./assets/3sg-cluster-sample.png)


```
let data = {
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
             buckets: [{
                name: "mybucket",
                quota: 5590,
                documents: 39000000,
                ratio: 49,
                "replicas": 1,
                "connectors": ["mobile", "kafka", "elastic"]
            },
            {
                name: "mybucket2",
                quota: 5590,
                documents: 39000000,
                ratio: 49,
                "replicas": 1,
                "connectors": ["mobile", "kafka", "elastic"]
            },
            {
                name: "mybucket3",
                quota: 5590,
                documents: 39000000,
                ratio: 49,
                "replicas": 1,
                "connectors": ["mobile", "kafka", "elastic"]
            }],
            status: "HEALTHY"
        };
    let content = document.getElementById("display");
    create_cluster(content, data);
```

* **mobile** - 2 Sync Gateways and 3 data,query,index nodes

![Cluster Overview](assets/2sgw_3nodes.png)

```json
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
                }],
                databases: [{name: "mobileDatabase" },{name: "db2" }],
                publicAddress: "https://mypublicdns.com",
                clients: [{ name:"front-end App", versions: ["3.0"], os:["windows","ios","android"], language: "Java", total:50}]
            },
            applications: {},
            connectors: {}
        }
```

* **mobile** - 2 Sync Gateway Groups, 3 data and 2 query/index nodes

![Cluster Overview](assets/5sgw_3data_2queryIndex.png)

```json
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
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0001",
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0002",
                            services: [
                                "Data"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0003",
                            services: [
                                "Query",
                                "Index"
                            ],
                            status: "HEALTHY"
                        },
                        {
                            name: "cb-demo0004",
                            services: [
                                "Query",
                                "Index"
                            ],
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

* **mobile** - 2 Clients Couchbase Lite languages, 2 groups of 5 Sync Gateways and 3 server groups.

![Cluster overview](assets/5sgw_3sg.png)

```json
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
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
            buckets: [{ name: "mybucket", scopes: [{ name: "scope1", collections:[{name: "collection1"} ]}], type: "couchbase", quota: 5590, documents: 39000000, replicas:1, ratio: 49, connectors: ["mobile","kafka", "elastic", "spark"]},
                { name: "mybucket2", scopes: [{ name: "scope1", documents: 39000000, collections:[{name: "collection1", documents: 39000000}]}], type: "ephemeral", quota: 5590, documents: 39000000, ratio: 32, replicas:1, connectors: ["mobile","kafka", "elastic"]},
                { name: "mybucket3", scopes: [{ name: "scope1", documents: 34000000},{ name: "scope2", documents: 5000000, collections:[{name: "collection1", documents: 5000000}]}], type: "magma", quota: 5590, replicas:1, documents: 39000000, ratio: 75, connectors: ["mobile","kafka", "elastic"]}],
            status: "HEALTHY",
            mobile: {
                version: "2.8.3",
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
                databases: [{name: "mobileDatabase", from: "mybucket" },{name: "db2", from: "mybucket2"  }],
                publicAddress: "https://mypublicdns.com",
                clients: [{ name:"front-end App", versions: ["3.0"], os:["windows","ios","android"], language: "Java", total:50}]
            },
            applications: {},
            connectors: {}
        }

/*   
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
                          name: "cb-demo0001",
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
                          name: "cb-demo0001",
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
                          name: "cb-demo0001",
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
                          name: "cb-demo0001",
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
                          name: "cb-demo0001",
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
                          name: "cb-demo0001",
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
                          name: "cb-demo0001",
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
                          name: "cb-demo0001",
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
          buckets: [{ name: "mybucket", scopes: [{ name: "scope1", collections:[{name: "collection1"} ]}], type: "couchbase", quota: 5590, documents: 39000000, replicas:1, ratio: 49, connectors: ["mobile","kafka", "elastic", "spark"]},
              { name: "mybucket2", scopes: [{ name: "scope1", documents: 39000000, collections:[{name: "collection1", documents: 39000000}]}], type: "ephemeral", quota: 5590, documents: 39000000, ratio: 32, replicas:1, connectors: ["mobile","kafka", "elastic"]},
              { name: "mybucket3", scopes: [{ name: "scope1", documents: 34000000},{ name: "scope2", documents: 5000000, collections:[{name: "collection1", documents: 5000000}]}], type: "magma", quota: 5590, replicas:1, documents: 39000000, ratio: 75, connectors: ["mobile","kafka", "elastic"]}],
          status: "HEALTHY",
          mobile: {
              version: "2.8.3",
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
              databases: [{name: "mobileDatabase", from: "mybucket" },{name: "db2", from: "mybucket2"  }],
              publicAddress: "https://mypublicdns.com",
              clients: [{ name:"front-end App", versions: ["3.0"], os:["windows","ios","android"], language: "Java", total:50}]
          },
          applications: {},
          connectors: {}
      }
*/

/*
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
        buckets: [{ name: "mybucket", scopes: [{ name: "scope1", collections:[{name: "collection1"} ]}], type: "couchbase", quota: 5590, documents: 39000000, replicas:1, ratio: 49, connectors: ["mobile","kafka", "elastic", "spark"]},
            { name: "mybucket2", scopes: [{ name: "scope1", documents: 39000000, collections:[{name: "collection1", documents: 39000000}]}], type: "ephemeral", quota: 5590, documents: 39000000, ratio: 32, replicas:1, connectors: ["mobile","kafka", "elastic"]},
            { name: "mybucket3", scopes: [{ name: "scope1", documents: 34000000},{ name: "scope2", documents: 5000000, collections:[{name: "collection1", documents: 5000000}]}], type: "magma", quota: 5590, replicas:1, documents: 39000000, ratio: 75, connectors: ["mobile","kafka", "elastic"]}],
        status: "HEALTHY"
    };

*/

export { data };